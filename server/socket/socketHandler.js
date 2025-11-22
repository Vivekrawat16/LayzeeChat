let queue = []; // Array of { id, tags }

const pairings = new Map(); // socket.id -> partner.id

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New User Connected:', socket.id);

        // Broadcast user count
        io.emit('userCount', io.engine.clientsCount);

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

            // If no tag match found (or no tags provided), and we are willing to match randomly (empty tags implies random/fallback)
            if (partnerIndex === -1 && tags.length === 0) {
                // Random match: Take the longest waiting user
                if (queue.length > 0) {
                    partnerIndex = 0;
                }
            }

            if (partnerIndex !== -1) {
                const partner = queue.splice(partnerIndex, 1)[0];
                const partnerId = partner.id;

                pairings.set(socket.id, partnerId);
                pairings.set(partnerId, socket.id);

                io.to(socket.id).emit('partnerFound', { partnerId, initiator: true, matchedTag });
                io.to(partnerId).emit('partnerFound', { partnerId: socket.id, initiator: false, matchedTag });

                console.log(`Paired ${socket.id} with ${partnerId} (Tag: ${matchedTag || 'None'})`);
            } else {
                queue.push({ id: socket.id, tags });
                console.log(`User ${socket.id} added to queue with tags: ${tags}`);
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

        socket.on('disconnect', () => {
            console.log('User Disconnected:', socket.id);
            io.emit('userCount', io.engine.clientsCount); // Update count on disconnect

            queue = queue.filter(u => u.id !== socket.id);

            const partnerId = pairings.get(socket.id);
            if (partnerId) {
                io.to(partnerId).emit('partnerDisconnected');
                pairings.delete(partnerId);
                pairings.delete(socket.id);
            }
        });
    });
};
