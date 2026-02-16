"use client";
import React from 'react';

const BeautifulBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base Gradient - Deep Navy */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 10%, hsl(220 30% 12% / 0.8) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 90%, hsl(220 25% 14% / 0.6) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, hsl(222 30% 6%) 0%, hsl(220 30% 4%) 100%)
          `,
        }}
      />
      
      {/* Subtle Gold Glow */}
      <div 
        className="absolute top-0 right-0 w-[800px] h-[800px] opacity-[0.08]"
        style={{
          background: 'radial-gradient(circle, hsl(38 70% 58%) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Elegant Grid Pattern - Very Subtle */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsl(220 30% 4% / 0.4) 100%)',
        }}
      />
    </div>
  );
};

export default BeautifulBackground;
