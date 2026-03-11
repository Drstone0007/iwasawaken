'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface TemperamentResult {
  primary?: string
  secondary?: string
  blend?: Record<string, number>
}

interface EmotionalState {
  mood?: string
  intensity?: number
  stability?: number
  moodSwingRisk?: string
}

interface AnalysisResult {
  temperament?: TemperamentResult
  emotionalState?: EmotionalState
  behavioral?: {
    traits?: string[]
    communicationStyle?: string
    energyLevel?: string
  }
  psychological?: {
    stressIndicators?: string[]
    confidenceLevel?: number
    opennessScore?: number
  }
  ocr?: {
    text?: string
    sentiment?: string
  }
  overall?: {
    consciousnessAlignment?: number
    groundProximityIndex?: number
    encounterClass?: string
  }
  sections?: Record<string, string>
  rawAnalysis?: string
  timestamp?: string
}

const useMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timeout)
  }, [])
  return mounted
}

export default function TemperamentPanel() {
  const mounted = useMounted()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const analyzeImage = useCallback(async (base64: string) => {
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const response = await fetch('/api/temperament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 })
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Analysis failed')
      }
      
      setResult(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      setPreviewUrl(base64)
      analyzeImage(base64)
    }
    reader.readAsDataURL(file)
  }, [analyzeImage])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  // Temperament colors
  const temperamentColors: Record<string, string> = {
    Sanguine: '#f59e0b',
    Choleric: '#ef4444',
    Melancholic: '#6366f1',
    Phlegmatic: '#22c55e',
    Supine: '#ec4899'
  }

  if (!mounted) {
    return (
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl" />
        <div className="relative p-6 animate-pulse">
          <div className="h-8 w-48 bg-white/10 rounded-lg mb-4" />
          <div className="h-32 bg-white/5 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl" />
      
      {/* Animated border glow */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-50"
        style={{
          background: 'linear-gradient(45deg, transparent 40%, rgba(168, 85, 247, 0.3) 50%, transparent 60%)',
          backgroundSize: '200% 200%',
          animation: 'borderGlow 3s ease infinite'
        }}
      />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Temperament Analysis</h3>
            <p className="text-xs text-white/50">VLM-powered emotional intelligence</p>
          </div>
        </div>

        {/* Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
            dragActive ? 'scale-[1.02] border-purple-500/50' : 'border-white/10'
          } ${previewUrl ? 'border-0' : 'border-2 border-dashed'}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
          
          {previewUrl ? (
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
              
              {isAnalyzing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin" />
                    <span className="text-sm text-white/80">Analyzing...</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                <svg className="w-7 h-7 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-sm">Drop image or click to upload</p>
                <p className="text-white/30 text-xs mt-1">PNG, JPG, WEBP supported</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {result && !isAnalyzing && (
          <div className="mt-6 space-y-4">
            {/* Temperament Type */}
            {result.temperament && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-xs text-white/40 uppercase tracking-wider mb-3">Temperament Profile</h4>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                    style={{
                      background: result.temperament.primary 
                        ? `linear-gradient(135deg, ${temperamentColors[result.temperament.primary] || '#a855f7'}40, ${temperamentColors[result.temperament.primary] || '#a855f7'}20)`
                        : '#a855f740'
                    }}
                  >
                    {result.temperament.primary?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{result.temperament.primary || 'Unknown'}</p>
                    {result.temperament.secondary && (
                      <p className="text-white/50 text-sm">Secondary: {result.temperament.secondary}</p>
                    )}
                  </div>
                </div>
                
                {/* Blend Chart */}
                {result.temperament.blend && (
                  <div className="mt-4 space-y-2">
                    {Object.entries(result.temperament.blend).map(([temp, value]) => (
                      <div key={temp} className="flex items-center gap-3">
                        <span className="text-xs text-white/60 w-24">{temp}</span>
                        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${value}%`,
                              background: temperamentColors[temp] || '#a855f7'
                            }}
                          />
                        </div>
                        <span className="text-xs text-white/40 w-10 text-right">{value}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Emotional State */}
            {result.emotionalState && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-xs text-white/40 uppercase tracking-wider mb-3">Emotional State</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 text-xs mb-1">Current Mood</p>
                    <p className="text-white font-medium">{result.emotionalState.mood || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs mb-1">Mood Swing Risk</p>
                    <p className="text-white font-medium">{result.emotionalState.moodSwingRisk || 'Unknown'}</p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 text-xs mb-2">Emotional Intensity</p>
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        style={{ width: `${result.emotionalState.intensity || 0}%` }}
                      />
                    </div>
                    <p className="text-right text-xs text-white/40 mt-1">{result.emotionalState.intensity || 0}%</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs mb-2">Stability Score</p>
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        style={{ width: `${result.emotionalState.stability || 0}%` }}
                      />
                    </div>
                    <p className="text-right text-xs text-white/40 mt-1">{result.emotionalState.stability || 0}%</p>
                  </div>
                </div>
              </div>
            )}

            {/* IWAS Metrics */}
            {result.overall && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/10">
                <h4 className="text-xs text-white/40 uppercase tracking-wider mb-3">IWAS Alignment</h4>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      {result.overall.consciousnessAlignment || 0}
                    </p>
                    <p className="text-xs text-white/40">Consciousness</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                      {result.overall.groundProximityIndex || 0}
                    </p>
                    <p className="text-xs text-white/40">Ground Index</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">
                      {result.overall.encounterClass || 'N/A'}
                    </p>
                    <p className="text-xs text-white/40">Encounter Type</p>
                  </div>
                </div>
              </div>
            )}

            {/* OCR Text */}
            {result.ocr?.text && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-xs text-white/40 uppercase tracking-wider mb-2">Extracted Text</h4>
                <p className="text-white/80 text-sm font-mono">{result.ocr.text}</p>
                {result.ocr.sentiment && (
                  <p className="text-xs text-white/40 mt-2">Sentiment: {result.ocr.sentiment}</p>
                )}
              </div>
            )}

            {/* Raw Analysis Fallback */}
            {result.sections && !result.temperament && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-h-60 overflow-y-auto">
                <h4 className="text-xs text-white/40 uppercase tracking-wider mb-2">Analysis</h4>
                <pre className="text-xs text-white/70 whitespace-pre-wrap">
                  {result.rawAnalysis || JSON.stringify(result.sections, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => {
              setResult(null)
              setPreviewUrl(null)
              setError(null)
            }}
            className="flex-1 py-2 px-4 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            New Analysis
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes borderGlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}
