import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageBase64, imageUrl, prompt } = body

    const zai = await ZAI.create()

    // Build the content array with proper typing
    type ContentItem = 
      | { type: 'text'; text: string }
      | { type: 'image_url'; image_url: { url: string } }
    
    const content: ContentItem[] = [
      {
        type: 'text',
        text: prompt || `Analyze this image for temperament and emotional indicators. 

Please provide a detailed analysis including:

1. **TEMPERAMENT ANALYSIS**
   - Primary temperament type (Sanguine, Choleric, Melancholic, Phlegmatic, or Supine)
   - Secondary temperament influences
   - Temperament blend percentage breakdown

2. **EMOTIONAL STATE INDICATORS**
   - Current mood assessment
   - Emotional intensity level (0-100)
   - Mood swing potential/risk
   - Emotional stability score

3. **BEHAVIORAL PATTERNS**
   - Visible personality traits
   - Communication style indicators
   - Social interaction patterns
   - Energy level assessment

4. **PSYCHOLOGICAL MARKERS**
   - Stress indicators
   - Confidence level
   - Openness/closedness
   - Authenticity indicators

5. **OCR TEXT EXTRACTION** (if any text is present)
   - Extract all visible text
   - Analyze text sentiment
   - Note any significant words or phrases

6. **OVERALL ASSESSMENT**
   - Consciousness alignment score (0-100)
   - Ground proximity index
   - IWAS encounter classification recommendation

Format your response as a structured JSON object with these categories.`
      }
    ]

    // Add image source
    if (imageBase64) {
      content.push({
        type: 'image_url',
        image_url: { url: imageBase64 }
      })
    } else if (imageUrl) {
      content.push({
        type: 'image_url',
        image_url: { url: imageUrl }
      })
    } else {
      return NextResponse.json(
        { error: 'Either imageBase64 or imageUrl is required' },
        { status: 400 }
      )
    }

    const response = await zai.chat.completions.createVision({
      model: 'default',
      messages: [
        {
          role: 'user',
          content: content
        }
      ],
      thinking: { type: 'disabled' }
    })

    const analysisText = response.choices[0]?.message?.content || ''

    // Try to parse as JSON, otherwise return as structured text
    let analysisResult
    try {
      // Extract JSON if wrapped in markdown code blocks
      const jsonMatch = analysisText.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[1])
      } else {
        analysisResult = JSON.parse(analysisText)
      }
    } catch {
      // Parse text into structured format
      analysisResult = parseTextAnalysis(analysisText)
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      rawText: analysisText
    })

  } catch (error) {
    console.error('Temperament analysis error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Analysis failed' 
      },
      { status: 500 }
    )
  }
}

function parseTextAnalysis(text: string) {
  const sections = {
    temperament: extractSection(text, 'TEMPERAMENT'),
    emotionalState: extractSection(text, 'EMOTIONAL'),
    behavioral: extractSection(text, 'BEHAVIORAL'),
    psychological: extractSection(text, 'PSYCHOLOGICAL'),
    ocr: extractSection(text, 'OCR'),
    overall: extractSection(text, 'OVERALL')
  }

  return {
    timestamp: new Date().toISOString(),
    sections,
    rawAnalysis: text
  }
}

function extractSection(text: string, keyword: string): string {
  const regex = new RegExp(`\\*\\*${keyword}[^*]*\\*\\*([\\s\\S]*?)(?=\\*\\*[A-Z]|$)`, 'i')
  const match = text.match(regex)
  return match ? match[1].trim() : ''
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/temperament',
    methods: ['POST'],
    description: 'Analyze images for temperament, mood, and emotional indicators using VLM',
    parameters: {
      imageBase64: 'Base64 encoded image string (with data URI prefix)',
      imageUrl: 'URL to an image',
      prompt: 'Optional custom analysis prompt'
    }
  })
}
