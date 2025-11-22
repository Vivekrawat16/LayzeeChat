import React, { useEffect, useRef } from 'react';

const ChatBox = ({ messages, onSendMessage, hideInput = false }) => {
    const messagesEndRef = useRef(null);
    const [input, setInput] = React.useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim() && onSendMessage) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* System Welcome Message */}
                <div className="text-gray-500 text-sm text-center my-4">
                    <p className="font-bold text-gray-700 dark:text-gray-300">Welcome to LayzeeChat!</p>
                    <p>Say hello to a stranger. Be kind and respectful.</p>
                </div>

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm md:text-base ${msg.isMe
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {!hideInput && (
                <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary dark:text-white"
                    />
                    <button
                        type="submit"
                        className="p-2 bg-primary text-white rounded-full hover:opacity-90 transition-opacity"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </button>
                </form>
            )}
        </div>
    );
};

export default ChatBox;
