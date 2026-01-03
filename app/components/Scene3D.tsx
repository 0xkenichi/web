"use client";

import { useEffect, useRef, useState } from "react";

// Fallback 3D scene using CSS 3D transforms (works without Three.js)
export default function Scene3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900" />
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 animate-pulse" />

      {/* Floating 3D Elements using CSS */}
      <div className="absolute inset-0 perspective-1000">
        {/* Message Bubbles */}
        {[...Array(6)].map((_, i) => (
          <FloatingBubble
            key={i}
            delay={i * 0.5}
            position={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
          />
        ))}

        {/* Central 3D Ring */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-64 h-64 animate-spin-slow">
            <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full transform rotate-45" />
            <div className="absolute inset-4 border-4 border-indigo-400/30 rounded-full transform -rotate-45" />
            <div className="absolute inset-8 border-4 border-purple-400/30 rounded-full transform rotate-45" />
          </div>
        </div>

        {/* Particles */}
        {[...Array(50)].map((_, i) => (
          <Particle key={i} delay={i * 0.1} index={i} />
        ))}

        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite',
          }} />
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes floatReverse {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(20px) rotate(-180deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(20px, -30px) scale(1.2);
            opacity: 1;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}

function FloatingBubble({
  delay,
  position,
}: {
  delay: number;
  position: { left: string; top: string };
}) {
  return (
    <div
      className="absolute w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-400/20 to-indigo-500/20 backdrop-blur-sm border border-white/10"
      style={{
        left: position.left,
        top: position.top,
        animation: `float ${3 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        transform: `translateZ(${Math.random() * 100}px)`,
      }}
    >
      <div className="absolute inset-2 bg-white/10 rounded-xl" />
    </div>
  );
}

function Particle({ delay, index }: { delay: number; index: number }) {
  const size = Math.random() * 4 + 2;
  const left = Math.random() * 100;
  const top = Math.random() * 100;

  return (
    <div
      className="absolute rounded-full bg-blue-400/40"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: `${top}%`,
        animation: `particleFloat ${5 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        boxShadow: `0 0 ${size * 2}px rgba(96, 165, 250, 0.5)`,
      }}
    />
  );
}
