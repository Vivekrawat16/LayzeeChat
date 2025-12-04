import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import DeviceSettings from '../components/DeviceSettings';
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
        stopMedia,
        onlineUsers,
        matchedTag,
        isMirrored, // Add this
        faceDetected, // Add this
        setIsInChatRoom // Add this
    } = useSocket();

    const location = useLocation();
    const tags = location.state?.tags || [];
    const messagesEndRef = useRef(null);

    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        // Set guard to true when entering chat
        setIsInChatRoom(true);

        // Start media and search when entering chat, passing selected tags
        startChat(tags);

        // Cleanup media on unmount
        return () => {
            setIsInChatRoom(false); // Set guard to false immediately
            stopMedia();
        };
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
        <div className="h-screen bg-gray-100 flex flex-col font-sans">
            {/* Header */}
            <header className="flex-none flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <div className="font-display text-xl md:text-2xl font-bold tracking-tight">
                        <span className="text-[#4285F4]">L</span>
                        <span className="text-[#EA4335]">a</span>
                        <span className="text-[#FBBC05]">y</span>
                        <span className="text-[#4285F4]">z</span>
                        <span className="text-[#34A853]">e</span>
                        <span className="text-[#EA4335]">e</span>
                        <span className="text-[#4285F4]">C</span>
                        <span className="text-[#FBBC05]">h</span>
                        <span className="text-[#34A853]">a</span>
                        <span className="text-[#EA4335]">t</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    {matchedTag && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded border border-blue-100">
                            #{matchedTag}
                        </span>
                    )}
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-gray-600 font-medium text-xs">{onlineUsers} online</span>
                    </div>


                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-2 md:p-4 gap-2 md:gap-4 max-w-[1600px] mx-auto w-full">

                {/* Left Column: Videos (30% on Desktop, PiP on Mobile) */}
                <div className="flex-none md:w-[30%] flex flex-col h-[45vh] md:h-full min-h-0 relative">
                    {/* Video Wrapper: Relative for Mobile PiP, Flex-Col for Desktop Stack */}
                    <div className="flex-1 relative md:flex md:flex-col md:gap-4">

                        {/* Partner Video */}
                        {/* Mobile: Absolute Full (PiP Base) */}
                        {/* Desktop: Relative Flex-1 (Top Stack) */}
                        <div className="absolute inset-0 md:relative md:inset-auto md:flex-1 bg-black rounded-xl overflow-hidden shadow-sm border border-gray-300 z-0">
                            <video
                                playsInline
                                autoPlay
                                ref={userVideo}
                                className={`w-full h-full object-cover ${!callAccepted ? 'hidden' : ''}`}
                            />
                            {!callAccepted && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#404040] text-white p-4 text-center">
                                    {isSearching ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-10 h-10 animate-spin text-white/50" />
                                            <p className="font-medium text-lg text-white/80">Searching for partner...</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="text-2xl font-bold text-white/20">layzeechat.com</div>
                                            <Flag className="w-6 h-6 text-red-500 absolute bottom-4 right-4" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* My Video */}
                        {/* Mobile: Absolute Top-Right (PiP Overlay) */}
                        {/* Desktop: Relative Flex-1 (Bottom Stack) */}
                        <div className="group absolute top-3 right-3 w-24 h-32 md:static md:w-auto md:h-auto md:flex-1 bg-black rounded-lg md:rounded-xl overflow-hidden border-2 border-white/20 md:border md:border-gray-300 shadow-lg md:shadow-sm z-10 relative">
                            <video
                                playsInline
                                muted
                                autoPlay
                                ref={myVideo}
                                className={`w-full h-full object-cover transition-transform duration-300 group-hover:blur-sm ${!stream ? 'hidden' : ''}`}
                                style={{ transform: isMirrored ? "scaleX(-1)" : "scaleX(1)" }}
                            />
                            {!stream && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-xs text-gray-500">
                                    No Cam
                                </div>
                            )}

                            {/* Face Detection Warning */}
                            {!faceDetected && stream && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-30 p-2 text-center">
                                    <div className="text-white text-xs md:text-sm font-bold flex flex-col items-center gap-1">
                                        <span className="text-xl">🚫</span>
                                        No person detected
                                        <span className="text-[10px] md:text-xs font-normal opacity-80">Please look at the camera</span>
                                    </div>
                                </div>
                            )}

                            <div className="absolute bottom-1 left-1 md:bottom-2 md:left-2 px-1.5 py-0.5 md:px-2 md:py-1 bg-black/50 rounded text-[10px] md:text-xs text-white font-medium backdrop-blur-sm z-20">
                                You
                            </div>

                            {/* Device Settings Overlay */}
                            <DeviceSettings />
                        </div>
                    </div>
                </div>

                {/* Right Column: Chat Interface (70% on Desktop) */}
                <div className="flex-1 md:w-[70%] flex flex-col bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden h-full min-h-0">
                    {/* Chat Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white relative">
                        <div className="py-4 space-y-2">
                            <h2 className="font-bold text-gray-900 text-xl">Welcome to LayzeeChat.</h2>
                            <div className="text-sm text-gray-800 space-y-1">
                                <p className="flex items-center gap-2 font-semibold text-[#6929F6]">
                                    <span className="border border-[#6929F6] rounded-full w-5 h-5 flex items-center justify-center text-xs">18</span>
                                    You must be 18+
                                </p>
                                <p>No nudity, hate speech, or harassment</p>
                                <p>Your webcam must show you, live</p>
                                <p>Do not ask for gender. This is not a dating site</p>
                                <p>Violators will be banned</p>
                            </div>
                        </div>

                        {messages.map((msg, index) => (
                            <div
                                key={msg.id || index}
                                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${msg.sender === 'me'
                                        ? 'bg-[#6929F6] text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                        }`}
                                >
                                    <p className="break-words">{msg.text}</p>
                                </div>
                            </div>
                        ))}

                        {/* Searching Status Overlay in Chat */}
                        {isSearching && (
                            <div className="flex justify-center my-4">
                                <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 animate-pulse">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Searching for partner...
                                </div>
                            </div>
                        )}

                        {/* Face Detection Warning in Chat */}
                        {!faceDetected && stream && (
                            <div className="flex justify-center my-4">
                                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-red-100">
                                    🚫 No person detected — Please look at the camera
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input & Controls Bar */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <div className="flex gap-3 h-14">
                            {/* Large Start Button */}
                            <button
                                onClick={partnerId ? handleNext : () => startChat(tags)}
                                disabled={isSearching || (!faceDetected && stream)} // Disable if searching OR no face detected (but allow if no stream yet, so they can start)
                                className={`
                                    h-full px-8 font-bold text-white text-lg rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center
                                    ${partnerId
                                        ? 'bg-gray-800 hover:bg-gray-900' // Stop/Next style
                                        : 'bg-[#6929F6] hover:bg-[#5b22d6]' // Start style
                                    }
                                    disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]
                                `}
                            >
                                {isSearching ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    partnerId ? "Stop" : "Start"
                                )}
                            </button>

                            {/* Input Area */}
                            <div className="flex-1 relative h-full">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={partnerId ? "Type a message..." : ""}
                                    disabled={!partnerId || isSearching}
                                    className="w-full h-full pl-4 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:border-[#6929F6] focus:ring-1 focus:ring-[#6929F6] bg-white disabled:bg-gray-50 text-lg"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim() || !partnerId}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#6929F6] text-white rounded-lg hover:bg-[#5b22d6] disabled:opacity-50 disabled:bg-gray-300 transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        {partnerId && (
                            <div className="mt-2 flex justify-end px-1">
                                <button
                                    onClick={handleNext}
                                    className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wider flex items-center gap-1"
                                >
                                    Next Stranger <SkipForward className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
