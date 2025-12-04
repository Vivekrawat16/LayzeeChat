import React, { createContext, useState, useRef, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { filterMessage } from '../utils/filter';

// Polyfills are handled by vite-plugin-node-polyfills in vite.config.js
// Do not manually overwrite window.Buffer or window.process here as it breaks the polyfill

const SocketContext = createContext();

// Initialize socket
// If in production (served from same origin), use relative path. 
// If dev, use localhost:5000.
const socket = io(import.meta.env.PROD ? '/' : 'http://localhost:5000', {
    transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 20000
});

// Debug connection
socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
});

socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error);
});

socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
});



export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [partnerId, setPartnerId] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState(0);
    const [matchedTag, setMatchedTag] = useState(null);
    const searchTimeoutRef = useRef(null);
    const streamRef = useRef(null);
    const isStreamActiveRef = useRef(false);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        socket.on('me', (id) => setMe(id));

        socket.on('userCount', (count) => {
            setOnlineUsers(count);
        });


        socket.on('partnerFound', ({ partnerId, initiator, matchedTag }) => {
            console.log('✅ Partner found event received!', { partnerId, initiator, matchedTag });
            setIsSearching(false);
            setPartnerId(partnerId);
            setMatchedTag(matchedTag);

            // Clear fallback timeout if it exists
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
                searchTimeoutRef.current = null;
            }

            // initiatePeer is called in the other effect
        });



        socket.on('signal', ({ signal, from }) => {
            console.log('📶 Signal received from:', from);
            if (connectionRef.current) {
                connectionRef.current.signal(signal);
            } else {
                console.warn('⚠️ Signal received but no peer connection exists!');
            }
        });

        socket.on('message', ({ text }) => {
            setMessages(prev => [...prev, { text, isMe: false }]);
        });

        socket.on('partnerDisconnected', () => {
            resetCall();
        });

        return () => {
            socket.off('partnerFound');
            socket.off('signal');
            socket.off('message');
            socket.off('partnerDisconnected');
        };
    }, []);

    // Refactored socket listener to access current stream
    // Socket listener for partner found
    useEffect(() => {
        const handlePartnerFound = ({ partnerId, initiator, matchedTag }) => {
            console.log('🎯 Partner found!', { partnerId, initiator, matchedTag });

            const currentStream = streamRef.current;
            if (!currentStream) {
                console.error('❌ Partner found but no stream available!');
                return;
            }

            setIsSearching(false);
            setPartnerId(partnerId);
            setMatchedTag(matchedTag);

            // Clear fallback timeout if it exists
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
                searchTimeoutRef.current = null;
            }

            initiatePeer(partnerId, initiator, currentStream);
        };

        socket.on('partnerFound', handlePartnerFound);

        return () => {
            socket.off('partnerFound', handlePartnerFound);
        };
    }, []);


    const initiatePeer = (partnerId, initiator, currentStream) => {
        console.log(`🚀 Initiating peer connection. Initiator: ${initiator}, Partner: ${partnerId}`);
        const peer = new Peer({
            initiator,
            trickle: true,
            stream: currentStream,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:global.stun.twilio.com:3478' }
                ]
            }
        });


        peer.on('signal', (signal) => {
            socket.emit('signal', { signal, to: partnerId });
        });

        peer.on('stream', (remoteStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = remoteStream;
            }
        });

        peer.on('error', (err) => {
            console.error('Peer error:', err);
        });

        connectionRef.current = peer;
        setCallAccepted(true);
    };

    const findPartner = (tags = []) => {
        console.log('🔍 Finding partner with tags:', tags);
        if (streamRef.current) {
            setIsSearching(true);
            setMatchedTag(null);
            resetCall();

            console.log('📡 Emitting findPartner event to server');
            socket.emit('findPartner', { tags });


            // If searching with tags, set a fallback timeout
            if (tags.length > 0) {
                if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

                searchTimeoutRef.current = setTimeout(() => {
                    console.log("No tag match found, falling back to random...");
                    socket.emit('findPartner', { tags: [] }); // Fallback to random
                }, 5000);
            }

        } else {
            console.warn("⚠️ findPartner called but no stream available in ref");
            alert("Please allow camera/microphone access first.");
        }
    };


    const sendMessage = (text) => {
        if (partnerId) {
            const filteredText = filterMessage(text);
            socket.emit('message', { text: filteredText, to: partnerId });
            setMessages(prev => [...prev, { text: filteredText, isMe: true }]);
        }
    };

    const reportUser = () => {
        if (partnerId) {
            socket.emit('report', { partnerId });
            nextPartner();
            alert("User reported. Finding a new partner.");
        }
    };

    const resetCall = () => {
        setPartnerId(null);
        setCallAccepted(false);
        setMatchedTag(null);
        setMessages([]);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = null;
        }

        if (connectionRef.current) {
            connectionRef.current.destroy();
            connectionRef.current = null;
        }
    };

    const nextPartner = (tags = []) => {
        resetCall();
        findPartner(tags);
    };

    const mediaRequestId = useRef(0);

    const enableMedia = async () => {
        const myRequestId = ++mediaRequestId.current;
        try {
            console.log(`📷 Requesting media access... (Request ID: ${myRequestId})`);
            isStreamActiveRef.current = true; // Mark as active before requesting

            const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            // Check if we were stopped while waiting for stream OR if a newer request started
            if (!isStreamActiveRef.current || mediaRequestId.current !== myRequestId) {
                console.log(`🛑 Stream acquired but invalid. Stopping tracks immediately. (Request ID: ${myRequestId}, Current ID: ${mediaRequestId.current}, Active: ${isStreamActiveRef.current})`);
                currentStream.getTracks().forEach(track => track.stop());
                return null;
            }

            console.log(`✅ Media access granted. Stream ID: ${currentStream.id} (Request ID: ${myRequestId})`);
            setStream(currentStream);
            streamRef.current = currentStream; // Store in ref for cleanup
            if (myVideo.current) {
                myVideo.current.srcObject = currentStream;
            }
            return currentStream;
        } catch (err) {
            console.error('Failed to get stream', err);
            return null;
        }
    };

    const startChat = async (tags = []) => {
        try {
            const currentStream = await enableMedia();
            if (!currentStream) return;

            // We can't rely on 'stream' state being updated immediately for findPartner check
            // So we bypass the check or pass true
            setIsSearching(true);
            resetCall();

            // Initial search with provided tags
            findPartner(tags);

        } catch (err) {
            console.error('Failed to start chat', err);
        }
    };

    const stopMedia = () => {
        console.log('🛑 stopMedia called. Stopping tracks...');
        isStreamActiveRef.current = false; // Mark as inactive immediately

        // Use ref to ensure we have the latest stream object even in stale closures
        if (streamRef.current) {
            console.log('🛑 Stopping tracks for stream ID:', streamRef.current.id);
            streamRef.current.getTracks().forEach(track => {
                console.log('🛑 Stopping track:', track.kind, track.label);
                track.stop();
            });
            streamRef.current = null;
        }

        // Double check state stream just in case
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        if (myVideo.current) {
            myVideo.current.srcObject = null;
        }
        if (userVideo.current) {
            userVideo.current.srcObject = null;
        }

        setStream(null);
        socket.emit('leaveChat');
        resetCall();
        setIsSearching(false);
    };
    return (
        <SocketContext.Provider value={{
            socket,
            stream,
            me,
            partnerId,
            callAccepted,
            isSearching,
            messages,
            myVideo,
            userVideo,
            findPartner,
            sendMessage,
            nextPartner,
            reportUser,
            startChat,
            enableMedia,
            stopMedia,
            onlineUsers,
            matchedTag
        }}>
            {children}
        </SocketContext.Provider>
    );
};
