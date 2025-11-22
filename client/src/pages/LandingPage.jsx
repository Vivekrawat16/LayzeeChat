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
            </div >

    <footer className="absolute bottom-4 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} LayzeeChat. Safe & Secure.
    </footer>
        </div >
    );
};

export default LandingPage;
