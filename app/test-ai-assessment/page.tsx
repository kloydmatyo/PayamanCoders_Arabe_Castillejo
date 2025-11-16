'use client'

import { useState } from 'react'
import { Sparkles, Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function TestAIAssessmentPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testGeneration = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/assessments/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'React Hooks',
          category: 'Programming',
          difficulty: 'intermediate',
          numberOfQuestions: 5
        })
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to generate assessment')
      }
    } catch (err: any) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 AI Assessment Generator Test
          </h1>
          <p className="text-lg text-gray-600">
            Test the AI-powered assessment generation with GPT-4.1
          </p>
        </div>

        <div className="card mb-8">
          <div className="text-center">
            <button
              onClick={testGeneration}
              disabled={loading}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating Assessment...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Test Assessment
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Will generate 5 intermediate-level questions about React Hooks
            </p>
          </div>
        </div>

        {error && (
          <div className="card bg-red-50 border-2 border-red-200 mb-8">
            <div className="flex items-start gap-3">
              <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="card bg-green-50 border-2 border-green-200">
            <div className="flex items-start gap-3 mb-6">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 mb-2">
                  ✅ Assessment Generated Successfully!
                </h3>
                <p className="text-green-700">
                  Generated {result.assessment.questions.length} questions
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {result.assessment.title}
              </h2>
              <p className="text-gray-600 mb-4">{result.assessment.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {result.assessment.category}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                  {result.assessment.difficulty}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {result.assessment.questions.map((q: any, idx: number) => (
                <div key={idx} className="bg-white rounded-lg p-6 border-l-4 border-purple-500">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 flex-1">
                      {idx + 1}. {q.question}
                    </h4>
                    <span className="text-sm text-gray-500 ml-4">
                      {q.points} {q.points === 1 ? 'point' : 'points'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {q.options.map((option: string, optIdx: number) => (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-lg ${
                          q.correctAnswer === optIdx.toString()
                            ? 'bg-green-50 border-2 border-green-300'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span className={q.correctAnswer === optIdx.toString() ? 'text-green-900 font-medium' : 'text-gray-700'}>
                            {option}
                          </span>
                          {q.correctAnswer === optIdx.toString() && (
                            <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {q.explanation && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                      <p className="text-sm text-blue-900">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
