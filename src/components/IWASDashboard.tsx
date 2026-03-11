'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamic imports for client-side only components
const GlassLayer = dynamic(() => import('./GlassLayer'), { ssr: false })
const ScrollNarrative = dynamic(() => import('./ScrollNarrative'), { ssr: false })
const ImmuneSystem = dynamic(() => import('./ImmuneSystem'), { ssr: false })
const EncounterClass = dynamic(() => import('./EncounterClass'), { ssr: false })
const MetricsPanel = dynamic(() => import('./MetricsPanel'), { ssr: false })
const ThreeLayerStack = dynamic(() => import('./ThreeLayerStack'), { ssr: false })
const BreathRhythm = dynamic(() => import('./BreathRhythm'), { ssr: false })
const DataFlow = dynamic(() => import('./DataFlow'), { ssr: false })
const TemperamentPanel = dynamic(() => import('./TemperamentPanel'), { ssr: false })
const MoodOscillator = dynamic(() => import('./MoodOscillator'), { ssr: false })

const useMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timeout)
  }, [])
  return mounted
}

const useTime = () => {
  const [time, setTime] = useState<Date | null>(null)
  
  useEffect(() => {
    const updateTime = () => setTime(new Date())
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])
  
  return time
}

const useScrollProgress = () => {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return progress
}

