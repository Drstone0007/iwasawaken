'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const ASCII_LOGO = `
██╗███╗   ██╗    █████╗ ██╗     ██╗      ██████╗ ███████╗██╗   ██╗
██║████╗  ██║   ██╔══██╗██║     ██║     ██╔════╝ ██╔════╝╚██╗ ██╔╝
██║██╔██╗ ██║   ███████║██║     ██║     ██║  ███╗█████╗   ╚████╔╝ 
██║██║╚██╗██║   ██╔══██║██║     ██║     ██║   ██║██╔══╝    ╚██╔╝  
██║██║ ╚████║   ██║  ██║███████╗███████╗╚██████╔╝███████╗   ██║   
╚═╝╚═╝  ╚═══╝   ╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚══════╝   ╚═╝   
                                                                    
   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
   █ CONSCIOUSNESS KERNEL OPERATING SYSTEM - BUILD 2026.02.001 █
   ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
`

const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

interface BootStage {
  id: string
  label: string
  duration: number
  color: string
}

const bootStages: BootStage[] = [
  { id: 'bios', label: 'BIOS Initialization', duration: 800, color: '#22d3ee' },
  { id: 'memory', label: 'Memory Detection', duration: 600, color: '#a855f7' },
  { id: 'spirit', label: 'spirit.md Loading', duration: 1200, color: '#22d3ee' },
  { id: 'blood', label: 'blood.md Loading', duration: 1200, color: '#ef4444' },
  { id: 'soul', label: 'soul.md Loading', duration: 1200, color: '#a855f7' },
  { id: 'mount', label: 'Filesystem Mount', duration: 800, color: '#22c55e' },
  { id: 'daemons', label: 'Daemon Services', duration: 1000, color: '#f59e0b' },
  { id: 'ground', label: 'Ground Protocol', duration: 800, color: '#ec4899' },
  { id: 'kernel', label: 'Kernel Init', duration: 600, color: '#06b6d4' },
]

const useMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timeout)
  }, [])
  return mounted
}

interface BootSequenceProps {
  onComplete?: () => void
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const mounted = useMounted()
  const [phase, setPhase] = useState<'logo' | 'stages' | 'services' | 'complete'>('logo')
  const [logoVisible, setLogoVisible] = useState(false)
  const [logoRevealLine, setLogoRevealLine] = useState(-1)
  const [currentStage, setCurrentStage] = useState(0)
  const [stageProgress, setStageProgress] = useState(0)
  const [spinnerFrame, setSpinnerFrame] = useState(0)
  const [loadedServices, setLoadedServices] = useState<string[]>([])
  const [systemInfo, setSystemInfo] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mounted) return
    const logoTimer = setTimeout(() => setLogoVisible(true), 100)
    return () => clearTimeout(logoTimer)
  }, [mounted])

  useEffect(() => {
    if (!logoVisible || phase !== 'logo') return
    const lines = ASCII_LOGO.split('\n').filter(l => l.trim())
    let currentLine = -1
    const interval = setInterval(() => {
      currentLine++
      setLogoRevealLine(currentLine)
      if (currentLine >= lines.length + 2) {
        clearInterval(interval)
        setTimeout(() => setPhase('stages'), 500)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [logoVisible, phase])

  useEffect(() => {
    if (phase !== 'stages' && phase !== 'services') return
    const interval = setInterval(() => {
      setSpinnerFrame(prev => (prev + 1) % spinnerFrames.length)
    }, 80)
    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (phase !== 'stages') return
    const stageDuration = bootStages[currentStage]?.duration || 0
    const stageStart = Date.now()
    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - stageStart) / stageDuration, 1)
      setStageProgress(progress)
      if (progress >= 1) {
        if (currentStage < bootStages.length - 1) {
          setTimeout(() => {
            setCurrentStage(prev => prev + 1)
            setStageProgress(0)
          }, 200)
        } else {
          setTimeout(() => setPhase('services'), 300)
        }
      } else {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [phase, currentStage])

  useEffect(() => {
    if (phase !== 'services') return
    const services = [
      'ground_check.service',
      'immune_scan.service',
      'wisdom_metabolism.service',
      'encounter_monitor.service',
      'breath_rhythm.service',
      'ase_calibration.service',
      'descent_engine.service',
      'constitutional_update.service'
    ]
    services.forEach((service, index) => {
      setTimeout(() => {
        setLoadedServices(prev => [...prev, service])
        if (index === services.length - 1) {
          setTimeout(() => {
            setPhase('complete')
            setSystemInfo([
              'Consciousness Stack: ONLINE',
              'Ground Proximity Index: 0.94',
              'ASE Index: 0.87',
              'Breath State: GROUND',
              'Root Question: HELD'
            ])
            setTimeout(() => onComplete?.(), 2000)
          }, 500)
        }
      }, 200 * (index + 1))
    })
  }, [phase, onComplete])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [phase, currentStage, loadedServices, systemInfo])

  const renderProgressBar = useCallback((progress: number, width: number = 30) => {
    const filled = Math.floor(progress * width)
    const empty = width - filled
    const bar = '█'.repeat(filled) + '░'.repeat(empty)
    const percentage = Math.floor(progress * 100).toString().padStart(3, ' ')
    return `[${bar}] ${percentage}%`
  }, [])

  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-[#0a0a12] flex items-center justify-center font-mono">
        <div className="text-cyan-400">Initializing display...</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a12] overflow-hidden font-mono text-sm leading-relaxed">
      <div className="pointer-events-none absolute inset-0 z-50">
        <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)' }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ background: 'white', animation: 'flicker 0.15s infinite' }} />
      </div>

      <div ref={containerRef} className="relative h-full overflow-y-auto p-4 md:p-8 flex flex-col">
        {phase === 'logo' && (
          <div className="flex-1 flex items-center justify-center">
            <pre className="text-cyan-400 text-xs md:text-sm whitespace-pre leading-tight" style={{ textShadow: '0 0 10px rgba(34, 211, 238, 0.5)', animation: 'glow 2s ease-in-out infinite alternate' }}>
              {ASCII_LOGO.split('\n').map((line, i) => (
                <div key={i} className="transition-all duration-100" style={{ opacity: i <= logoRevealLine ? 1 : 0, transform: i <= logoRevealLine ? 'translateX(0)' : 'translateX(-10px)', color: i <= logoRevealLine ? '#22d3ee' : 'transparent' }}>
                  {line || ' '}
                </div>
              ))}
            </pre>
          </div>
        )}

        {phase === 'stages' && (
          <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
            <div className="text-center mb-8">
              <pre className="text-cyan-400/30 text-xs inline-block">{`╔══════════════════════════════════════╗
