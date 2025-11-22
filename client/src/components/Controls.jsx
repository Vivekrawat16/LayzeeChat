import React from 'react';
import { Mic, MicOff, Video, VideoOff, SkipForward, Flag } from 'lucide-react';

const Controls = ({
    onNext,
    onToggleAudio,
    onToggleVideo,
    isAudioEnabled,
    isVideoEnabled,
    isSearching,
    onReport
}) => {
    return (
        <div className="flex items-center justify-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <button
                onClick={onToggleAudio}
                className={`p-4 rounded-full transition-all ${isAudioEnabled
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                title={isAudioEnabled ? "Mute Mic" : "Unmute Mic"}
            >
                {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            <button
                onClick={onToggleVideo}
                className={`p-4 rounded-full transition-all ${isVideoEnabled
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                title={isVideoEnabled ? "Stop Video" : "Start Video"}
            >
                {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>

            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2"></div>

            <button
                onClick={onNext}
                disabled={isSearching}
                className={`flex-1 px-8 py-4 flex items-center justify-center gap-2 text-lg font-bold text-white rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${isSearching
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary to-secondary hover:opacity-90'
                    }`}
            >
                <SkipForward className={`w-6 h-6 ${isSearching ? 'animate-spin' : ''}`} />
                {isSearching ? 'Searching...' : 'Next Stranger'}
            </button>

            <button
                onClick={onReport}
                className="p-4 text-gray-400 hover:text-red-500 transition-colors"
                title="Report User"
            >
                <Flag className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Controls;
