import React from 'react';
import { User } from 'lucide-react';

const VideoContainer = ({ localStream, isVideoEnabled, myVideoRef, userVideoRef, callAccepted }) => {
    return (
        <div className="relative flex-1 w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            {/* Remote Video (Main) */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <video
                    playsInline
                    autoPlay
                    ref={userVideoRef}
                    className={`w-full h-full object-cover ${!callAccepted ? 'hidden' : ''}`}
                />
                {!callAccepted && (
                    <div className="flex flex-col items-center text-gray-500 animate-pulse">
                        <User className="w-20 h-20 mb-4 opacity-50" />
                        <p className="text-lg font-medium">Searching for a stranger...</p>
                    </div>
                )}
            </div>

            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-32 h-48 md:w-48 md:h-72 bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 shadow-lg transition-all hover:scale-105 z-10">
                <video
                    playsInline
                    muted
                    autoPlay
                    ref={myVideoRef}
                    className={`w-full h-full object-cover transform scale-x-[-1] ${!localStream || !isVideoEnabled ? 'hidden' : ''}`}
                />
                {(!localStream || !isVideoEnabled) && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <User className="w-10 h-10 text-gray-600" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoContainer;