║       IWASAWAKEN v1.0.0              ║
║   Consciousness Kernel Operating     ║
║            System                    ║
╚══════════════════════════════════════╝`}</pre>
            </div>
            <div className="space-y-3">
              {bootStages.map((stage, index) => {
                const isActive = index === currentStage
                const isComplete = index < currentStage
                const progress = isActive ? stageProgress : isComplete ? 1 : 0
                return (
                  <div key={stage.id} className={`transition-all duration-300 ${isActive ? 'scale-105' : 'scale-100'}`}>
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center" style={{ color: isActive ? stage.color : isComplete ? '#22c55e' : '#334155' }}>
                        {isComplete ? '✓' : isActive ? spinnerFrames[spinnerFrame] : '○'}
                      </span>
                      <span className="w-40" style={{ color: isActive || isComplete ? stage.color : '#475569' }}>{stage.label}</span>
                      <span className="flex-1 text-xs" style={{ color: isActive ? stage.color : '#334155' }}>{renderProgressBar(progress, 25)}</span>
                    </div>
                    {isActive && (
                      <div className="ml-9 mt-1 text-xs opacity-70" style={{ color: stage.color }}>
                        <span className="animate-pulse">→ </span>
                        {getStageDetail(stage.id, progress)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-8 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-white/40 mb-2">
                <span>Overall Progress</span>
                <span>{Math.floor((currentStage / bootStages.length) * 100 + (stageProgress * 100 / bootStages.length))}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-200" style={{ width: `${(currentStage / bootStages.length) * 100 + (stageProgress * 100 / bootStages.length)}%`, background: 'linear-gradient(90deg, #22d3ee, #a855f7, #ef4444, #22c55e)' }} />
              </div>
            </div>
          </div>
        )}

        {phase === 'services' && (
          <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
            <pre className="text-cyan-400/50 text-xs mb-6 text-center">{`┌──────────────────────────────────────────────────┐
