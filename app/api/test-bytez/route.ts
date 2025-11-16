import { NextResponse } from 'next/server'

export async function GET() {
  const BYTEZ_API_KEY = process.env.BYTEZ_API_KEY

  if (!BYTEZ_API_KEY) {
    return NextResponse.json(
      { error: 'BYTEZ_API_KEY not configured' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch('https://api.bytez.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BYTEZ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: 'Say "Hello, Bytez API is working!" in JSON format: {"message": "your response"}',
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { 
          error: 'Bytez API error',
          status: response.status,
          details: errorText
        },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      message: 'Bytez API is working!',
      response: data
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to connect to Bytez API',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
