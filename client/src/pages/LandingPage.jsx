import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, MessageSquare } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/chat');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark flex flex-col items-center justify-center p-4 text-center transition-colors duration-200">
            <div className="max-w-2xl space-y-8">
                <div className="space-y-2">
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-fade-in-down">
                        LayzeeChat
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Random video & text chat. No login. Just vibes.
                    </p>
                </div>

                <button
                    onClick={handleStart}
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-primary rounded-full hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    <span className="absolute inset-0 w-full h-full mt-1 ml-1 transition-all duration-200 ease-out bg-black rounded-full group-hover:mt-0 group-hover:ml-0 opacity-20"></span>
                    <span className="relative flex items-center gap-2">
                        Start Lazy Chatting <Video className="w-5 h-5" />
                    </span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                            <Video className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-sm font-medium">Video Chat</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                            <MessageSquare className="w-6 h-6 text-secondary" />
                        </div>
                        <span className="text-sm font-medium">Text Chat</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                            <span className="text-xl">👻</span>
                        </div>
                        <span className="text-sm font-medium">Anonymous</span>
                    </div>
                </div>
            </div>

            <footer className="absolute bottom-4 text-sm text-gray-400">
                &copy; {new Date().getFullYear()} LayzeeChat. Safe & Secure.
            </footer>
        </div>
    );
};

export default LandingPage;
