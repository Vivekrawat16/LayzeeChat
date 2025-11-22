import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VideoContainer from '../components/VideoContainer';
import ChatBox from '../components/ChatBox';
import Controls from '../components/Controls';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';


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

    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const tags = location.state?.tags || [];

    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        // Start media and search when entering chat, passing selected tags
        startChat(tags);
    }, []);

    const toggleAudio = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioEnabled(audioTrack.enabled);
            }
        }
    };

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
        <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">L</span>
                    </div>
                    <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">LayzeeChat</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    {matchedTag && (
                        <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider">
                            Matched via #{matchedTag}
                        </span>
                    )}
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    {onlineUsers} online
                </div>

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
                </button>
            </header>


            {/* Main Content */}
            <div className="flex-1 flex min-h-0">
                {/* Left Sidebar: Videos - INCREASED SIZE */}
                <div className="flex-[3] bg-gray-100 dark:bg-gray-950 p-3 flex flex-col border-r border-gray-200 dark:border-gray-800">
                    <VideoContainer
                        localStream={stream}
                        myVideoRef={myVideo}
                        userVideoRef={userVideo}
                        callAccepted={callAccepted}
                    />
                </div>

                {/* Right Content: Chat & Controls - REDUCED SIZE */}
                <div className="flex-1 min-w-[300px] max-w-[400px] flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">

                    {/* Chat Area */}
                    <div className="flex-1 overflow-hidden relative">
                        <ChatBox
                            messages={messages}
                            onSendMessage={null}
                            hideInput={true}
                        />
                    </div>

                    {/* Bottom Controls Bar */}
                    <div className="flex-none">
                        <Controls
                            onNext={handleNext}
                            onToggleAudio={toggleAudio}
                            isAudioEnabled={isAudioEnabled}
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
