'use client'

import { useEffect, useState, useRef, ReactNode } from 'react'

interface Section {
  title: string
  subtitle: string
  color: string
  description: string
}

interface ScrollNarrativeProps {
  section: Section
  index: number
  isActive: boolean
  children: ReactNode
}

export default function ScrollNarrative({ section, index, isActive, children }: ScrollNarrativeProps) {
  const [scrollY, setScrollY] = useState(0)
  const [inView, setInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => observer.disconnect()
  }, [])

  const parallaxOffset = scrollY * 0.1 * (index + 1)
  const scale = inView ? 1 : 0.95
  const opacity = inView ? 1 : 0.3

  return (
    <div 
      ref={sectionRef}
      className="relative max-w-6xl mx-auto"
      style={{
        transform: `translateY(${parallaxOffset * 0.05}px)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {/* Background floating elements */}
      <div className="absolute -left-20 top-20 w-40 h-40 rounded-full opacity-20 blur-3xl animate-pulse"
        style={{ backgroundColor: section.color }}
      />
      <div className="absolute -right-20 bottom-20 w-60 h-60 rounded-full opacity-10 blur-3xl animate-pulse"
        style={{ backgroundColor: section.color, animationDelay: '1s' }}
      />

      {/* Header with 3D effect */}
      <div 
        className="relative mb-8 text-center"
        style={{
          transform: `perspective(1000px) rotateX(${isActive ? 0 : 10}deg)`,
          transition: 'transform 0.5s ease-out',
          opacity
        }}
      >
        {/* Large background number */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-bold opacity-5 select-none"
          style={{ color: section.color }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Glass card header */}
        <div 
          className="relative inline-block px-8 py-4 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: `
              0 4px 30px rgba(0,0,0,0.3),
              0 0 40px ${section.color}20,
              inset 0 1px 0 rgba(255,255,255,0.1)
            `,
            border: `1px solid ${section.color}30`,
            transform: `scale(${scale})`,
            transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out'
          }}
        >
          <div 
            className="text-sm font-medium tracking-[0.3em] uppercase mb-2"
            style={{ color: section.color }}
          >
            {section.title}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {section.subtitle}
          </h2>
          <p className="text-white/50 text-sm">
            {section.description}
          </p>

          {/* Animated border gradient */}
          <div 
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ opacity: isActive ? 1 : 0, transition: 'opacity 0.3s' }}
          >
            <div 
              className="absolute inset-[-100%] animate-spin-slow"
              style={{
                background: `conic-gradient(from 0deg, transparent, ${section.color}, transparent 30%)`
              }}
            />
            <div className="absolute inset-[1px] rounded-2xl bg-[#0a0a15]" />
          </div>
        </div>

        {/* Decorative lines */}
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-px rounded-full transition-all duration-500"
              style={{
                width: isActive ? `${80 - i * 20}px` : `${40 - i * 10}px`,
                backgroundColor: section.color,
                opacity: isActive ? 0.5 - i * 0.15 : 0.2 - i * 0.05
              }}
            />
          ))}
        </div>
      </div>

      {/* Content with staggered reveal */}
      <div 
        className="relative"
        style={{
          transform: `perspective(1000px) translateZ(${isActive ? 0 : -50}px)`,
          transition: 'transform 0.5s ease-out',
          opacity
        }}
      >
        {/* Glass morphism content wrapper */}
        <div 
          className="relative p-6 md:p-8 rounded-3xl"
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            boxShadow: `
              0 25px 50px -12px rgba(0,0,0,0.5),
              0 0 80px ${section.color}10,
              inset 0 1px 0 rgba(255,255,255,0.05),
              inset 0 -1px 0 rgba(0,0,0,0.1)
            `,
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          {/* Inner glow effect */}
          <div 
            className="absolute inset-0 rounded-3xl opacity-50"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${section.color}15 0%, transparent 50%)`
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>

          {/* Corner accents */}
          <div 
            className="absolute top-0 left-0 w-16 h-16"
            style={{
              background: `linear-gradient(135deg, ${section.color}30 0%, transparent 50%)`,
              borderRadius: '24px 0 24px 0'
            }}
          />
          <div 
            className="absolute bottom-0 right-0 w-16 h-16"
            style={{
              background: `linear-gradient(-45deg, ${section.color}30 0%, transparent 50%)`,
              borderRadius: '0 24px 0 24px'
            }}
          />
        </div>
      </div>

      {/* Connecting line to next section */}
      {index < 2 && (
        <div className="flex justify-center mt-16">
          <div 
            className="w-px h-20 rounded-full"
            style={{
              background: `linear-gradient(180deg, ${section.color}50 0%, transparent 100%)`
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}
