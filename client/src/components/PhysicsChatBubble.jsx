import React from 'react';
import PhysicsBody from './PhysicsBody';

/**
 * PhysicsChatBubble - A glassmorphism chat message that participates in physics simulation
 * 
 * Messages fall from the top of the screen and pile up at the bottom, with throwable interactions
 */
const PhysicsChatBubble = ({
    message,
    isUser = false,
    timestamp,
    initialX,
    initialY,
}) => {
    // Color scheme based on sender
    const colorClass = isUser ? 'glass-blue' : 'glass-green';
    const textColor = isUser ? 'text-blue-900' : 'text-green-900';
    const borderColor = isUser ? 'border-google-blue' : 'border-google-green';

    return (
        <PhysicsBody
            initialX={initialX}
            initialY={initialY ?? -100} // Start above screen
            mass={0.5} // Lightweight - easy to throw
            restitution={0.4} // Moderate bounce
            friction={0.6}
            frictionAir={0.02}
            enableDrag={true}
            className="animate-fall-in"
        >
            <div
                className={`
                    ${colorClass} 
                    ${textColor}
                    physics-object-text
                    rounded-2xl 
                    px-4 py-3 
                    max-w-xs
                    shadow-md-2
                    border-2
                    ${borderColor}
                    backdrop-blur-glass
                    select-text
                `}
                style={{
                    minWidth: '60px',
                    wordBreak: 'break-word',
                }}
            >
                <p className="text-sm font-body leading-relaxed">
                    {message}
                </p>
                {timestamp && (
                    <span className="text-xs opacity-60 mt-1 block font-mono">
                        {new Date(timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                )}
            </div>
        </PhysicsBody>
    );
};

export default PhysicsChatBubble;
