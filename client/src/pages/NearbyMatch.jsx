import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Users, ArrowLeft, Loader2, X, Send, SkipForward, Flag } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import VideoContainer from '../components/VideoContainer';

const NearbyMatch = () => {
    const navigate = useNavigate();
    const {
        socket,
        enableMedia,
        partnerId,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        messages,
        sendMessage,
        nextPartner,
        isSearching,
        stopMedia
    } = useSocket();

    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [radius, setRadius] = useState(5000); // Default 5km
    const [status, setStatus] = useState('idle'); // idle, locating, searching, found
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

    // Cleanup media on unmount
    useEffect(() => {
        return () => {
            stopMedia();
        };
    }, []);

    useEffect(() => {
        if (partnerId) {
            setStatus('found');
        }

        const handleNoMatch = () => {
            console.log('⚠️ Received no-nearby-found event from server');
            setStatus('no-match');
        };

        const handleError = ({ message }) => {
            console.error('Nearby error:', message);
            setError(message || 'Connection error');
            setStatus('idle');
        };

        socket.on('no-nearby-found', handleNoMatch);
        socket.on('nearby-error', handleError);

        return () => {
            socket.off('no-nearby-found', handleNoMatch);
            socket.off('nearby-error', handleError);
        };
    }, [partnerId, socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getLocation = () => {
        setStatus('locating');
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setStatus('idle');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
                setStatus('idle');

                // Join the nearby pool immediately upon getting location
                socket.emit('join-nearby', { location: { lat: latitude, lng: longitude } });
            },
            (err) => {
                setError('Unable to retrieve your location. Please allow access.');
                setStatus('idle');
                console.error(err);
            }
        );
    };

    const handleFindMatch = async () => {
        if (!location) {
            getLocation();
            return;
        }

        setStatus('searching');

        // Ensure we have media permissions first
        await enableMedia();

        // Emit find event with location to ensure server has it
        socket.emit('find-nearby', { radius, location });
    };

    const handleBack = () => {
        if (partnerId) {
            nextPartner(); // Disconnect if in call
        }
        navigate('/');
    };

    const handleSendMessage = () => {
        if (messageInput.trim() && partnerId) {
            sendMessage(messageInput);
            setMessageInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // --- Render Video Chat Interface if Matched or Searching ---
    if (status === 'found' || partnerId) {
        return (
            <div className="h-screen bg-gray-100 flex flex-col font-sans">
                {/* Header */}
                <header className="flex-none flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm z-10">
                    <div className="flex items-center gap-2">
                        <div className="font-display text-xl md:text-2xl font-bold tracking-tight">
                            <span className="text-[#4285F4]">L</span>
                            <span className="text-[#EA4335]">a</span>
                            <span className="text-[#FBBC05]">y</span>
                            <span className="text-[#4285F4]">z</span>
                            <span className="text-[#34A853]">e</span>
                            <span className="text-[#EA4335]">e</span>
                            <span className="text-[#4285F4]">C</span>
                            <span className="text-[#FBBC05]">h</span>
                            <span className="text-[#34A853]">a</span>
                            <span className="text-[#EA4335]">t</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded border border-blue-100 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {radius / 1000}km Radius
                        </span>
                        <button
                            onClick={handleBack}
                            className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                            title="Exit Nearby Match"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-2 md:p-4 gap-2 md:gap-4 max-w-[1600px] mx-auto w-full">

                    {/* Left Column: Videos (30% on Desktop, PiP on Mobile) */}
                    <div className="flex-none md:w-[30%] flex flex-col h-[45vh] md:h-auto min-h-0 relative">
                        {/* Video Wrapper: Relative for Mobile PiP, Flex-Col for Desktop Stack */}
                        <div className="flex-1 relative md:flex md:flex-col md:gap-4">

                            {/* Partner Video */}
                            <div className="absolute inset-0 md:relative md:inset-auto md:flex-1 bg-black rounded-xl overflow-hidden shadow-sm border border-gray-300 z-0">
                                <video
                                    playsInline
                                    autoPlay
                                    ref={userVideo}
                                    className={`w-full h-full object-cover ${!callAccepted ? 'hidden' : ''}`}
                                />
                                {!callAccepted && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#404040] text-white p-4 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            {/* Always show searching state here if not connected */}
                                            <Loader2 className="w-10 h-10 animate-spin text-white/50" />
                                            <p className="font-medium text-lg text-white/80">Searching for partner...</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* My Video */}
                            <div className="absolute top-3 right-3 w-24 h-32 md:static md:w-auto md:h-auto md:flex-1 bg-black rounded-lg md:rounded-xl overflow-hidden border-2 border-white/20 md:border md:border-gray-300 shadow-lg md:shadow-sm z-10">
                                <video
                                    playsInline
                                    muted
                                    autoPlay
                                    ref={myVideo}
                                    className={`w-full h-full object-cover transform scale-x-[-1] ${!stream ? 'hidden' : ''}`}
                                />
                                {!stream && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-xs text-gray-500">
                                        No Cam
                                    </div>
                                )}
                                <div className="absolute bottom-1 left-1 md:bottom-2 md:left-2 px-1.5 py-0.5 md:px-2 md:py-1 bg-black/50 rounded text-[10px] md:text-xs text-white font-medium backdrop-blur-sm">
                                    You
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Chat Interface (70% on Desktop) */}
                    <div className="flex-1 md:w-[70%] flex flex-col bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden h-full min-h-0">
                        {/* Chat Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white relative">
                            <div className="py-4 space-y-2">
                                <h2 className="font-bold text-gray-900 text-xl">Nearby Match</h2>
                                <div className="text-sm text-gray-800 space-y-1">
                                    <p>Connected with someone within {radius / 1000}km.</p>
                                    <p>Be respectful and have fun!</p>
                                </div>
                            </div>

                            {messages.map((msg, index) => (
                                <div
                                    key={msg.id || index}
                                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${msg.sender === 'me'
                                            ? 'bg-[#6929F6] text-white rounded-br-none'
                                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                            }`}
                                    >
                                        <p className="break-words">{msg.text}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Searching Status Overlay in Chat */}
                            {!callAccepted && (
                                <div className="flex justify-center my-4">
                                    <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 animate-pulse">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Searching for partner...
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input & Controls Bar */}
                        <div className="p-3 bg-white border-t border-gray-100">
                            <div className="flex gap-3 h-14">
                                {/* Stop/Next Button */}
                                <button
                                    onClick={handleFindMatch} // Re-trigger search
                                    className={`
                                        h-full px-8 font-bold text-white text-lg rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center
                                        bg-gray-800 hover:bg-gray-900 min-w-[100px]
                                    `}
                                >
                                    Next
                                </button>

                                {/* Input Area */}
                                <div className="flex-1 relative h-full">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder={partnerId ? "Type a message..." : "Waiting for partner..."}
                                        disabled={!partnerId}
                                        className="w-full h-full pl-4 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:border-[#6929F6] focus:ring-1 focus:ring-[#6929F6] bg-white disabled:bg-gray-50 text-lg"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!messageInput.trim() || !partnerId}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#6929F6] text-white rounded-lg hover:bg-[#5b22d6] disabled:opacity-50 disabled:bg-gray-300 transition-colors"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- Render Search Interface ---
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-gradient-to-r from-google-blue to-google-green p-6 text-white relative">
                    <button
                        onClick={handleBack}
                        className="absolute top-6 left-4 hover:bg-white/20 p-2 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col items-center gap-2 mt-2">
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                            <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-display font-bold">Nearby Match</h1>
                        <p className="text-white/80 text-sm font-body">Find people around you</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">

                    {/* Location Status */}
                    <div className="text-center space-y-2">
                        {!location ? (
                            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg text-sm border border-yellow-100 flex items-center justify-center gap-2">
                                <Navigation className="w-4 h-4" />
                                <span>Location access required</span>
                            </div>
                        ) : (
                            <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm border border-green-100 flex items-center justify-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>Location acquired</span>
                            </div>
                        )}
                        {error && (
                            <p className="text-red-500 text-xs mt-2">{error}</p>
                        )}
                    </div>

                    {/* Radius Selector */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex justify-between">
                            <span>Search Radius</span>
                            <span className="text-google-blue">{radius / 1000} km</span>
                        </label>
                        <input
                            type="range"
                            min="1000"
                            max="100000"
                            step="1000"
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-google-blue"
                        />
                        <div className="flex justify-between text-xs text-gray-400 font-mono">
                            <span>1km</span>
                            <span>100km</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                        {!location ? (
                            <button
                                onClick={getLocation}
                                disabled={status === 'locating'}
                                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {status === 'locating' ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Locating...
                                    </>
                                ) : (
                                    <>
                                        <Navigation className="w-5 h-5" />
                                        Enable Location
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleFindMatch}
                                disabled={status === 'searching'}
                                className={`
                                    w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                                    ${status === 'searching'
                                        ? 'bg-google-blue/10 text-google-blue cursor-wait'
                                        : 'bg-gradient-to-r from-google-blue to-google-green text-white hover:shadow-xl hover:-translate-y-1'
                                    }
                                `}
                            >
                                {status === 'searching' ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Searching for partner...
                                    </>
                                ) : status === 'no-match' ? (
                                    <>
                                        <Users className="w-6 h-6" />
                                        No one found. Try again?
                                    </>
                                ) : (
                                    <>
                                        <Users className="w-6 h-6" />
                                        Find Nearby Match
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Info */}
                    <p className="text-xs text-center text-gray-400 leading-relaxed">
                        Your precise location is never shared with other users.
                        We only use it to calculate distance for matching.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default NearbyMatch;
