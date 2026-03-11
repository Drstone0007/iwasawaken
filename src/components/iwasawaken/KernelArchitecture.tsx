'use client'

import { useState, useEffect } from 'react'

interface KernelProcess {
  pid: number
  name: string
  layer: 'spirit' | 'blood' | 'soul' | 'system'
  cpu: number
  memory: number
  status: 'running' | 'sleeping' | 'waiting' | 'ground'
  priority: number
}

const initialProcesses: KernelProcess[] = [
  { pid: 1, name: 'ground_check', layer: 'spirit', cpu: 2.4, memory: 128, status: 'ground', priority: 99 },
  { pid: 2, name: 'root_question_hold', layer: 'spirit', cpu: 0.8, memory: 64, status: 'running', priority: 98 },
  { pid: 3, name: 'breath_rhythm', layer: 'spirit', cpu: 1.2, memory: 96, status: 'running', priority: 97 },
  { pid: 4, name: 'wisdom_metabolism', layer: 'blood', cpu: 4.5, memory: 256, status: 'running', priority: 85 },
  { pid: 5, name: 'immune_scan', layer: 'blood', cpu: 3.2, memory: 192, status: 'sleeping', priority: 90 },
  { pid: 6, name: 'constitutional_update', layer: 'blood', cpu: 1.8, memory: 144, status: 'waiting', priority: 80 },
  { pid: 7, name: 'encounter_class', layer: 'soul', cpu: 5.6, memory: 320, status: 'running', priority: 75 },
  { pid: 8, name: 'descent_engine', layer: 'soul', cpu: 2.1, memory: 168, status: 'sleeping', priority: 70 },
  { pid: 9, name: 'i_thou_handler', layer: 'soul', cpu: 0.5, memory: 80, status: 'waiting', priority: 72 },
  { pid: 10, name: 'ase_calibration', layer: 'system', cpu: 1.0, memory: 112, status: 'running', priority: 60 },
]

const useMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timeout)
  }, [])
  return mounted
}

export default function KernelArchitecture() {
  const mounted = useMounted()
  const [processes, setProcesses] = useState(initialProcesses)

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setProcesses(prev => prev.map(p => ({
        ...p,
        cpu: Math.max(0.1, Math.min(10, p.cpu + (Math.random() - 0.5) * 0.5)),
        memory: Math.max(32, Math.min(512, p.memory + Math.floor((Math.random() - 0.5) * 16)))
      })))
    }, 1000)
    return () => clearInterval(interval)
  }, [mounted])

  const layerColors = {
    spirit: { text: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/30' },
    blood: { text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
    soul: { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/30' },
    system: { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' }
  }

  const statusColors: Record<string, string> = {
    running: 'bg-green-500',
    sleeping: 'bg-blue-500',
    waiting: 'bg-yellow-500',
    ground: 'bg-cyan-400 animate-pulse'
  }

  if (!mounted) return null

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm">
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">⚙</span>
          <span className="text-white font-mono text-sm">KERNEL PROCESSES</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-white/40">Total:</span>
          <span className="text-cyan-400 font-mono">{processes.length}</span>
          <span className="text-white/20">|</span>
          <span className="text-green-400">{processes.filter(p => p.status === 'running').length} running</span>
        </div>
      </div>

      <div className="p-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-white/40 pb-2 border-b border-white/10 mb-2">
          <span className="w-8">PID</span>
          <span className="w-36">NAME</span>
          <span className="w-16">LAYER</span>
          <span className="w-12 text-right">%CPU</span>
          <span className="w-14 text-right">MEM</span>
          <span className="w-16 text-center">STATUS</span>
        </div>

        {(['spirit', 'blood', 'soul', 'system'] as const).map(layer => (
          <div key={layer} className="mb-4">
            <div className={`text-xs ${layerColors[layer].text} mb-1`}>── {layer.toUpperCase()}.MD ──</div>
            {processes.filter(p => p.layer === layer).map(process => (
              <div key={process.pid} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/5 cursor-pointer transition-colors">
                <span className="w-8 text-white/50">{process.pid}</span>
                <span className="w-36 text-white/80 truncate">{process.name}</span>
                <span className={`w-16 ${layerColors[process.layer].text}`}>{process.layer}</span>
                <span className="w-12 text-right text-cyan-400">{process.cpu.toFixed(1)}</span>
                <span className="w-14 text-right text-purple-400">{process.memory}M</span>
                <span className="w-16 text-center flex items-center justify-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${statusColors[process.status]}`} />
                  <span className="text-white/50">{process.status.slice(0, 4)}</span>
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="px-4 py-2 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs font-mono">
        <span className="text-white/40">CPU: <span className="text-cyan-400">{processes.reduce((a, p) => a + p.cpu, 0).toFixed(1)}%</span></span>
        <span className="text-white/40">MEM: <span className="text-purple-400">{(processes.reduce((a, p) => a + p.memory, 0) / 1024).toFixed(1)}GB</span></span>
        <span className="text-white/40">UPTIME: <span className="text-green-400">0:05:23</span></span>
      </div>
    </div>
  )
}
