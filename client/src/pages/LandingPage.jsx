import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, MessageSquare, Hash, ChevronDown, ChevronUp, ShieldAlert, HelpCircle } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
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
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center p-4 text-center">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-10"></div>

            {/* Geometric Texture Overlay */}
            <div className="absolute inset-0 -z-10 opacity-30">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1.5" fill="#6366f1" opacity="0.3" />
                        </pattern>
                        <pattern id="grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#a855f7" strokeWidth="0.5" opacity="0.2" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots)" />
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Floating Shapes */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="max-w-3xl space-y-12 py-12 relative z-10">
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                        LayzeeChat
                    </h1>
                    <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                        Connect with strangers instantly. No login required. Just pure, random conversations.
                    </p>
                </div>

                {/* Tag Selection */}
                <div className="mb-8 max-w-xl mx-auto backdrop-blur-sm bg-white/50 rounded-2xl p-6 shadow-lg">
                    <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
                        Select Interests (Optional)
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {availableTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border transform hover:-translate-y-1 cursor-pointer ${selectedTags.includes(tag)

                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105 hover:shadow-xl hover:bg-indigo-700'
                                    : 'bg-white/80 text-gray-700 border-gray-300 hover:border-indigo-400 hover:shadow-lg hover:bg-indigo-50'
                                    }`}

                            >
                                <div className="flex items-center gap-1">
                                    <Hash className="w-3 h-3" />
                                    {tag}
                                </div>
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Select up to 10 tags to find people with similar interests.</p>

                    {/* Selected Tags Display */}
                    {selectedTags.length > 0 && (
                        <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-200">
                            <p className="text-xs font-semibold text-indigo-700 mb-2">Selected Tags ({selectedTags.length}/10):</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedTags.map(tag => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full"
                                    >
                                        #{tag}
                                        <button
                                            onClick={() => toggleTag(tag)}
                                            className="ml-1 hover:bg-indigo-700 rounded-full p-0.5 transition-colors"
                                            title="Remove tag"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Manual Tag Input */}
                    <form onSubmit={handleAddCustomTag} className="mt-4 flex gap-2 justify-center">
                        <input
                            type="text"
                            value={customTagInput}
                            onChange={(e) => setCustomTagInput(e.target.value)}
                            placeholder="Add custom tag..."
                            className="px-4 py-2 rounded-full text-sm border border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            disabled={!customTagInput.trim() || selectedTags.length >= 10}
                            className="px-4 py-2 rounded-full text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"


                        >
                            Add
                        </button>
                    </form>
                </div>

                <button
                    onClick={handleStartChat}
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:shadow-2xl hover:scale-105 active:scale-95 overflow-hidden cursor-pointer"

                >
                    <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out bg-white opacity-0 group-hover:opacity-10"></span>

                    <span className="relative flex items-center gap-2">
                        Start Lazy Chatting <Video className="w-5 h-5" />
                    </span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600">
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/90 cursor-pointer group">
                        <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors duration-300">

                            <Video className="w-6 h-6 text-indigo-600" />
                        </div>
                        <span className="text-sm font-medium">Video Chat</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/90 cursor-pointer group">
                        <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors duration-300">

                            <MessageSquare className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium">Text Chat</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/90 cursor-pointer group">
                        <div className="p-3 bg-pink-100 rounded-full group-hover:bg-pink-200 transition-colors duration-300">

                            <span className="text-xl">👻</span>
                        </div>
                        <span className="text-sm font-medium">Anonymous</span>
                    </div>
                </div>

                {/* Rules Section */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-left border-l-4 border-red-500">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldAlert className="w-6 h-6 text-red-500" />
                        <h2 className="text-xl font-bold text-gray-800">Community Rules</h2>
                    </div>
                    <ul className="space-y-2">
                        {rules.map((rule, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                                {rule}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* FAQ Section */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-left">
                    <div className="flex items-center gap-2 mb-6">
                        <HelpCircle className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-xl font-bold text-gray-800">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                    className="flex justify-between items-center w-full text-left focus:outline-none group"
                                >
                                    <span className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                                        {faq.question}
                                    </span>
                                    {openFaqIndex === index ?
                                        <ChevronUp className="w-4 h-4 text-indigo-600" /> :
                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                    }
                                </button>
                                {openFaqIndex === index && (
                                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <footer className="py-8 text-sm text-gray-500">
                &copy; {new Date().getFullYear()} LayzeeChat. Safe & Secure.
            </footer>

        </div>
    );
};

export default LandingPage;
