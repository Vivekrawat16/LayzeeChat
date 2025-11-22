import React, { useEffect } from 'react';
import { User } from 'lucide-react';

const VideoContainer = ({ localStream, myVideoRef, userVideoRef, callAccepted }) => {

    useEffect(() => {
        if (myVideoRef.current && localStream) {
            myVideoRef.current.srcObject = localStream;
        }
    }, [localStream, myVideoRef]);

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Remote Video (Top) */}
            <div className="relative flex-1 bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-md">
                <video
                    playsInline
                    autoPlay
                    ref={userVideoRef}
                    className={`w-full h-full object-cover ${!callAccepted ? 'hidden' : ''}`}
                />
                {!callAccepted && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-2">
                            <User className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="text-sm font-medium">Partner Camera</p>
                    </div>
                )}
                {/* Report Flag could go here overlaying the video */}
            </div>

            {/* Local Video (Bottom) */}
            <div className="relative flex-1 bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-md">
                <video
                    playsInline
                    muted
                    autoPlay
                    ref={myVideoRef}
                    className={`w-full h-full object-cover transform scale-x-[-1] ${!localStream ? 'hidden' : ''}`}
                />
                {!localStream && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-2">
                            <User className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="text-sm font-medium">Your Camera</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoContainer;
