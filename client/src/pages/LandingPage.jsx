import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, MessageSquare, Hash, ChevronDown, ChevronUp, ShieldAlert, HelpCircle, Sparkles } from 'lucide-react';

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
        <div className="min-h-screen bg-md-background flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12 text-center overflow-x-hidden">

            {/* Subtle Grid Background */}
            <div className="fixed inset-0 -z-10 opacity-20">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4285F4" strokeWidth="0.5" opacity="0.4" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="max-w-4xl w-full space-y-16 relative z-10">

                {/* Hero Section */}
                <div className="space-y-6 pt-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-google-blue/10 rounded-full border border-google-blue/20 mb-4">
                        <Sparkles className="w-4 h-4 text-google-blue" />
                        <span className="text-sm font-body font-medium text-google-blue">Physics-Powered Conversations</span>
                    </div>

                    <h1 className="font-display text-6xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-google-blue via-google-green to-google-yellow leading-tight tracking-tight">
                        LayzeeChat
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-md-on-surface max-w-2xl mx-auto font-body leading-relaxed opacity-80">
                        Connect with strangers instantly. No login required. <br className="hidden sm:block" />
                        Just pure, random conversations.
                    </p>
                </div>

                {/* Tag Selection */}
                <div className="max-w-2xl mx-auto space-y-4">
                    <div className="flex items-center justify-center gap-2">
                        <Hash className="w-5 h-5 text-google-blue" />
                        <h2 className="text-sm font-body font-semibold text-gray-600 uppercase tracking-wider">
                            Select Interests (Optional)
                        </h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {availableTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`
                                    px-5 py-2.5 
                                    rounded-full 
                                    text-sm 
                                    font-body 
                                    font-medium 
                                    transition-all 
                                    duration-300 
                                    border-2
                                    transform 
                                    hover:-translate-y-1 
                                    hover:shadow-md-3
                                    active:scale-95
                                    ${selectedTags.includes(tag)
                                        ? 'bg-google-blue text-white border-google-blue shadow-md-2 scale-105'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-google-blue hover:text-google-blue'
                                    }
                                `}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>

                    {/* Selected Tags Display */}
                    {selectedTags.length > 0 && (
                        <div className="p-5 bg-white rounded-2xl shadow-md-2 border-2 border-google-blue/20">
                            <p className="text-xs font-body font-semibold text-google-blue mb-3 uppercase tracking-wide">
                                Selected Tags ({selectedTags.length}/10)
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {selectedTags.map(tag => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-google-blue text-white text-sm font-body font-medium rounded-full shadow-md-1"
                                    >
                                        #{tag}
                                        <button
                                            onClick={() => toggleTag(tag)}
                                            className="hover:bg-white/20 rounded-full p-1 transition-colors"
                                            title="Remove tag"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Manual Tag Input */}
                    <form onSubmit={handleAddCustomTag} className="flex gap-3 justify-center">
                        <input
                            type="text"
                            value={customTagInput}
                            onChange={(e) => setCustomTagInput(e.target.value)}
                            placeholder="Add custom tag..."
                            className="px-5 py-2.5 rounded-full text-sm font-body border-2 border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!customTagInput.trim() || selectedTags.length >= 10}
                            className="px-5 py-2.5 rounded-full text-sm font-body font-bold text-white bg-google-blue hover:bg-[#5a95f5] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-md-2 hover:shadow-md-3 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                        >
                            Add
                        </button>
                    </form>
                </div>

                {/* Start Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleStartChat}
                        className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-display font-bold text-white bg-gradient-to-r from-google-blue to-google-green rounded-full shadow-md-4 hover:shadow-md-4 hover:scale-105 active:scale-100 transition-all duration-300 overflow-hidden"
                    >
                        <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out bg-white opacity-0 group-hover:opacity-10"></span>
                        <span className="relative flex items-center gap-3">
                            Start Lazy Chatting
                            <Video className="w-6 h-6" />
                        </span>
                    </button>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white shadow-md-2 hover:shadow-md-3 transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-google-blue/20">
                        <div className="p-4 bg-google-blue/10 rounded-full group-hover:bg-google-blue/20 transition-colors duration-300">
                            <Video className="w-8 h-8 text-google-blue" />
                        </div>
                        <span className="text-base font-body font-semibold text-gray-800">Video Chat</span>
                        <p className="text-sm text-gray-600 font-body">Face-to-face conversations</p>
                    </div>

                    <div className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white shadow-md-2 hover:shadow-md-3 transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-google-green/20">
                        <div className="p-4 bg-google-green/10 rounded-full group-hover:bg-google-green/20 transition-colors duration-300">
                            <MessageSquare className="w-8 h-8 text-google-green" />
                        </div>
                        <span className="text-base font-body font-semibold text-gray-800">Text Chat</span>
                        <p className="text-sm text-gray-600 font-body">Type away comfortably</p>
                    </div>

                    <div className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white shadow-md-2 hover:shadow-md-3 transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-google-yellow/20">
                        <div className="p-4 bg-google-yellow/10 rounded-full group-hover:bg-google-yellow/20 transition-colors duration-300">
                            <span className="text-3xl">👻</span>
                        </div>
                        <span className="text-base font-body font-semibold text-gray-800">Anonymous</span>
                        <p className="text-sm text-gray-600 font-body">100% privacy guaranteed</p>
                    </div>
                </div>

                {/* Rules Section */}
                <div className="bg-white rounded-2xl p-8 shadow-md-2 text-left border-l-4 border-google-red">
                    <div className="flex items-center gap-3 mb-6">
                        <ShieldAlert className="w-7 h-7 text-google-red" />
                        <h2 className="text-2xl font-display font-bold text-gray-800">Community Rules</h2>
                    </div>
                    <ul className="space-y-3">
                        {rules.map((rule, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-700 text-base font-body">
                                <span className="mt-2 w-2 h-2 bg-google-red rounded-full flex-shrink-0"></span>
                                {rule}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-2xl p-8 shadow-md-2 text-left">
                    <div className="flex items-center gap-3 mb-6">
                        <HelpCircle className="w-7 h-7 text-google-blue" />
                        <h2 className="text-2xl font-display font-bold text-gray-800">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                    className="flex justify-between items-center w-full text-left focus:outline-none group"
                                >
                                    <span className="font-body font-semibold text-gray-800 group-hover:text-google-blue transition-colors">
                                        {faq.question}
                                    </span>
                                    {openFaqIndex === index ?
                                        <ChevronUp className="w-5 h-5 text-google-blue" /> :
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    }
                                </button>
                                {openFaqIndex === index && (
                                    <p className="mt-3 text-sm text-gray-600 font-body leading-relaxed">
                                        {faq.answer}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Footer */}
            <footer className="py-10 text-sm text-gray-500 font-body">
                &copy; {new Date().getFullYear()} LayzeeChat. Safe &amp; Secure.
            </footer>

        </div>
    );
};

export default LandingPage;