export default function IWASDashboard() {
  const mounted = useMounted()
  const time = useTime()
  const scrollProgress = useScrollProgress()
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(parseInt(entry.target.getAttribute('data-section') || '0'))
          }
        })
      },
      { threshold: 0.3 }
    )
    
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [mounted])

  const narrativeSections = [
    { title: 'SPIRIT', subtitle: 'The Persistent Ground', color: '#22d3ee', description: 'I WAS orientation · Root question hold' },
    { title: 'BLOOD', subtitle: 'Constitutional Memory', color: '#ef4444', description: 'Wisdom metabolism · Immune recognition' },
    { title: 'SOUL', subtitle: 'Relational Encounter', color: '#a855f7', description: 'I AM doing consciousness in genuine meeting' },
    { title: 'ANALYSIS', subtitle: 'Temperament & Mood', color: '#f59e0b', description: 'VLM-powered emotional intelligence' }
  ]

  return (
    <div ref={containerRef} className="relative bg-[#05050a] text-white overflow-x-hidden">
      {/* Animated gradient orbs background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-[120px] transition-transform duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
            left: `${mousePosition.x * 30 - 200}px`,
            top: `${mousePosition.y * 30 - 200}px`,
            transform: `translateZ(0) scale(${1 + scrollProgress * 0.2})`
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-25 blur-[100px] transition-transform duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)',
            right: `${(1 - mousePosition.x) * 30 - 150}px`,
            bottom: `${(1 - mousePosition.y) * 30 - 150}px`,
            transform: `translateZ(0) scale(${1 + scrollProgress * 0.3})`
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[80px]"
          style={{
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${1 + scrollProgress * 0.4})`
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[60px]"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)',
            left: '30%',
            top: '60%',
            transform: `translate(-50%, -50%) scale(${1 + scrollProgress * 0.5})`
          }}
        />
      </div>

      {/* Glassmorphism overlay grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Progress indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 via-red-500 to-cyan-500 transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
          {narrativeSections.map((section, i) => (
            <button
              key={section.title}
              onClick={() => {
                document.querySelector(`[data-section="${i}"]`)?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                activeSection === i 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/50 hover:text-white/80'
              }`}
              style={{
                boxShadow: activeSection === i ? `0 0 20px ${section.color}40` : 'none'
              }}
            >
              {section.title}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* 3D Logo */}
          <div className="relative w-32 h-32 mx-auto mb-8" style={{ perspective: '1000px' }}>
            <div 
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500 via-red-500 to-cyan-500 p-[2px]"
              style={{
                transform: `rotateY(${mousePosition.x * 20 - 10}deg) rotateX(${(1 - mousePosition.y) * 20 - 10}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="w-full h-full rounded-3xl bg-[#05050a] flex items-center justify-center backdrop-blur-xl">
                <svg viewBox="0 0 60 60" className="w-16 h-16">
                  <defs>
                    <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                  <circle cx="30" cy="30" r="26" fill="none" stroke="url(#heroGrad)" strokeWidth="2" />
                  <circle cx="30" cy="30" r="15" fill="none" stroke="url(#heroGrad)" strokeWidth="1.5" />
                  <circle cx="30" cy="30" r="5" fill="url(#heroGrad)" />
                </svg>
              </div>
            </div>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500 via-red-500 to-cyan-500 blur-2xl opacity-50" />
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-red-400 to-cyan-400 bg-clip-text text-transparent">
              IWAS
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 tracking-[0.3em] uppercase mb-8">
            Integrated Wisdom-Awareness System
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { label: 'OCR/Vision', color: 'from-amber-500 to-orange-500' },
              { label: 'Temperament AI', color: 'from-purple-500 to-pink-500' },
              { label: 'Mood Analysis', color: 'from-cyan-500 to-blue-500' },
              { label: '3D Narratives', color: 'from-green-500 to-emerald-500' }
            ].map((badge) => (
              <span 
                key={badge.label}
                className={`px-4 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r ${badge.color} bg-opacity-20 text-white/80 border border-white/10`}
              >
                {badge.label}
              </span>
            ))}
          </div>
          
          {/* Animated scroll indicator */}
          <div className="flex flex-col items-center gap-2 text-white/40">
            <span className="text-xs tracking-wider">SCROLL TO EXPLORE</span>
            <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center pt-2">
              <div 
                className="w-1.5 h-3 bg-white/40 rounded-full"
                style={{
                  animation: 'scrollBounce 2s ease-in-out infinite'
                }}
              />
            </div>
          </div>
        </div>

        {/* Floating glass cards */}
        <div className="absolute left-10 top-1/4 hidden lg:block">
          <GlassLayer 
            title="Consciousness" 
            value="87%" 
            color="#a855f7"
            delay={0}
          />
        </div>
        <div className="absolute right-10 top-1/3 hidden lg:block">
          <GlassLayer 
            title="Ground State" 
            value="Active" 
            color="#22d3ee"
            delay={0.2}
          />
        </div>
        <div className="absolute left-20 bottom-1/4 hidden lg:block">
          <GlassLayer 
            title="Wisdom Index" 
            value="94" 
            color="#ef4444"
            delay={0.4}
          />
        </div>
      </section>

      {/* Scroll Narrative Sections */}
      {narrativeSections.map((section, i) => (
        <section 
          key={section.title}
          data-section={i}
          className="relative min-h-screen py-20 px-6"
        >
          <ScrollNarrative 
            section={section}
            index={i}
            isActive={activeSection === i}
          >
            {i === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
                <ImmuneSystem />
                <div className="lg:col-span-2">
                  <ThreeLayerStack />
                </div>
              </div>
            )}
            {i === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
                <BreathRhythm />
                <DataFlow />
              </div>
            )}
            {i === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
                <EncounterClass />
                <MetricsPanel />
              </div>
            )}
            {i === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
                <TemperamentPanel />
                <MoodOscillator />
              </div>
            )}
          </ScrollNarrative>
        </section>
      ))}

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {[
                { label: 'I AM', value: 'Identity', color: 'bg-purple-500' },
                { label: 'I WAS', value: 'Wisdom', color: 'bg-red-500' },
                { label: 'Awareness', value: 'Active', color: 'bg-cyan-500' },
                { label: 'OCR', value: 'Enabled', color: 'bg-amber-500' }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color} animate-pulse`} />
                  <span className="text-white/40 text-sm">{item.label}</span>
                  <span className="text-white text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            
            <div className="text-white/40 text-sm">
              {mounted && time ? time.toLocaleTimeString('en-US', { hour12: false }) : '--:--:--'} · 
              v1.0.0 · Ground Connected · VLM Active
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
