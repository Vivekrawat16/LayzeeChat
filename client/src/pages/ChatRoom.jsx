import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import VideoContainer from '../components/VideoContainer';
import { Send, SkipForward, Flag, Loader2, User } from 'lucide-react';

const ChatRoom = () => {
    const {
        stream,
        myVideo,
        userVideo,
        callAccepted,
        partnerId,
        isSearching,
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
    const messagesEndRef = useRef(null);

    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        // Start media and search when entering chat, passing selected tags
        startChat(tags);
    }, []);

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 md:gap-3">
                    {/* Google-style Multi-color Logo */}
                    <div className="font-display text-lg md:text-2xl font-bold">
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
                <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm font-body">
                    {matchedTag && (
                        <span className="px-2 md:px-3 py-1 md:py-1.5 bg-google-blue/10 text-google-blue text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider border border-google-blue/20">
                            #{matchedTag}
                        </span>
                    )}
                    <div className="flex items-center gap-1 md:gap-2">
                        <span className="inline-block w-2 h-2 md:w-2.5 md:h-2.5 bg-google-green rounded-full animate-pulse"></span>
                        <span className="text-gray-600 font-medium hidden sm:inline">{onlineUsers} online</span>
                        <span className="text-gray-600 font-medium sm:hidden">{onlineUsers}</span>
                    </div>
                </div>
            </header>

            {/* Main Content - Responsive Layout */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Videos Section */}
                <div className="w-full md:w-1/2 p-2 md:p-4 flex flex-row md:flex-col gap-2 md:gap-4 h-48 md:h-auto">
                    {/* Partner Video */}
                    <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden border border-gray-300 shadow-sm relative">
                        <video
                            playsInline
                            autoPlay
                            ref={userVideo}
                            className={`w-full h-full object-cover ${!callAccepted ? 'hidden' : ''}`}
                        />
                        {!callAccepted && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-900">
                                <div className="w-12 h-12 md:w-20 md:h-20 bg-gray-800 rounded-full flex items-center justify-center mb-2 md:mb-3">
                                    <User className="w-6 h-6 md:w-10 md:h-10" />
                                </div>
                                <p className="text-sm md:text-lg font-medium">Stranger</p>
                                {isSearching && (
                                    <div className="mt-2 md:mt-4 flex items-center gap-2 text-google-blue">
                                        <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                                        <span className="text-xs md:text-base">Looking...</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Your Video */}
                    <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden border border-gray-300 shadow-sm relative">
                        <video
                            playsInline
                            muted
                            autoPlay
                            ref={myVideo}
                            className={`w-full h-full object-cover transform scale-x-[-1] ${!stream ? 'hidden' : ''}`}
                        />
                        {!stream && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-900">
                                <div className="w-12 h-12 md:w-20 md:h-20 bg-gray-800 rounded-full flex items-center justify-center mb-2 md:mb-3">
                                    <User className="w-6 h-6 md:w-10 md:h-10" />
                                </div>
                                <p className="text-sm md:text-lg font-medium">You</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Section */}
                <div className="flex-1 w-full md:w-1/2 p-2 md:p-4 flex flex-col min-h-0">
                    <div className="flex-1 bg-white rounded-lg border border-gray-300 shadow-sm flex flex-col overflow-hidden">
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3">
                            {/* Welcome Message */}
                            <div className="text-center text-gray-500 text-xs md:text-sm py-2 md:py-4">
                                <p className="font-semibold text-gray-700 mb-1">Welcome to LayzeeChat!</p>
                                <p className="hidden md:block">You're now chatting with a random stranger. Say hi!</p>
                                <p className="md:hidden">Say hi to a stranger!</p>
                            </div>

                            {/* Messages */}
                            {messages.map((msg, index) => (
                                <div
                                    key={msg.id || index}
                                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] md:max-w-[70%] px-3 md:px-4 py-2 rounded-lg ${msg.sender === 'me'
                                                ? 'bg-google-blue text-white rounded-br-none'
                                                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                            }`}
                                    >
                                        <p className="text-xs md:text-sm break-words">{msg.text}</p>
                                        {msg.timestamp && (
                                            <span className="text-[10px] md:text-xs opacity-70 mt-1 block">
                                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="border-t border-gray-200 p-2 md:p-4 bg-gray-50">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={partnerId ? "Type a message..." : "Waiting..."}
                                    disabled={!partnerId || isSearching}
                                    className="flex-1 px-3 md:px-4 py-2 rounded-full border border-gray-300 bg-white text-sm md:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim() || !partnerId || isSearching}
                                    className="p-2 md:p-2.5 bg-google-blue text-white rounded-full hover:bg-[#5a95f5] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 touch-manipulation"
                                    title="Send message"
                                >
                                    <Send className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="mt-2 md:mt-4 flex items-center gap-2 md:gap-3">
                        <button
                            onClick={handleNext}
                            disabled={isSearching}
                            className="flex-1 px-4 md:px-5 py-2.5 md:py-3 bg-google-red text-white rounded-lg font-body font-bold text-sm md:text-base hover:bg-[#e55347] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 active:scale-95 touch-manipulation"
                        >
                            <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
                            Next
                        </button>
                        {partnerId && (
                            <button
                                onClick={reportUser}
                                className="px-4 md:px-5 py-2.5 md:py-3 bg-gray-200 text-gray-700 rounded-lg text-sm md:text-base hover:bg-gray-300 transition-all flex items-center gap-2 active:scale-95 touch-manipulation"
                                title="Report user"
                            >
                                <Flag className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="hidden sm:inline">Report</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
