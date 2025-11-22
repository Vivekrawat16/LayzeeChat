import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, MessageSquare, Hash, Sun, Moon, ChevronDown, ChevronUp, ShieldAlert, HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';


const LandingPage = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [selectedTags, setSelectedTags] = useState([]);
    const [customTagInput, setCustomTagInput] = useState('');
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const availableTags = ["Gaming", "Coding", "Music", "Movies", "Travel", "Fitness", "Tech", "Art"];

    const faqs = [
        { question: "Is it really anonymous?", answer: "Yes! We don't ask for your name, email, or login. You are just a random stranger to everyone else." },
        { question: "Can I report bad behavior?", answer: "Absolutely. Use the 'Report' button in the chat to flag inappropriate users. We take safety seriously." },
        { question: "Does it work on mobile?", answer: "Yes, LayzeeChat is fully responsive and works great on phones and tablets." },
        { question: "Is it free?", answer: "100% free. No hidden costs, no premium subscriptions." }
    ];

    const rules = [
        "No nudity or sexually explicit content.",
        "No hate speech, bullying, or harassment.",
        "No spamming or soliciting.",
        "Be respectful and have fun!"
    ];



    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            if (selectedTags.length < 10) {
                setSelectedTags([...selectedTags, tag]);
            }
        }
    };

    const handleAddCustomTag = (e) => {
        e.preventDefault();
        const tag = customTagInput.trim();
        if (tag && !selectedTags.includes(tag) && selectedTags.length < 10) {
            setSelectedTags([...selectedTags, tag]);
            setCustomTagInput('');
        }
    };


    const handleStartChat = () => {
        navigate('/chat', { state: { tags: selectedTags } });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-4 text-center transition-colors duration-200 overflow-y-auto">

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:scale-110 transition-transform"
            >
                {theme === 'dark' ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-indigo-600" />}
            </button>

            <div className="max-w-3xl space-y-12 py-12">
                <div className="space-y-4">

                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-fade-in-down">
                        LayzeeChat
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Connect with strangers instantly. No login required. Just pure, random conversations.
                    </p>
                </div>

                {/* Tag Selection */}
                <div className="mb-8 max-w-xl mx-auto">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                        Select Interests (Optional)
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {availableTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedTags.includes(tag)
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400'
                                    }`}
                            >
                                <div className="flex items-center gap-1">
                                    <Hash className="w-3 h-3" />
                                    {tag}
                                </div>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Select up to 10 tags to find people with similar interests.</p>

                    {/* Manual Tag Input */}
                    <form onSubmit={handleAddCustomTag} className="mt-4 flex gap-2 justify-center">
                        <input
                            type="text"
                            value={customTagInput}
                            onChange={(e) => setCustomTagInput(e.target.value)}
                            placeholder="Add custom tag..."
                            className="px-4 py-2 rounded-full text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={!customTagInput.trim() || selectedTags.length >= 10}
                            className="px-4 py-2 rounded-full text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Add
                        </button>
                    </form>
                </div>


                <button
                    onClick={handleStartChat}
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-700 active:scale-95"
                >
                    <span className="absolute inset-0 w-full h-full mt-1 ml-1 transition-all duration-200 ease-out bg-black rounded-full group-hover:mt-0 group-hover:ml-0 opacity-20"></span>
                    <span className="relative flex items-center gap-2">
                        Start Lazy Chatting <Video className="w-5 h-5" />
                    </span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
                        <div className="p-3 bg-indigo-50 dark:bg-gray-700 rounded-full">
                            <Video className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium">Video Chat</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
                        <div className="p-3 bg-purple-50 dark:bg-gray-700 rounded-full">
                            <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-sm font-medium">Text Chat</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
                        <div className="p-3 bg-pink-50 dark:bg-gray-700 rounded-full">
                            <span className="text-xl">👻</span>
                        </div>
                        <span className="text-sm font-medium">Anonymous</span>
                    </div>
                </div>

                {/* Rules Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm text-left border-l-4 border-red-500">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldAlert className="w-6 h-6 text-red-500" />
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Community Rules</h2>
                    </div>
                    <ul className="space-y-2">
                        {rules.map((rule, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-sm">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0"></span>
                                {rule}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* FAQ Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm text-left">
                    <div className="flex items-center gap-2 mb-6">
                        <HelpCircle className="w-6 h-6 text-indigo-500" />
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                    className="flex justify-between items-center w-full text-left focus:outline-none group"
                                >
                                    <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {faq.question}
                                    </span>
                                    {openFaqIndex === index ?
                                        <ChevronUp className="w-4 h-4 text-indigo-500" /> :
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    }
                                </button>
                                {openFaqIndex === index && (
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed animate-fade-in">
                                        {faq.answer}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <footer className="py-8 text-sm text-gray-400">
                &copy; {new Date().getFullYear()} LayzeeChat. Safe & Secure.
            </footer>

        </div>
    );
};

export default LandingPage;
