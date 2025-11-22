import React, { createContext, useState, useRef, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { filterMessage } from '../utils/filter';

// Polyfill for global (required by simple-peer in Vite)
import * as process from "process";
window.global = window;
window.process = process;
window.Buffer = [];

const SocketContext = createContext();

// Initialize socket
const socket = io('http://localhost:5000'); // TODO: Env var

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [partnerId, setPartnerId] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [messages, setMessages] = useState([]);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        socket.on('me', (id) => setMe(id));

        socket.on('partnerFound', ({ partnerId, initiator }) => {
            setIsSearching(false);
            setPartnerId(partnerId);
            // initiatePeer is called in the other effect
        });

        socket.on('signal', ({ signal, from }) => {
            if (connectionRef.current) {
                connectionRef.current.signal(signal);
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
    useEffect(() => {
        if (!stream) return;

        const handlePartnerFound = ({ partnerId, initiator }) => {
            setIsSearching(false);
            setPartnerId(partnerId);
            initiatePeer(partnerId, initiator, stream);
        };

        socket.on('partnerFound', handlePartnerFound);

        return () => {
            socket.off('partnerFound', handlePartnerFound);
        };
    }, [stream]);


    const initiatePeer = (partnerId, initiator, currentStream) => {
        const peer = new Peer({
            initiator,
            trickle: false,
            stream: currentStream,
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

    const findPartner = () => {
        if (stream) {
            setIsSearching(true);
            resetCall();
            socket.emit('findPartner');
        } else {
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
        setMessages([]);
        if (connectionRef.current) {
            connectionRef.current.destroy();
            connectionRef.current = null;
        }
    };

    const nextPartner = () => {
        resetCall();
        findPartner();
    };

    const startChat = async () => {
        try {
            const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(currentStream);
            if (myVideo.current) {
                myVideo.current.srcObject = currentStream;
            }
            // We can't rely on 'stream' state being updated immediately for findPartner check
            // So we bypass the check or pass true
            setIsSearching(true);
            resetCall();
            socket.emit('findPartner');
        } catch (err) {
            console.error('Failed to get stream', err);
        }
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
            startChat
        }}>
            {children}
        </SocketContext.Provider>
    );
};
