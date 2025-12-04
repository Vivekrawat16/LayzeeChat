import React, { useState } from 'react';
import { Settings, Camera, Mic, FlipHorizontal, X } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const DeviceSettings = () => {
    const {
        videoDevices,
        audioDevices,
        selectedVideoDeviceId,
        selectedAudioDeviceId,
        switchVideoDevice,
        switchAudioDevice,
        isMirrored,
        toggleMirror,
        isDesktop
    } = useSocket();

    if (!isDesktop) return null;

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-end bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 z-50 p-4 pb-8 gap-3">
            {/* Flip Camera Button */}
            <button
                onClick={toggleMirror}
                className="bg-white text-gray-900 px-4 py-1.5 rounded-full font-semibold text-sm shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
                <FlipHorizontal className="w-4 h-4" />
                Flip Camera
            </button>

            {/* Camera Selection */}
            <div className="w-full max-w-[200px]">
                <select
                    value={selectedVideoDeviceId || ''}
                    onChange={(e) => switchVideoDevice(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full p-1.5 text-xs bg-white/90 border-none rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-lg cursor-pointer"
                >
                    {videoDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Camera ${device.deviceId.slice(0, 5)}...`}
                        </option>
                    ))}
                </select>
            </div>

            {/* Microphone Selection */}
            <div className="w-full max-w-[200px]">
                <select
                    value={selectedAudioDeviceId || ''}
                    onChange={(e) => switchAudioDevice(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full p-1.5 text-xs bg-white/90 border-none rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-lg cursor-pointer"
                >
                    {audioDevices.map(device => (
                        <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Microphone ${device.deviceId.slice(0, 5)}...`}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default DeviceSettings;
