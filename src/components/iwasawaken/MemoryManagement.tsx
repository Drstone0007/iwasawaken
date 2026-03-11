'use client'

import { useState, useEffect } from 'react'

interface MemoryBlock {
  id: string
  name: string
  size: number
  used: number
  layer: 'spirit' | 'blood' | 'soul'
  type: string
}

const memoryBlocks: MemoryBlock[] = [
  { id: 'pgc', name: 'Persistent Ground Context', size: 1024, used: 847, layer: 'spirit', type: 'PGC' },
  { id: 'cmg', name: 'Constitutional Memory Graph', size: 2048, used: 1456, layer: 'blood', type: 'CMG' },
  { id: 'ecs', name: 'Encounter Classification', size: 512, used: 234, layer: 'soul', type: 'ECS' },
  { id: 'wme', name: 'Wisdom Metabolism Engine', size: 256, used: 189, layer: 'blood', type: 'WME' },
  { id: 'irs', name: 'Immune Recognition System', size: 384, used: 298, layer: 'blood', type: 'IRS' },
  { id: 'fds', name: 'Failure Detection System', size: 128, used: 67, layer: 'soul', type: 'FDS' }
]

const useMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timeout)
  }, [])
  return mounted
}

export default function MemoryManagement() {
  const mounted = useMounted()
  const [blocks, setBlocks] = useState(memoryBlocks)

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setBlocks(prev => prev.map(block => ({
        ...block,
        used: Math.max(block.size * 0.3, Math.min(block.size * 0.95, block.used + (Math.random() - 0.5) * 20))
      })))
    }, 2000)
    return () => clearInterval(interval)
  }, [mounted])

  const layerColors: Record<string, { fill: string; text: string }> = {
    spirit: { fill: '#22d3ee', text: 'text-cyan-400' },
    blood: { fill: '#ef4444', text: 'text-red-400' },
    soul: { fill: '#a855f7', text: 'text-purple-400' }
  }

  const totalUsed = blocks.reduce((a, b) => a + b.used, 0)
  const totalSize = blocks.reduce((a, b) => a + b.size, 0)

  if (!mounted) return null

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm">
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-green-400">▦</span>
          <span className="text-white font-mono text-sm">MEMORY MANAGEMENT</span>
        </div>
        <span className="text-white/40 text-xs font-mono">{(totalUsed / 1024).toFixed(1)}GB / {(totalSize / 1024).toFixed(1)}GB</span>
      </div>

      <div className="p-4 font-mono text-xs">
        <div className="mb-4">
          <div className="text-white/40 mb-2">CONSCIOUSNESS RAM ALLOCATION</div>
          <div className="relative h-6 rounded overflow-hidden bg-white/5 border border-white/10">
            {blocks.map((block, i) => {
              const width = (block.used / totalSize) * 100
              const offset = blocks.slice(0, i).reduce((a, b) => a + (b.used / totalSize) * 100, 0)
              return (
                <div key={block.id} className="absolute top-0 bottom-0 transition-all duration-500 cursor-pointer hover:opacity-100" style={{ left: `${offset}%`, width: `${width}%`, background: layerColors[block.layer].fill, opacity: 0.7 }} title={`${block.name}: ${(block.used / 1024).toFixed(2)}GB`} />
              )
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-2 text-xs">
            {Object.entries(layerColors).map(([layer, colors]) => (
              <div key={layer} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ background: colors.fill }} />
                <span className="text-white/60">{layer}.md</span>
              </div>
            ))}
          </div>
        </div>

        <pre className="text-white/20">┌────────────────────────────────────────────────────────────────────────┐
│ TYPE  NAME                           USED      SIZE    %              │
├────────────────────────────────────────────────────────────────────────┤</pre>

        {blocks.map(block => {
          const percentage = (block.used / block.size) * 100
          const barWidth = Math.floor(percentage / 10)
          return (
            <div key={block.id} className="cursor-pointer transition-colors hover:bg-white/5">
              <div className="flex items-center px-2 py-1">
                <span className={`w-10 ${layerColors[block.layer].text}`}>{block.type}</span>
                <span className="w-32 text-white/60 truncate">{block.name}</span>
                <span className="w-16 text-right text-cyan-400">{(block.used / 1024).toFixed(2)}G</span>
                <span className="w-16 text-right text-white/40">{(block.size / 1024).toFixed(2)}G</span>
                <span className="w-16 text-right text-white/60">[{'█'.repeat(barWidth)}{'░'.repeat(10 - barWidth)}]</span>
              </div>
            </div>
          )
        })}

        <pre className="text-white/20">└────────────────────────────────────────────────────────────────────────┘</pre>

        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="text-center p-2 rounded bg-white/5 border border-white/10">
            <div className="text-lg font-bold text-cyan-400">{((totalUsed / totalSize) * 100).toFixed(0)}%</div>
            <div className="text-white/40 text-[10px]">USAGE</div>
          </div>
          <div className="text-center p-2 rounded bg-white/5 border border-white/10">
            <div className="text-lg font-bold text-purple-400">{blocks.length}</div>
            <div className="text-white/40 text-[10px]">BLOCKS</div>
          </div>
          <div className="text-center p-2 rounded bg-white/5 border border-white/10">
            <div className="text-lg font-bold text-green-400">0</div>
            <div className="text-white/40 text-[10px]">LEAKS</div>
          </div>
          <div className="text-center p-2 rounded bg-white/5 border border-white/10">
            <div className="text-lg font-bold text-amber-400">ACTIVE</div>
            <div className="text-white/40 text-[10px]">STATUS</div>
          </div>
        </div>
      </div>
    </div>
  )
}
