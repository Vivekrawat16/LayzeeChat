import React from 'react';
import { Send, Flag } from 'lucide-react';


const Controls = ({
    onNext,
    isSearching,
    onReport,
    onSendMessage,
    messageInput,
    setMessageInput
}) => {


    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };

    return (
        <div className="flex items-center gap-2 p-2 bg-gray-50 border-t border-gray-200">


            {/* Start/Next Button */}
            <button
                onClick={onNext}
                disabled={isSearching}
                className={`px-6 py-3 font-bold text-white rounded-lg shadow-sm transition-all uppercase tracking-wide ${isSearching
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                    }`}
            >
                {isSearching ? 'Stop' : 'Start'}
                <span className="block text-[10px] font-normal normal-case opacity-80">Esc</span>
            </button>

            {/* Chat Input Area */}
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
            </div>

            {/* Send Button */}
            <button
                onClick={onSendMessage}
                className="p-3 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
                <Send className="w-6 h-6" />
            </button>

            {/* Report Button */}
            <button
                onClick={onReport}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Report User"
            >
                <Flag className="w-5 h-5" />
            </button>

        </div>

    );
};

export default Controls;
