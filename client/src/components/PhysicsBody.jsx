import React, { useEffect, useRef, useState, useId } from 'react';
import Matter from 'matter-js';
import { usePhysics } from '../context/PhysicsContext';

/**
 * PhysicsBody - A component that synchronizes a DOM element with a Matter.js physics body
 * 
 * This component creates an invisible physics body and syncs its position/rotation to a visible DOM element
 * every frame, enabling physics-based interactions while maintaining DOM accessibility (text selection, etc.)
 */
const PhysicsBody = ({
    children,
    initialX,
    initialY,
    mass = 1,
    restitution = 0.6,
    friction = 0.5,
    frictionAir = 0.01,
    isStatic = false,
    enableDrag = true,
    springTo = null, // { x, y, stiffness, damping } for spring constraint
    onCollide = null,
    shape = 'rectangle', // 'rectangle' or 'circle'
    className = '',
    style = {},
}) => {
    const { addBody, removeBody, world, engine } = usePhysics();
    const elementRef = useRef(null);
    const bodyRef = useRef(null);
    const constraintRef = useRef(null);
    const isDraggingRef = useRef(false);
    const mouseConstraintRef = useRef(null);
    const componentId = useId();
    const [dimensions, setDimensions] = useState({ width: 100, height: 100 });

    // Measure DOM element dimensions
    useEffect(() => {
        if (elementRef.current) {
            const rect = elementRef.current.getBoundingClientRect();
            setDimensions({ width: rect.width, height: rect.height });
        }
    }, [children]);

    // Create physics body
    useEffect(() => {
        if (!world || dimensions.width === 0 || dimensions.height === 0) return;

        const x = initialX ?? window.innerWidth / 2;
        const y = initialY ?? -100; // Start above screen by default

        // Create the physics body
        let body;
        if (shape === 'circle') {
            const radius = Math.max(dimensions.width, dimensions.height) / 2;
            body = Matter.Bodies.circle(x, y, radius, {
                mass,
                restitution,
                friction,
                frictionAir,
                isStatic,
                density: mass / (Math.PI * radius * radius),
            });
        } else {
            body = Matter.Bodies.rectangle(x, y, dimensions.width, dimensions.height, {
                mass,
                restitution,
                friction,
                frictionAir,
                isStatic,
                chamfer: { radius: 8 }, // Rounded corners
                density: mass / (dimensions.width * dimensions.height),
            });
        }

        bodyRef.current = body;
        addBody(componentId, body);

        // Add spring constraint if specified
        if (springTo && !isStatic) {
            const constraint = Matter.Constraint.create({
                bodyA: body,
                pointB: { x: springTo.x, y: springTo.y },
                stiffness: springTo.stiffness || 0.01,
                damping: springTo.damping || 0.1,
                length: 0,
            });
            constraintRef.current = constraint;
            Matter.Composite.add(world, constraint);
        }

        // Collision detection
        if (onCollide) {
            Matter.Events.on(engine, 'collisionStart', (event) => {
                event.pairs.forEach(pair => {
                    if (pair.bodyA === body || pair.bodyB === body) {
                        const otherBody = pair.bodyA === body ? pair.bodyB : pair.bodyA;
                        onCollide(otherBody, pair);
                    }
                });
            });
        }

        return () => {
            if (constraintRef.current) {
                Matter.Composite.remove(world, constraintRef.current);
            }
            removeBody(componentId);
        };
    }, [world, dimensions.width, dimensions.height, componentId, mass, restitution, friction, isStatic]);

    // Sync physics to DOM - runs every frame
    useEffect(() => {
        if (!bodyRef.current || !elementRef.current) return;

        let animationFrameId;
        const syncPhysicsToDOM = () => {
            if (bodyRef.current && elementRef.current && !isDraggingRef.current) {
                const { x, y } = bodyRef.current.position;
                const angle = bodyRef.current.angle;

                // Apply transform using translate3d for GPU acceleration
                elementRef.current.style.transform = `translate3d(${x - dimensions.width / 2}px, ${y - dimensions.height / 2}px, 0) rotate(${angle}rad)`;
            }
            animationFrameId = requestAnimationFrame(syncPhysicsToDOM);
        };

        syncPhysicsToDOM();

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [dimensions.width, dimensions.height]);

    // Mouse/Touch drag interaction
    useEffect(() => {
        if (!enableDrag || !elementRef.current || !bodyRef.current || isStatic) return;

        const element = elementRef.current;
        let dragStartPos = null;

        const handlePointerDown = (e) => {
            isDraggingRef.current = true;
            dragStartPos = { x: e.clientX, y: e.clientY };

            // Make body kinematic during drag
            Matter.Body.setStatic(bodyRef.current, true);

            e.stopPropagation();
        };

        const handlePointerMove = (e) => {
            if (!isDraggingRef.current || !bodyRef.current) return;

            // Move the body to cursor position
            Matter.Body.setPosition(bodyRef.current, {
                x: e.clientX,
                y: e.clientY,
            });
        };

        const handlePointerUp = (e) => {
            if (!isDraggingRef.current || !bodyRef.current || !dragStartPos) return;

            // Calculate throw velocity based on drag motion
            const velocityX = (e.clientX - dragStartPos.x) * 0.02;
            const velocityY = (e.clientY - dragStartPos.y) * 0.02;

            // Make body dynamic again
            Matter.Body.setStatic(bodyRef.current, false);

            // Apply velocity for throwing effect
            Matter.Body.setVelocity(bodyRef.current, {
                x: velocityX,
                y: velocityY,
            });

            isDraggingRef.current = false;
            dragStartPos = null;
        };

        element.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);

        return () => {
            element.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [enableDrag, isStatic]);

    return (
        <div
            ref={elementRef}
            className={`physics-object ${className}`}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 'max-content',
                willChange: 'transform',
                ...style,
            }}
        >
            {children}
        </div>
    );
};

export default PhysicsBody;
