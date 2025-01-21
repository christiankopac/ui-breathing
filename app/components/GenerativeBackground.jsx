import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Importar p5 dinámicamente solo en el cliente
const p5 = typeof window === 'undefined' ? null : require('p5');

const GenerativeBackground = ({ phase }) => {
    const containerRef = useRef(null);
    const p5Ref = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !p5) return;

        const sketch = (p) => {
            const particles = [];
            const numParticles = 50;

            class Particle {
                constructor() {
                    this.pos = p.createVector(p.random(p.width), p.random(p.height));
                    this.vel = p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5));
                    this.size = p.random(3, 8);
                    this.color = p.color(255, 255, 255, p.random(50, 100));
                }

                update(breathing) {
                    // Particles move differently based on breathing phase
                    const speedMult = breathing === 'inhale' ? 1.5 : 0.5;
                    this.vel.mult(speedMult);
                    this.pos.add(this.vel);
                    
                    // Wrap around edges
                    if (this.pos.x < 0) this.pos.x = p.width;
                    if (this.pos.x > p.width) this.pos.x = 0;
                    if (this.pos.y < 0) this.pos.y = p.height;
                    if (this.pos.y > p.height) this.pos.y = 0;

                    this.vel.mult(1/speedMult); // Reset velocity
                }

                draw() {
                    p.noStroke();
                    p.fill(this.color);
                    p.circle(this.pos.x, this.pos.y, this.size);
                }

                connectToNeighbors(particles) {
                    for (const other of particles) {
                        const d = p.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
                        if (d < 100) {
                            const alpha = p.map(d, 0, 100, 50, 0);
                            p.stroke(255, 255, 255, alpha);
                            p.line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
                        }
                    }
                }
            }

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight);
                for (let i = 0; i < numParticles; i++) {
                    particles.push(new Particle());
                }
            };

            p.draw = () => {
                p.clear();
                p.background(0, 0, 0, 0);
                
                for (const particle of particles) {
                    particle.update(phase);
                    particle.draw();
                    particle.connectToNeighbors(particles);
                }
            };

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        };

        // Initialize p5
        if (!p5Ref.current) {
            p5Ref.current = new p5(sketch, containerRef.current);
        }

        return () => {
            if (p5Ref.current) {
                p5Ref.current.remove();
                p5Ref.current = null;
            }
        };
    }, [phase]);

    return (
        <div 
            ref={containerRef} 
            className="fixed inset-0 -z-20 pointer-events-none"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

GenerativeBackground.propTypes = {
    phase: PropTypes.string.isRequired
};

export default GenerativeBackground; 