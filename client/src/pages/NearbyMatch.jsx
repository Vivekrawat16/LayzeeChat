import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Users, ArrowLeft, Loader2, X } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import VideoContainer from '../components/VideoContainer';
import ChatBox from '../components/ChatBox';

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
        nextPartner
    } = useSocket();

    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [radius, setRadius] = useState(5000); // Default 5km
    const [status, setStatus] = useState('idle'); // idle, locating, searching, found

    useEffect(() => {
        if (partnerId) {
            setStatus('found');
        }

        const handleNoMatch = () => {
            setStatus('no-match');
        };

        socket.on('no-nearby-found', handleNoMatch);

        return () => {
            socket.off('no-nearby-found', handleNoMatch);
        };
    }, [partnerId, socket]);

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
        // If in a call, end it?
        if (partnerId) {
            nextPartner(); // Or just disconnect
        }
        navigate('/');
    };

    // --- Render Video Chat Interface if Matched ---
    if (status === 'found' || partnerId) {
        return (
            <div className="h-screen bg-gray-900 flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 p-4 flex items-center justify-between shadow-md z-10">
                    <div className="flex items-center gap-2 text-white">
                        <MapPin className="w-5 h-5 text-google-green" />
                        <span className="font-bold">Nearby Match</span>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                            Within {radius / 1000}km
                        </span>
                    </div>
                    <button
                        onClick={handleBack}
                        className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    {/* Video Area */}
                    <div className="flex-1 p-4 relative">
                        <VideoContainer
                            localStream={stream}
                            myVideoRef={myVideo}
                            userVideoRef={userVideo}
                            callAccepted={callAccepted}
                        />
                    </div>

                    {/* Chat Area (Optional sidebar or overlay) */}
                    <div className="w-full md:w-80 bg-white border-l border-gray-200 flex flex-col">
                        <ChatBox
                            messages={messages}
                            onSendMessage={sendMessage}
                        />
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
                            max="50000"
                            step="1000"
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-google-blue"
                        />
                        <div className="flex justify-between text-xs text-gray-400 font-mono">
                            <span>1km</span>
                            <span>50km</span>
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
                                        Scanning Area...
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
