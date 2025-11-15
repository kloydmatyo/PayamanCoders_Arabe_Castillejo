'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Award, AlertCircle } from 'lucide-react'

export default function TakeAssessmentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [started, setStarted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)

  useEffect(() => {
    fetchAssessment()
  }, [params.id])

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [started, timeLeft])

  const fetchAssessment = async () => {
    try {
      const response = await fetch(`/api/assessments/${params.id}/take`)
      if (response.ok) {
        const data = await response.json()
        setAssessment(data.assessment)
        setTimeLeft(data.assessment.duration * 60)
      }
    } catch (error) {
      console.error('Failed to fetch assessment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStart = () => {
    setStarted(true)
    setStartTime(Date.now())
  }

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = async () => {
    if (submitting) return
    
    setSubmitting(true)
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    
    try {
      const response = await fetch(`/api/assessments/${params.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, timeSpent })
      })
      
      if (response.ok) {
        const data = await response.json()
        router.push(`/assessments/${params.id}/results?data=${encodeURIComponent(JSON.stringify(data.result))}`)
      }
    } catch (error) {
      console.error('Failed to submit assessment:', error)
      alert('Failed to submit assessment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Assessment not found</p>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{assessment.title}</h1>
            <p className="text-gray-600 mb-6">{assessment.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Duration</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{assessment.duration} min</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Award className="w-5 h-5" />
                  <span className="font-medium">Passing Score</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{assessment.passingScore}%</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>You have {assessment.duration} minutes to complete this assessment</li>
                <li>Answer all {assessment.questions.length} questions</li>
                <li>You need {assessment.passingScore}% to pass and earn a certificate</li>
                <li>Once started, the timer cannot be paused</li>
                <li>Review your answers before submitting</li>
              </ul>
            </div>

            <button
              onClick={handleStart}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-lg"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    )
  }

  const question = assessment.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {assessment.questions.length}
            </span>
            <div className="flex items-center gap-2 text-red-600 font-semibold">
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h2>
          
          {question.type === 'mcq' && (
            <div className="space-y-3">
              {question.options?.map((option: string, idx: number) => (
                <label
                  key={idx}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    answers[question.id] === option
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    className="mr-3"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {question.type === 'multiple_select' && (
            <div className="space-y-3">
              {question.options?.map((option: string, idx: number) => (
                <label
                  key={idx}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    answers[question.id]?.includes(option)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={answers[question.id]?.includes(option) || false}
                    onChange={(e) => {
                      const current = answers[question.id] || []
                      const updated = e.target.checked
                        ? [...current, option]
                        : current.filter((o: string) => o !== option)
                      handleAnswer(question.id, updated)
                    }}
                    className="mr-3"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {(question.type === 'short_answer' || question.type === 'scenario') && (
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none"
              placeholder="Type your answer here..."
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentQuestion < assessment.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
