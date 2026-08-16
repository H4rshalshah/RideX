const axios = require('axios');
const captainModel = require('../models/captain.model');

// Free, keyless providers from the OpenStreetMap ecosystem are used whenever
// Google Maps is unavailable (no key, or the key is rejected). They keep the
// app fully functional for demos and development.
const OSM_HEADERS = { 'User-Agent': 'RideX/1.0 (ride-hailing demo app)' };

// ─── Resilience helpers ────────────────────────────────────────────────
// These public providers rate-limit aggressively (Nominatim allows ~1 req/s),
// so every external call is wrapped in a small retry (with backoff on 429)
// and its result is cached in memory for the rest of the day. Caching also
// means repeated bookings of the same addresses never re-hit the providers.

const cache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function cached(key, fn) {
    const hit = cache.get(key);
    if (hit && hit.expires > Date.now()) {
        return Promise.resolve(hit.value);
    }
    return fn().then((value) => {
        cache.set(key, { value, expires: Date.now() + CACHE_TTL });
        return value;
    });
}

async function withRetry(fn, attempts = 3) {
    let lastError;
    for (let i = 0; i < attempts; i++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            const status = err.response && err.response.status;
            if (status === 429 && i < attempts - 1) {
                // Back off ~1s+ before retrying a rate-limited provider.
                await sleep(1100 * (i + 1));
                continue;
            }
            throw err;
        }
    }
    throw lastError;
}

async function nominatimGeocode(address) {
    return withRetry(async () => {
        const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: { q: address, format: 'json', limit: 1 },
            headers: OSM_HEADERS,
        });
        if (!data || !data.length) {
            throw new Error('Unable to fetch coordinates');
        }
        return { ltd: parseFloat(data[ 0 ].lat), lng: parseFloat(data[ 0 ].lon) };
    });
}

async function nominatimReverse(ltd, lng) {
    return withRetry(async () => {
        const { data } = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: { lat: ltd, lon: lng, format: 'json' },
            headers: OSM_HEADERS,
        });
        if (!data || !data.display_name) {
            throw new Error('Unable to fetch address');
        }
        return data.display_name;
    });
}

// OSRM public routing server — returns distance (m), duration (s) and a
// GeoJSON LineString for the driving route between two coordinates.
async function osrmRoute(origin, destination) {
    const url =
        `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.ltd};${destination.lng},${destination.ltd}`;
    return withRetry(async () => {
        const { data } = await axios.get(url, {
            params: { overview: 'full', geometries: 'geojson' },
            headers: OSM_HEADERS,
        });
        if (!data.routes || !data.routes.length) {
            throw new Error('No routes found');
        }
        const route = data.routes[ 0 ];
        return {
            distance: { value: Math.round(route.distance) },
            duration: { value: Math.round(route.duration) },
            // OSRM gives [lng, lat] pairs; the app uses {ltd, lng} / [lat, lng]
            geometry: route.geometry.coordinates.map(([ lng, lat ]) => [ lat, lng ]),
        };
    });
}

async function photonSuggestions(input) {
    return withRetry(async () => {
        const { data } = await axios.get('https://photon.komoot.io/api/', {
            params: { q: input, limit: 5 },
            headers: OSM_HEADERS,
        });
        return (data.features || [])
            .map((f) => f.properties.label || f.properties.name)
            .filter(Boolean);
    });
}

// Geocode with Google when a working key exists, otherwise Nominatim.
// The result is cached by address so the same pickup/destination string used
// for fares and for captain matching only ever hits the provider once.
async function geocodeAddress(address) {
    const apiKey = process.env.GOOGLE_MAPS_API;
    if (apiKey) {
        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
            const response = await axios.get(url);
            if (response.data.status === 'OK') {
                const location = response.data.results[ 0 ].geometry.location;
                return { ltd: location.lat, lng: location.lng };
            }
        } catch (error) {
            console.error('Google geocode failed, falling back to Nominatim:', error.message);
        }
    }
    return nominatimGeocode(address);
}

const geocodeCached = (address) => cached(`geocode:${address.toLowerCase()}`, () => geocodeAddress(address));

module.exports.getAddressCoordinate = async (address) => {
    return geocodeCached(address);
};

module.exports.getDistanceTime = async (origin, destination) => {
    return cached(`distance:${origin.toLowerCase()}|${destination.toLowerCase()}`, async () => {
        const apiKey = process.env.GOOGLE_MAPS_API;
        if (apiKey) {
            try {
                const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
                const response = await axios.get(url);
                if (response.data.status === 'OK') {
                    if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
                        throw new Error('No routes found');
                    }
                    return response.data.rows[ 0 ].elements[ 0 ];
                }
            } catch (error) {
                console.error('Google distance matrix failed, falling back to OSRM:', error.message);
            }
        }

        const [ originCoords, destCoords ] = await Promise.all([
            geocodeCached(origin),
            geocodeCached(destination),
        ]);
        return osrmRoute(originCoords, destCoords);
    });
};

module.exports.getRoute = async (origin, destination) => {
    const key = `route:${origin.lng},${origin.ltd}|${destination.lng},${destination.ltd}`;
    return cached(key, () => osrmRoute(origin, destination));
};

module.exports.getAutoCompleteSuggestions = async (input) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    if (apiKey) {
        try {
            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
            const response = await axios.get(url);
            if (response.data.status === 'OK') {
                return response.data.predictions.map((prediction) => prediction.description).filter(Boolean);
            }
        } catch (error) {
            console.error('Google autocomplete failed, falling back to Photon:', error.message);
        }
    }
    return cached(`suggestions:${input.toLowerCase()}`, () => photonSuggestions(input));
};

module.exports.getAddressFromCoordinates = async (ltd, lng) => {
    const key = `reverse:${ltd},${lng}`;
    return cached(key, async () => {
        const apiKey = process.env.GOOGLE_MAPS_API;
        if (apiKey) {
            try {
                const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${ltd},${lng}&key=${apiKey}`;
                const response = await axios.get(url);
                if (response.data.status === 'OK') {
                    return response.data.results[ 0 ].formatted_address;
                }
            } catch (error) {
                console.error('Google reverse geocode failed, falling back to Nominatim:', error.message);
            }
        }
        return nominatimReverse(ltd, lng);
    });
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

    // radius in km

    const captains = await captainModel.find({
        status: 'active',
        location: {
            $geoWithin: {
                $centerSphere: [ [ lng, ltd ], radius / 6371 ]
            }
        }
    });

    return captains;


}
