import React from 'react';
import PhysicsBody from './PhysicsBody';

/**
 * FloatingVideo - A video feed that floats with spring constraint to center
 * 
 * Heavy mass prevents easy displacement, spring keeps it centered but allows physics interactions
 */
const FloatingVideo = ({
    videoRef,
    isLocalUser = false,
    anchorX,
    anchorY,
    label = '',
}) => {
    const centerX = anchorX ?? window.innerWidth * (isLocalUser ? 0.3 : 0.3);
    const centerY = anchorY ?? window.innerHeight * (isLocalUser ? 0.3 : 0.6);

    return (
        <PhysicsBody
            initialX={centerX}
            initialY={centerY}
            mass={10} // Very heavy - hard to move
            restitution={0.2} // Low bounce
            friction={0.7}
            frictionAir={0.05}
            enableDrag={true}
            springTo={{
                x: centerX,
                y: centerY,
                stiffness: 0.005, // Gentle spring
                damping: 0.15,
            }}
            className="z-10"
        >
            <div className="glass elevation-4 rounded-2xl overflow-hidden border-4 border-white/50 shadow-md-4">
                <div className="relative">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted={isLocalUser}
                        className="w-64 h-48 object-cover bg-gray-900"
                        style={{
                            transform: isLocalUser ? 'scaleX(-1)' : 'none', // Mirror local video
                        }}
                    />
                    {label && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-3 py-2">
                            <p className="text-xs font-body font-medium text-white">
                                {label}
                            </p>
                        </div>
                    )}
                    {!videoRef?.current?.srcObject && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-700 flex items-center justify-center">
                                    <span className="text-2xl">👤</span>
                                </div>
                                <p className="text-sm text-gray-400 font-body">
                                    {isLocalUser ? 'Camera Off' : 'Waiting...'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PhysicsBody>
    );
};

export default FloatingVideo;
