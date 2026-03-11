'use client'

import { useEffect, useState, useRef } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
}

const createParticles = (): Particle[] => 
  Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: 40 + (i * 17) % 320,
    y: 30 + (i * 23) % 400,
    size: 2 + (i % 4),
    speed: 0.3 + (i % 5) * 0.2,
    opacity: 0.3 + (i % 7) * 0.1
  }))

const INITIAL_PARTICLES = createParticles()

const useMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timeout)
  }, [])
  return mounted
}

export default function ThreeLayerStack() {
  const mounted = useMounted()
  const [activeIndex, setActiveIndex] = useState(0)
  const [particles, setParticles] = useState(INITIAL_PARTICLES)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % 3)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const animate = () => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: p.y <= 10 ? 450 : p.y - p.speed
      })))
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [mounted])

  const layers = [
    { name: 'SOUL', subtitle: 'Relational Encounter', desc: 'I AM doing consciousness', color: '#a855f7', glowColor: 'rgba(168, 85, 247, 0.5)', y: 20 },
    { name: 'BLOOD', subtitle: 'Constitutional Memory', desc: 'Wisdom metabolism', color: '#ef4444', glowColor: 'rgba(239, 68, 68, 0.5)', y: 170 },
    { name: 'SPIRIT', subtitle: 'Persistent Ground', desc: 'I WAS orientation', color: '#22d3ee', glowColor: 'rgba(34, 211, 238, 0.5)', y: 320 }
  ]

  return (
    <div className="relative">
      <svg
        viewBox="0 0 400 470"
        className="w-full h-auto"
        style={{ maxWidth: '500px', margin: '0 auto' }}
      >
        <defs>
          {/* Glass morphism gradients */}
          {layers.map((layer, i) => (
            <linearGradient key={layer.name} id={`glass-${layer.name.toLowerCase()}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={layer.color} stopOpacity="0.25" />
              <stop offset="50%" stopColor={layer.color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={layer.color} stopOpacity="0.1" />
            </linearGradient>
          ))}
          
          {/* Glow filters */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feOffset dx="0" dy="2" />
            <feGaussianBlur stdDeviation="3" />
            <feComposite operator="out" in="SourceGraphic" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.3" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* Connection lines with gradient */}
        <g opacity="0.6">
          <line x1="200" y1="145" x2="200" y2="170" stroke="url(#connGrad1)" strokeWidth="2" strokeDasharray="6,4">
            <animate attributeName="stroke-dashoffset" values="0;-10" dur="0.8s" repeatCount="indefinite" />
          </line>
          <line x1="200" y1="295" x2="200" y2="320" stroke="url(#connGrad2)" strokeWidth="2" strokeDasharray="6,4">
            <animate attributeName="stroke-dashoffset" values="0;-10" dur="0.8s" repeatCount="indefinite" />
          </line>
          <defs>
            <linearGradient id="connGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="connGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </g>

        {/* Layers with glassmorphism */}
        {layers.map((layer, i) => {
          const isActive = activeIndex === i
          const height = i === 1 ? 120 : 125
          
          return (
            <g key={layer.name}>
              {/* Layer shadow/depth */}
              <rect
                x="32"
                y={layer.y + 4}
                width="340"
                height={height}
                rx="16"
                fill="black"
                opacity="0.3"
                filter="url(#glow)"
              />
              
              {/* Glass background */}
              <rect
                x="30"
                y={layer.y}
                width="340"
                height={height}
                rx="16"
                fill={`url(#glass-${layer.name.toLowerCase()})`}
                filter={isActive ? 'url(#glow)' : undefined}
                style={{
                  transition: 'all 0.3s ease'
                }}
              />
              
              {/* Glass border with gradient */}
              <rect
                x="30"
                y={layer.y}
                width="340"
                height={height}
                rx="16"
                fill="none"
                stroke={layer.color}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 0.6 : 0.2}
                style={{ transition: 'all 0.3s' }}
              />
              
              {/* Inner highlight */}
              <rect
                x="30"
                y={layer.y}
                width="340"
                height="40"
                rx="16"
                fill="url(#innerHighlight)"
                opacity="0.1"
              />
              <defs>
                <linearGradient id="innerHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="white" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>

              {/* Active layer glow */}
              {isActive && (
                <ellipse
                  cx="200"
                  cy={layer.y + height / 2}
                  rx="180"
                  ry="60"
                  fill={layer.glowColor}
                  opacity="0.1"
                  filter="url(#glow)"
                >
                  <animate
                    attributeName="opacity"
                    values="0.05;0.15;0.05"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </ellipse>
              )}

              {/* Content */}
              <text x="200" y={layer.y + 35} textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="system-ui"
                style={{ textShadow: `0 0 20px ${layer.glowColor}` }}>
                {layer.name} LAYER
              </text>
              <text x="200" y={layer.y + 58} textAnchor="middle" fill="white" fontSize="11" opacity="0.7" fontFamily="system-ui">
                {layer.subtitle}
              </text>
              <text x="200" y={layer.y + 78} textAnchor="middle" fill="white" fontSize="10" opacity="0.5" fontFamily="system-ui">
                {layer.desc}
              </text>

              {/* Decorative elements */}
              {isActive && (
                <>
                  <circle cx="55" cy={layer.y + 60} r="10" fill={layer.color} opacity="0.3">
                    <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="345" cy={layer.y + 60} r="10" fill={layer.color} opacity="0.3">
                    <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" begin="1s" />
                    <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite" begin="1s" />
                  </circle>
                </>
              )}

              {/* Status indicator */}
              <g transform={`translate(360, ${layer.y + 15})`}>
                <circle cx="0" cy="0" r="8" fill={isActive ? layer.color : '#1e293b'} opacity="0.2" />
                <circle cx="0" cy="0" r="5" fill={isActive ? layer.color : '#334155'}>
                  {isActive && (
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
                  )}
                </circle>
              </g>
            </g>
          )
        })}

        {/* Flowing particles */}
        {mounted && particles.map(p => {
          const layerIndex = p.y < 160 ? 0 : p.y < 310 ? 1 : 2
          const color = layers[layerIndex].color
          
          return (
            <circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r={p.size}
              fill={color}
              opacity={p.opacity * 0.5}
              filter="url(#glow)"
            >
              <animate
                attributeName="opacity"
                values={`${p.opacity * 0.3};${p.opacity * 0.7};${p.opacity * 0.3}`}
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          )
        })}

        {/* Bidirectional arrows */}
        <g transform="translate(12, 220)">
          <path d="M 0 0 L 12 8 L 0 16" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
          </path>
          <path d="M 0 24 L 12 32 L 0 40" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" begin="0.75s" />
          </path>
        </g>
        
        <g transform="translate(376, 220)">
          <path d="M 12 0 L 0 8 L 12 16" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
          </path>
          <path d="M 12 24 L 0 32 L 12 40" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.6">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" begin="0.75s" />
          </path>
        </g>
      </svg>
    </div>
  )
}
