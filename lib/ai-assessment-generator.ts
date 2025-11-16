import Bytez from 'bytez.js'

const getBytezClient = () => {
  const apiKey = process.env.BYTEZ_API_KEY
  if (!apiKey) {
    throw new Error('BYTEZ_API_KEY is not configured')
  }
  return new Bytez(apiKey)
}

interface GenerateAssessmentParams {
  topic: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  numberOfQuestions: number
  category: string
}

export async function generateAssessment(params: GenerateAssessmentParams) {
  const { topic, difficulty, numberOfQuestions, category } = params
  const model = getBytezClient().model('openai/gpt-4o-mini')

  const prompt = `You are creating a ${difficulty} level assessment about ${topic}.

Generate ${numberOfQuestions} multiple-choice questions. For EACH question:
1. Write a clear question
2. Provide 4 options
3. IMPORTANT: Put the CORRECT answer as the FIRST option
4. Put 3 incorrect options after it
5. Set correctAnswer to the EXACT TEXT of the correct answer (the first option)
6. Write an explanation

Return ONLY valid JSON (no markdown):

{
  "title": "${topic} Assessment - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}",
  "description": "Test your ${difficulty} level knowledge of ${topic}",
  "questions": [
    {
      "question": "What is 2 + 2?",
      "options": ["4", "3", "5", "6"],
      "correctAnswer": "4",
      "explanation": "2 + 2 equals 4",
      "points": 1
    }
  ]
}

Rules:
- Always put the correct answer as the FIRST option
- correctAnswer must be the EXACT TEXT of the correct answer (copy the first option exactly)
- Each question has exactly 4 options
- Points: 1-2 for beginner, 2-3 for intermediate/advanced
- No trailing commas
- Valid JSON only`

  try {
    const { error, output } = await model.run([
      {
        role: 'system',
        content: 'You are an expert assessment creator. You create high-quality, practical skill assessments. Always respond with valid JSON only, no markdown formatting.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ])

    if (error) {
      console.error('Bytez SDK error:', error)
      throw new Error(`Bytez SDK error: ${error}`)
    }

    if (!output) {
      throw new Error('No output from Bytez SDK')
    }

    console.log('Bytez SDK response:', output)

    // Extract content from the SDK response
    let content: string
    if (typeof output === 'string') {
      content = output
    } else if (output && typeof output === 'object' && 'content' in output) {
      content = (output as any).content
    } else {
      content = JSON.stringify(output)
    }

    // Clean up the response - remove markdown code blocks if present
    content = content.trim()
    content = content.replace(/^```json\s*/i, '')
    content = content.replace(/^```\s*/i, '')
    content = content.replace(/```\s*$/i, '')
    content = content.trim()

    // Log the content for debugging
    console.log('Cleaned content (first 500 chars):', content.substring(0, 500))

    // Parse the JSON with better error handling
    let assessmentData
    try {
      assessmentData = JSON.parse(content)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Content that failed to parse:', content)
      
      // Try to fix common JSON issues
      try {
        // Remove trailing commas
        let fixedContent = content.replace(/,(\s*[}\]])/g, '$1')
        // Fix unescaped quotes in strings
        fixedContent = fixedContent.replace(/([^\\])"([^"]*)"([^:])/g, '$1\\"$2\\"$3')
        assessmentData = JSON.parse(fixedContent)
        console.log('Successfully parsed after fixing JSON')
      } catch (fixError) {
        throw new Error(`Failed to parse AI response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`)
      }
    }

    // Validate the structure
    if (!assessmentData.title || !assessmentData.questions || !Array.isArray(assessmentData.questions)) {
      throw new Error('Invalid assessment structure from AI')
    }

    // Validate each question
    assessmentData.questions.forEach((q: any, index: number) => {
      if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Invalid question structure at index ${index}`)
      }
      if (q.correctAnswer === undefined || q.correctAnswer === null || q.correctAnswer === '') {
        throw new Error(`Missing correct answer at index ${index}`)
      }
      // Ensure correctAnswer is a string
      q.correctAnswer = String(q.correctAnswer)
    })

    // Shuffle options to randomize correct answer position
    const shuffledQuestions = assessmentData.questions.map((q: any) => {
      const options = [...q.options]
      const correctAnswerText = q.correctAnswer
      
      // Verify the correct answer exists in options
      if (!options.includes(correctAnswerText)) {
        console.warn(`Correct answer "${correctAnswerText}" not found in options for question: ${q.question}`)
        // Default to first option if not found
        return {
          question: q.question,
          type: 'multiple-choice',
          options: options,
          correctAnswer: options[0],
          explanation: q.explanation || '',
          points: q.points || 1,
        }
      }
      
      // Shuffle the options array
      const shuffled = options
        .map((option) => ({ option, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(item => item.option)
      
      return {
        question: q.question,
        type: 'multiple-choice',
        options: shuffled,
        correctAnswer: correctAnswerText, // Keep the text, not the index
        explanation: q.explanation || '',
        points: q.points || 1,
      }
    })

    return {
      title: assessmentData.title,
      description: assessmentData.description || `Test your knowledge of ${topic}`,
      category,
      difficulty,
      questions: shuffledQuestions,
    }
  } catch (error) {
    console.error('Error generating assessment:', error)
    throw error
  }
}
