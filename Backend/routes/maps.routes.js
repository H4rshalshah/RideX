const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mapController = require('../controllers/map.controller');
const { query } = require('express-validator');

router.get('/get-coordinates',
    query('address').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getCoordinates
);

router.get('/reverse-geocode',
    query('ltd').isFloat(),
    query('lng').isFloat(),
    authMiddleware.authUser,
    mapController.getAddressFromCoordinates
);

router.get('/get-route',
    query('origin').isString().isLength({ min: 5 }),
    query('destination').isString().isLength({ min: 5 }),
    authMiddleware.authUser,
    mapController.getRoute
)

router.get('/get-distance-time',
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getDistanceTime
)

// Public autocomplete — used by the landing-page search card before login.
// Returns only place names, no user data, so it needs no auth.
router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }),
    mapController.getAutoCompleteSuggestions
)



module.exports = router;