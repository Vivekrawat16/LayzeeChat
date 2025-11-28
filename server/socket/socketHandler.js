const NearbyUser = require('../models/NearbyUser');

let queue = []; // Array of { id, tags }

const pairings = new Map(); // socket.id -> partner.id

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New User Connected:', socket.id);

        // Broadcast user count
        io.emit('userCount', io.engine.clientsCount);

        // --- Standard Matchmaking ---
        socket.on('findPartner', ({ tags = [] } = {}) => {
            // Cleanup previous pairing if any
            const previousPartner = pairings.get(socket.id);
            if (previousPartner) {
                io.to(previousPartner).emit('partnerDisconnected');
                pairings.delete(previousPartner);
                pairings.delete(socket.id);
            }

            // Remove user from queue if they are already there (to avoid duplicates/updates)
            queue = queue.filter(u => u.id !== socket.id);

            let partnerIndex = -1;
            let matchedTag = null;

            if (tags.length > 0) {
                // Priority match: Find someone with at least one matching tag
                partnerIndex = queue.findIndex(u => u.tags.some(t => tags.includes(t)));
                if (partnerIndex !== -1) {
                    const partner = queue[partnerIndex];
                    const commonTags = tags.filter(t => partner.tags.includes(t));
                    matchedTag = commonTags[0];
                }
            }

            // If no tag match found, try random matching with anyone in queue
            if (partnerIndex === -1 && queue.length > 0) {
                // Random match: Take the longest waiting user (first in queue)
                partnerIndex = 0;
                matchedTag = null; // No common tag
            }

            console.log(`📋 Current queue size: ${queue.length}, Looking for match...`);
            console.log(`👤 User ${socket.id} searching with tags:`, tags);

            if (partnerIndex !== -1) {
                const partner = queue.splice(partnerIndex, 1)[0];
                const partnerId = partner.id;

                pairings.set(socket.id, partnerId);
                pairings.set(partnerId, socket.id);

                console.log(`✅ PAIRING SUCCESS: ${socket.id} <-> ${partnerId} (Tag: ${matchedTag || 'Random'})`);

                io.to(socket.id).emit('partnerFound', { partnerId, initiator: true, matchedTag });
                io.to(partnerId).emit('partnerFound', { partnerId: socket.id, initiator: false, matchedTag });
            } else {
                queue.push({ id: socket.id, tags });
                console.log(`⏳ User ${socket.id} added to queue. Queue size: ${queue.length}`);
                console.log(`📋 Current queue:`, queue.map(u => ({ id: u.id, tags: u.tags })));
            }

        });

        // --- Location-Based Matchmaking ---
        { upsert: true, new: true }
                );
} catch (err) {
    console.error('Error finding nearby:', err);
}
        });


socket.on('signal', ({ signal, to }) => {
    io.to(to).emit('signal', { signal, from: socket.id });
});

socket.on('message', ({ text, to }) => {
    io.to(to).emit('message', { text, from: socket.id });
});

socket.on('report', ({ partnerId }) => {
    console.log(`User ${socket.id} reported ${partnerId}`);
    // Here we could log to DB, ban user, etc.
});

socket.on('disconnect', async () => {
    console.log('User Disconnected:', socket.id);
    io.emit('userCount', io.engine.clientsCount); // Update count on disconnect

    // Cleanup Standard Queue
    queue = queue.filter(u => u.id !== socket.id);

    // Cleanup Nearby DB
    try {
        await NearbyUser.deleteOne({ socketId: socket.id });
    } catch (err) {
        console.error('Error removing nearby user:', err);
    }

    const partnerId = pairings.get(socket.id);
    if (partnerId) {
        io.to(partnerId).emit('partnerDisconnected');
        pairings.delete(partnerId);
        pairings.delete(socket.id);

        // If they were in nearby mode, free the partner
        try {
            await NearbyUser.updateOne({ socketId: partnerId }, { isBusy: false });
        } catch (e) { }
    }
});
    });
};
