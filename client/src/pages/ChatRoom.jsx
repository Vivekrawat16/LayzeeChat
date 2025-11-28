import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { PhysicsProvider } from '../context/PhysicsContext';
import PhysicsChatBubble from '../components/PhysicsChatBubble';
import FloatingVideo from '../components/FloatingVideo';
import { Send, SkipForward, Flag, Loader2 } from 'lucide-react';

const ChatRoomContent = () => {
    const {
        stream,
        myVideo,
        userVideo,
        callAccepted,
        partnerId,
        isSearching,
        findPartner,
        nextPartner,
        messages,
        sendMessage,
        reportUser,
        startChat,
        onlineUsers,
        matchedTag
    } = useSocket();

    const location = useLocation();
    const tags = location.state?.tags || [];

    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        // Start media and search when entering chat, passing selected tags
        startChat(tags);
    }, []);

    const handleSendMessage = () => {
        if (messageInput.trim() && partnerId) {
            sendMessage(messageInput);
            setMessageInput('');
        }
    };

    const handleNext = () => {
        nextPartner(tags);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="h-screen bg-md-background flex flex-col relative overflow-hidden">

            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-md-1 z-20 relative">
                <div className="flex items-center gap-3">
                    {/* Google-style Multi-color Logo */}
                    <div className="font-display text-2xl font-bold">
                        <span className="text-google-blue">L</span>
                        <span className="text-google-red">a</span>
                        <span className="text-google-yellow">y</span>
                        <span className="text-google-blue">z</span>
                        <span className="text-google-green">e</span>
                        <span className="text-google-red">e</span>
                        <span className="text-google-blue">C</span>
                        <span className="text-google-yellow">h</span>
                        <span className="text-google-green">a</span>
                        <span className="text-google-red">t</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm font-body">
                    {matchedTag && (
                        <span className="px-3 py-1.5 bg-google-blue/10 text-google-blue text-xs font-bold rounded-full uppercase tracking-wider border border-google-blue/20">
                            #{matchedTag}
                        </span>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 bg-google-green rounded-full animate-pulse"></span>
                        <span className="text-gray-600 font-medium">{onlineUsers} online</span>
                    </div>
                </div>
            </header>

            {/* Physics World - Full viewport */}
            <div className="flex-1 relative">
                {/* Floating Videos */}
                {stream && (
                    <FloatingVideo
                        videoRef={myVideo}
                        isLocalUser={true}
                        label="You"
                    />
                )}

                {callAccepted && partnerId && (
                    <FloatingVideo
                        videoRef={userVideo}
                        isLocalUser={false}
                        label="Stranger"
                        anchorY={window.innerHeight * 0.5}
                    />
                )}

                {/* Physics Chat Bubbles */}
                {messages.map((msg, index) => (
                    <PhysicsChatBubble
                        key={msg.id || index}
                        message={msg.text}
                        isUser={msg.sender === 'me'}
                        timestamp={msg.timestamp}
                        initialX={window.innerWidth * (msg.sender === 'me' ? 0.7 : 0.3)}
                    />
                ))}

                {/* Searching State - Rotating balls visual */}
                {isSearching && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-16 h-16 text-google-blue animate-spin" />
                            <div className="glass-blue px-6 py-3 rounded-full shadow-md-3">
                                <p className="text-google-blue font-body font-bold text-lg">
                                    🔍 Finding a stranger...
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls Bar - Fixed, not physics */}
            <div className="relative z-20 bg-white border-t border-gray-200 shadow-md-2 p-4">
                <div className="max-w-5xl mx-auto flex items-center gap-3">
                    {/* Message Input */}
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={partnerId ? "Type a message..." : "Waiting for partner..."}
                        disabled={!partnerId || isSearching}
                        className="flex-1 px-5 py-3 rounded-full border-2 border-gray-200 bg-white font-body text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    {/* Send Button */}
                    <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || !partnerId || isSearching}
                        className="p-3.5 bg-google-blue text-white rounded-full hover:bg-[#5a95f5] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-md-2 hover:shadow-md-3 hover:scale-110 active:scale-95"
                        title="Send message"
                    >
                        <Send className="w-5 h-5" />
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={handleNext}
                        disabled={isSearching}
                        className="px-5 py-3 bg-google-red text-white rounded-full font-body font-bold hover:bg-[#e55347] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-md-2 hover:shadow-md-3 hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        <SkipForward className="w-5 h-5" />
                        Next
                    </button>

                    {/* Report Button */}
                    {partnerId && (
                        <button
                            onClick={reportUser}
                            className="p-3.5 bg-google-yellow text-white rounded-full hover:bg-[#f5c210] transition-all duration-300 shadow-md-2 hover:shadow-md-3 hover:scale-110 active:scale-95"
                            title="Report user"
                        >
                            <Flag className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const ChatRoom = () => {
    return (
        <PhysicsProvider enabled={true} gravity={{ x: 0, y: 1 }}>
            <ChatRoomContent />
        </PhysicsProvider>
    );
};

export default ChatRoom;

