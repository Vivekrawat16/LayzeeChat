let queue = [];
const pairings = new Map(); // socket.id -> partner.id

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New User Connected:', socket.id);

        // Broadcast user count
        io.emit('userCount', io.engine.clientsCount);


        socket.on('findPartner', () => {
            // Cleanup previous pairing if any
            const previousPartner = pairings.get(socket.id);
            if (previousPartner) {
                io.to(previousPartner).emit('partnerDisconnected');
                pairings.delete(previousPartner);
                pairings.delete(socket.id);
            }

            queue = queue.filter(id => id !== socket.id);

            if (queue.length > 0) {
                const partnerId = queue.shift();

                pairings.set(socket.id, partnerId);
                pairings.set(partnerId, socket.id);

                io.to(socket.id).emit('partnerFound', { partnerId, initiator: true });
                io.to(partnerId).emit('partnerFound', { partnerId: socket.id, initiator: false });

                console.log(`Paired ${socket.id} with ${partnerId}`);
            } else {
                queue.push(socket.id);
                console.log(`User ${socket.id} added to queue`);
            }
        });

        socket.on('signal', ({ signal, to }) => {
            io.to(to).emit('signal', { signal, from: socket.id });
        });

        socket.on('message', ({ text, to }) => {
            io.to(to).emit('message', { text, from: socket.id });
        });

    });
});
};
