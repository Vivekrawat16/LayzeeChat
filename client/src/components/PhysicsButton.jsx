import React, { useState } from 'react';
import PhysicsBody from './PhysicsBody';

/**
 * PhysicsButton - An interactive button that breathes and responds to physics
 */
const PhysicsButton = ({
    children,
    onClick,
    variant = 'blue', // 'blue', 'red', 'green', 'yellow'
    initialX,
    initialY,
    mass = 2, // Heavier than chat bubbles
    disabled = false,
    className = '',
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const colorMap = {
        blue: {
            bg: 'bg-google-blue',
            hover: 'hover:bg-[#5a95f5]',
            glass: 'glass-blue',
            border: 'border-google-blue',
        },
        red: {
            bg: 'bg-google-red',
            hover: 'hover:bg-[#e55347]',
            glass: 'glass-red',
            border: 'border-google-red',
        },
        green: {
            bg: 'bg-google-green',
            hover: 'hover:bg-[#1fad68]',
            glass: 'glass-green',
            border: 'border-google-green',
        },
        yellow: {
            bg: 'bg-google-yellow',
            hover: 'hover:bg-[#f5c210]',
            glass: 'glass',
            border: 'border-google-yellow',
        },
    };

    const colors = colorMap[variant] || colorMap.blue;

    return (
        <PhysicsBody
            initialX={initialX}
            initialY={initialY}
            mass={mass}
            restitution={0.3} // Less bouncy than chat bubbles
            friction={0.8}
            frictionAir={0.03}
            enableDrag={!disabled}
            className={`animate-breathe ${className}`}
        >
            <button
                onClick={onClick}
                disabled={disabled}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                    ${colors.bg}
                    ${colors.hover}
                    text-white
                    font-body
                    font-bold
                    px-6 py-3
                    rounded-full
                    shadow-md-3
                    border-2
                    ${colors.border}
                    transition-all
                    duration-300
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    active:scale-95
                    ${isHovered ? 'scale-105' : 'scale-100'}
                    cursor-pointer
                    select-none
                    elevation-3
                `}
                style={{
                    pointerEvents: 'auto',
                }}
            >
                {children}
            </button>
        </PhysicsBody>
    );
};

export default PhysicsButton;
