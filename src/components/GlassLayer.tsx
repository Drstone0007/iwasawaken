'use client'

import { useEffect, useState } from 'react'

interface GlassLayerProps {
  title: string
  value: string
  color: string
  delay: number
}

export default function GlassLayer({ title, value, color, delay }: GlassLayerProps) {
  const [mounted, setMounted] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), delay * 1000)
    return () => clearTimeout(timeout)
  }, [delay])

  return (
    <div
      className={`
        relative w-48 p-4 rounded-2xl
        transition-all duration-500 cursor-pointer
        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{
        transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        transformStyle: 'preserve-3d'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glass morphism background */}
      <div 
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.1)
          `
        }}
      />
      
      {/* Animated border */}
      <div 
        className="absolute inset-0 rounded-2xl p-[1px]"
        style={{
          background: `linear-gradient(135deg, ${color}40 0%, transparent 50%, ${color}20 100%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor'
        }}
      />

      {/* Glow effect on hover */}
      <div 
        className="absolute -inset-2 rounded-3xl opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${color}30 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="text-xs text-white/50 uppercase tracking-wider mb-2">{title}</div>
        <div 
          className="text-2xl font-bold"
          style={{ color }}
        >
          {value}
        </div>
      </div>

      {/* Floating particles inside */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: color,
              opacity: 0.3,
              left: `${20 + i * 30}%`,
              top: '100%',
              animation: `floatUp ${3 + i}s linear infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