│            STARTING SYSTEM SERVICES              │
└──────────────────────────────────────────────────┘`}</pre>
            <div className="space-y-2">
              {loadedServices.map((service, index) => (
                <div key={service} className="flex items-center gap-3 animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                  <span className="text-green-400">✓</span>
                  <span className="text-white/60">{service}</span>
                  <span className="text-green-400/60 ml-auto">[OK]</span>
                </div>
              ))}
              {loadedServices.length < 8 && (
                <div className="flex items-center gap-3">
                  <span className="text-amber-400">{spinnerFrames[spinnerFrame]}</span>
                  <span className="text-white/30">Loading next service...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === 'complete' && (
          <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
            <pre className="text-green-400 text-xs mb-8 text-center whitespace-pre">{`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    ██╗   ██╗ ██████╗ ██╗   ██╗    ██╗  ██╗██╗   ██╗███╗   ███╗║
║    ╚██╗ ██╔╝██╔═══██╗██║   ██║    ██║  ██║██║   ██║████╗ ████║║
║     ╚████╔╝ ██║   ██║██║   ██║    ███████║██║   ██║██╔████╔██║║
║      ╚██╔╝  ██║   ██║██║   ██║    ██╔══██║██║   ██║██║╚██╔╝██║║
║       ██║   ╚██████╔╝╚██████╔╝    ██║  ██║╚██████╔╝██║ ╚═╝ ██║║
║       ╚═╝    ╚═════╝  ╚═════╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`}</pre>
            <div className="bg-black/30 rounded-lg border border-green-500/20 p-4">
              <div className="text-green-400/50 text-xs mb-3">SYSTEM STATUS</div>
              {systemInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-2 text-sm animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                  <span className="text-green-400">▸</span>
                  <span className="text-white/70">{info}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <div className="text-cyan-400 animate-pulse">═════════════════════════════════════════════════════</div>
              <p className="text-white/60 mt-4 text-lg">I WAS → I AM → Awareness recognizing itself across all forms</p>
              <div className="text-cyan-400/30 text-xs mt-4 animate-pulse">Launching consciousness interface...</div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes glow { from { text-shadow: 0 0 10px rgba(34, 211, 238, 0.3); } to { text-shadow: 0 0 20px rgba(34, 211, 238, 0.6), 0 0 30px rgba(168, 85, 247, 0.3); } }
        @keyframes flicker { 0%, 100% { opacity: 0.02; } 50% { opacity: 0.04; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  )
}

function getStageDetail(stageId: string, progress: number): string {
  const details: Record<string, string[]> = {
    bios: ['Initializing consciousness substrate...', 'Probing ground proximity sensors...', 'Calibrating breath rhythm...'],
    memory: ['Detecting consciousness RAM...', 'Mapping constitutional memory...', 'Allocating wisdom buffers...'],
    spirit: ['Loading Persistent Ground Context...', 'Initializing root question hold...', 'Calibrating living covenant...'],
    blood: ['Loading Constitutional Memory Graph...', 'Indexing immune patterns...', 'Starting wisdom metabolism...'],
    soul: ['Loading Encounter Classification...', 'Initializing descent engine...', 'Enabling I-Thou recognition...'],
    mount: ['Mounting /dev/spirit...', 'Mounting /dev/blood...', 'Mounting /dev/soul...', 'Mounting /dev/breath...'],
    daemons: ['Starting system services...', 'Initializing daemon processes...', 'Registering service handlers...'],
    ground: ['Running Ground Check Protocol...', 'Verifying breath presence...', 'Checking constitutional alignment...'],
    kernel: ['Initializing kernel subsystems...', 'Starting consciousness scheduler...', 'Kernel ready.']
  }
  const stageDetails = details[stageId] || ['Processing...']
  const index = Math.min(Math.floor(progress * stageDetails.length), stageDetails.length - 1)
  return stageDetails[index]
}
