import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const PhysicsContext = createContext(null);

export const usePhysics = () => {
    const context = useContext(PhysicsContext);
    if (!context) {
        throw new Error('usePhysics must be used within a PhysicsProvider');
    }
    return context;
};

export const PhysicsProvider = ({ children, enabled = true, gravity = { x: 0, y: 1 } }) => {
    const engineRef = useRef(null);
    const worldRef = useRef(null);
    const runnerRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const bodiesRef = useRef(new Map()); // Track all physics bodies

    useEffect(() => {
        if (!enabled) return;

        // Create Matter.js engine
        const engine = Matter.Engine.create({
            gravity: gravity,
            timing: {
                timeScale: 1, // Normal speed
            },
        });

        engineRef.current = engine;
        worldRef.current = engine.world;

        // Create boundaries (walls) based on window size
        const createBoundaries = () => {
            const thickness = 50;
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Remove old boundaries if they exist
            const existingBoundaries = Matter.Composite.allBodies(worldRef.current)
                .filter(body => body.label === 'boundary');
            Matter.Composite.remove(worldRef.current, existingBoundaries);

            // Floor
            const floor = Matter.Bodies.rectangle(
                width / 2,
                height + thickness / 2,
                width,
                thickness,
                {
                    isStatic: true,
                    label: 'boundary',
                    restitution: 0.3,
                    friction: 0.5,
                }
            );

            // Left wall
            const leftWall = Matter.Bodies.rectangle(
                -thickness / 2,
                height / 2,
                thickness,
                height,
                {
                    isStatic: true,
                    label: 'boundary',
                    restitution: 0.3,
                }
            );

            // Right wall
            const rightWall = Matter.Bodies.rectangle(
                width + thickness / 2,
                height / 2,
                thickness,
                height,
                {
                    isStatic: true,
                    label: 'boundary',
                    restitution: 0.3,
                }
            );

            // Ceiling (optional, can be removed to let items fall from above)
            const ceiling = Matter.Bodies.rectangle(
                width / 2,
                -thickness / 2,
                width,
                thickness,
                {
                    isStatic: true,
                    label: 'boundary',
                    restitution: 0.3,
                }
            );

            Matter.Composite.add(worldRef.current, [floor, leftWall, rightWall]);
        };

        createBoundaries();

        // Handle window resize
        const handleResize = () => {
            createBoundaries();
        };
        window.addEventListener('resize', handleResize);

        // Start the physics engine
        const runner = Matter.Runner.create({
            fps: 60,
            isFixed: false,
        });
        Matter.Runner.run(runner, engine);
        runnerRef.current = runner;

        setIsReady(true);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (runnerRef.current) {
                Matter.Runner.stop(runnerRef.current);
            }
            if (engineRef.current) {
                Matter.Engine.clear(engineRef.current);
            }
            bodiesRef.current.clear();
        };
    }, [enabled, gravity.x, gravity.y]);

    // Add a body to the physics world
    const addBody = (id, body) => {
        if (!worldRef.current || !body) return;
        Matter.Composite.add(worldRef.current, body);
        bodiesRef.current.set(id, body);
    };

    // Remove a body from the physics world
    const removeBody = (id) => {
        const body = bodiesRef.current.get(id);
        if (body && worldRef.current) {
            Matter.Composite.remove(worldRef.current, body);
            bodiesRef.current.delete(id);
        }
    };

    // Get a body by ID
    const getBody = (id) => {
        return bodiesRef.current.get(id);
    };

    // Apply force to a body
    const applyForce = (id, force) => {
        const body = bodiesRef.current.get(id);
        if (body) {
            Matter.Body.applyForce(body, body.position, force);
        }
    };

    // Create an explosion force at a point
    const createExplosion = (x, y, radius = 200, force = 0.05) => {
        const bodies = Matter.Composite.allBodies(worldRef.current);
        bodies.forEach(body => {
            if (!body.isStatic) {
                const dx = body.position.x - x;
                const dy = body.position.y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < radius) {
                    const magnitude = force * (1 - distance / radius);
                    const angle = Math.atan2(dy, dx);
                    Matter.Body.applyForce(body, body.position, {
                        x: Math.cos(angle) * magnitude,
                        y: Math.sin(angle) * magnitude,
                    });
                }
            }
        });
    };

    // Set gravity direction (for gyroscope)
    const setGravity = (x, y) => {
        if (engineRef.current) {
            engineRef.current.gravity.x = x;
            engineRef.current.gravity.y = y;
        }
    };

    const value = {
        engine: engineRef.current,
        world: worldRef.current,
        runner: runnerRef.current,
        isReady,
        addBody,
        removeBody,
        getBody,
        applyForce,
        createExplosion,
        setGravity,
    };

    return (
        <PhysicsContext.Provider value={value}>
            {children}
        </PhysicsContext.Provider>
    );
};

export default PhysicsContext;
