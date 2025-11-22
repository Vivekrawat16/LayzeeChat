import React, { useState, useEffect } from 'react';
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
        reportUser
    } = useSocket();

    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);

    useEffect(() => {
        // Auto-start searching when entering chat
        findPartner();
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

    const toggleVideo = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(videoTrack.enabled);
            }
        }
    };

    return (
        <div className="h-screen bg-gray-50 dark:bg-dark p-4 md:p-6 flex flex-col gap-4">
            <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
                <div className="flex-1 md:flex-[2] flex flex-col min-h-0">
                    <VideoContainer
                        localStream={stream}
                        myVideoRef={myVideo}
                        userVideoRef={userVideo}
                        callAccepted={callAccepted}
                        isVideoEnabled={isVideoEnabled}
                    />
                </div>

                <div className="flex-1 md:flex-[1] min-h-0">
                    <ChatBox
                        messages={messages}
                        onSendMessage={sendMessage}
                    />
                </div>
            </div>

            <div className="flex-none">
                <Controls
                    onNext={nextPartner}
                    onToggleAudio={toggleAudio}
                    onToggleVideo={toggleVideo}
                    isAudioEnabled={isAudioEnabled}
                    isVideoEnabled={isVideoEnabled}
                    isSearching={isSearching}
                    onReport={reportUser}
                />
            </div>
        </div>
    );
};

export default ChatRoom;
