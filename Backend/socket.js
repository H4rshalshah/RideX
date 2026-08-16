const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const rideModel = require('./models/ride.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);


        socket.on('join', async (data) => {
            const { userId, userType } = data;

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });


        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    type: 'Point',
                    coordinates: [ location.lng, location.ltd ]
                }
            });

            // Stream the captain's live position to the rider of any active ride
            try {
                const activeRide = await rideModel.findOne({
                    captain: userId,
                    status: { $in: [ 'accepted', 'ongoing' ] }
                }).populate('user', 'socketId');

                if (activeRide?.user?.socketId) {
                    sendMessageToSocketId(activeRide.user.socketId, {
                        event: 'ride-location-update',
                        data: {
                            rideId: activeRide._id,
                            location: { ltd: location.ltd, lng: location.lng }
                        }
                    });
                }
            } catch (err) {
                console.log('Error streaming captain location:', err.message);
            }
        });

        socket.on('set-status', async (data) => {
            const { userId, status } = data;

            if (!userId || ![ 'active', 'inactive' ].includes(status)) {
                return socket.emit('error', { message: 'Invalid status data' });
            }

            await captainModel.findByIdAndUpdate(userId, { status });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };