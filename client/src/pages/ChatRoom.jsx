import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VideoContainer from '../components/VideoContainer';
import ChatBox from '../components/ChatBox';
import Controls from '../components/Controls';
import { useSocket } from '../context/SocketContext';

const ChatRoom = () => {
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
        if (messageInput.trim()) {
            sendMessage(messageInput);
            setMessageInput('');
        }
    };

    const handleNext = () => {
        nextPartner(tags);
    };

    return (
        <div className="h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 py-2 bg-white border-b border-gray-200 shadow-sm z-10 gap-2 sm:gap-0">
                <div className="flex items-center gap-2">

                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">L</span>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight">LayzeeChat</span>

                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                    {matchedTag && (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-wider">
                            Matched via #{matchedTag}
                        </span>
                    )}
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    {onlineUsers} online
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0">
                {/* Left Sidebar: Videos - Full width on mobile, ~30% on desktop */}
                <div className="w-full md:w-[30%] bg-gray-100 p-2 sm:p-3 flex flex-col border-b md:border-b-0 md:border-r border-gray-200 h-[40vh] md:h-auto">

                    <VideoContainer
                        localStream={stream}
                        myVideoRef={myVideo}
                        userVideoRef={userVideo}
                        callAccepted={callAccepted}
                    />
                </div>

                {/* Right Content: Chat & Controls - Full width on mobile, ~70% on desktop */}
                <div className="flex-1 flex flex-col bg-white">

                    {/* Chat Area */}
                    <div className="flex-1 overflow-hidden relative">
                        <ChatBox
                            messages={messages}
                            onSendMessage={null}
                            hideInput={true}
                        />
                    </div>

                    {/* Searching Indicator */}
                    {isSearching && (
                        <div className="px-4 py-2 bg-indigo-50 border-t border-indigo-200">
                            <p className="text-indigo-700 text-sm font-medium text-center">
                                🔍 Searching for someone to chat with...
                            </p>
                        </div>
                    )}

                    {/* Bottom Controls Bar */}
                    <div className="flex-none">
                        <Controls
                            onNext={handleNext}
                            isSearching={isSearching}
                            onReport={reportUser}
                            onSendMessage={handleSendMessage}
                            messageInput={messageInput}
                            setMessageInput={setMessageInput}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
