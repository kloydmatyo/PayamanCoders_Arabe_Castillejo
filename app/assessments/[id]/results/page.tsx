'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Award, CheckCircle, XCircle, Clock, Download } from 'lucide-react'

export default function AssessmentResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const data = searchParams.get('data')
    if (data) {
      try {
        setResult(JSON.parse(decodeURIComponent(data)))
      } catch (error) {
        console.error('Failed to parse result data:', error)
        router.push('/assessments')
      }
    }
  }, [searchParams])

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Result Header */}
        <div className={`rounded-lg shadow p-8 mb-6 ${
          result.passed ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'
        }`}>
          <div className="text-center">
            {result.passed ? (
              <Award className="w-20 h-20 text-green-600 mx-auto mb-4" />
            ) : (
              <Clock className="w-20 h-20 text-yellow-600 mx-auto mb-4" />
            )}
            <h1 className={`text-3xl font-bold mb-2 ${result.passed ? 'text-green-900' : 'text-yellow-900'}`}>
              {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h1>
            <p className={`text-lg ${result.passed ? 'text-green-700' : 'text-yellow-700'}`}>
              {result.passed 
                ? 'You passed the assessment and earned a certificate!' 
                : 'You didn\'t pass this time, but you can try again.'}
            </p>
          </div>
        </div>

        {/* Score Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Score</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{result.score}%</p>
              <p className="text-sm text-gray-600 mt-1">Final Score</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{result.correctAnswers}</p>
              <p className="text-sm text-gray-600 mt-1">Correct</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">{result.totalQuestions - result.correctAnswers}</p>
              <p className="text-sm text-gray-600 mt-1">Incorrect</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-600">{Math.floor(result.timeSpent / 60)}m</p>
              <p className="text-sm text-gray-600 mt-1">Time Taken</p>
            </div>
          </div>
        </div>

        {/* Certificate */}
        {result.certificate && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg shadow p-6 mb-6">
            <div className="flex items-center gap-4">
              <Award className="w-12 h-12 text-blue-600" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Certificate Earned!</h3>
                <p className="text-sm text-gray-600">Certificate ID: {result.certificate.id}</p>
                <a 
                  href={result.certificate.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Verify Certificate →
                </a>
              </div>
              <Link
                href="/certificates"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                View Certificate
              </Link>
            </div>
          </div>
        )}

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Results</h2>
          <div className="space-y-4">
            {result.gradedAnswers?.map((answer: any, idx: number) => (
              <div key={idx} className={`border-l-4 p-4 rounded ${
                answer.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}>
                <div className="flex items-start gap-3">
                  {answer.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">Q{idx + 1}: {answer.question}</p>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Your Answer:</span>{' '}
                        <span className={answer.isCorrect ? 'text-green-700' : 'text-red-700'}>
                          {Array.isArray(answer.userAnswer) ? answer.userAnswer.join(', ') : answer.userAnswer || 'Not answered'}
                        </span>
                      </p>
                      {!answer.isCorrect && (
                        <p>
                          <span className="font-medium">Correct Answer:</span>{' '}
                          <span className="text-green-700">
                            {Array.isArray(answer.correctAnswer) ? answer.correctAnswer.join(', ') : answer.correctAnswer}
                          </span>
                        </p>
                      )}
                      {answer.explanation && (
                        <p className="mt-2 text-gray-600">
                          <span className="font-medium">Explanation:</span> {answer.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/assessments"
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-center"
          >
            Back to Assessments
          </Link>
          {!result.passed && (
            <button
              onClick={() => router.push(`/assessments/${searchParams.get('id')}`)}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
