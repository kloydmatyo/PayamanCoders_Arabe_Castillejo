'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Save, Sparkles, Loader2 } from 'lucide-react'

export default function CreateAssessmentPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiFormData, setAiFormData] = useState({
    topic: '',
    category: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    numberOfQuestions: 10
  })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical',
    difficulty: 'beginner',
    duration: 30,
    passingScore: 70,
    skills: '',
    questions: [
      {
        id: '1',
        type: 'mcq',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        points: 1
      }
    ]
  })

  const generateWithAI = async () => {
    if (!aiFormData.topic || !aiFormData.category) {
      alert('Please fill in topic and category for AI generation')
      return
    }

    try {
      setAiGenerating(true)
      const response = await fetch('/api/assessments/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiFormData)
      })

      if (response.ok) {
        const data = await response.json()
        const aiAssessment = data.assessment
        
        // Populate the form with AI-generated data
        setFormData({
          title: aiAssessment.title,
          description: aiAssessment.description,
          category: aiFormData.category,
          difficulty: aiAssessment.difficulty,
          duration: Math.max(30, aiAssessment.questions.length * 2),
          passingScore: 70,
          skills: aiFormData.topic,
          questions: aiAssessment.questions.map((q: any, idx: number) => ({
            id: String(idx + 1),
            type: 'mcq',
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            points: q.points || 1,
            explanation: q.explanation || ''
          }))
        })
        
        alert(`✨ AI generated ${aiAssessment.questions.length} questions successfully!`)
      } else {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        alert(`Failed to generate assessment: ${errorData.error || 'Unknown error'}\n${errorData.details || ''}`)
      }
    } catch (error) {
      console.error('Error generating assessment:', error)
      alert(`Failed to generate assessment with AI: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setAiGenerating(false)
    }
  }

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          id: String(formData.questions.length + 1),
          type: 'mcq',
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          explanation: '',
          points: 1
        }
      ]
    })
  }

  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    })
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...formData.questions]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, questions: updated })
  }

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...formData.questions]
    updated[qIndex].options[oIndex] = value
    setFormData({ ...formData, questions: updated })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        })
      })

      if (response.ok) {
        alert('Assessment created successfully!')
        router.push('/admin/assessments')
      } else {
        alert('Failed to create assessment')
      }
    } catch (error) {
      alert('Error creating assessment')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Assessment</h1>
          <p className="mt-2 text-gray-600">Design a new skill assessment</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* AI Generation Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">AI Assessment Generator</h2>
              </div>
              <p className="text-sm text-gray-600">Let AI create high-quality, practical questions using GPT-4.1</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic *
                </label>
                <input
                  type="text"
                  value={aiFormData.topic}
                  onChange={(e) => setAiFormData({ ...aiFormData, topic: e.target.value })}
                  placeholder="e.g., React Hooks, Python Data Structures, Digital Marketing"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={aiFormData.category}
                  onChange={(e) => setAiFormData({ ...aiFormData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={aiFormData.difficulty}
                  onChange={(e) => setAiFormData({ ...aiFormData, difficulty: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={aiFormData.numberOfQuestions}
                  onChange={(e) => {
                    const val = e.target.value
                    setAiFormData({ 
                      ...aiFormData, 
                      numberOfQuestions: val === '' ? 0 : Math.max(1, Math.min(20, parseInt(val) || 1))
                    })
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '' || parseInt(e.target.value) < 1) {
                      setAiFormData({ ...aiFormData, numberOfQuestions: 1 })
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={generateWithAI}
              disabled={aiGenerating || !aiFormData.topic || !aiFormData.category}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {aiGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate Assessment with AI
                </>
              )}
            </button>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <p className="text-sm text-gray-600 mb-4">Review and edit AI-generated content, or fill in manually</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., JavaScript Fundamentals"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Brief description of the assessment"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="technical">Technical</option>
                    <option value="soft_skills">Soft Skills</option>
                    <option value="industry_specific">Industry Specific</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min="5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passing Score (%) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="JavaScript, React, Node.js"
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>

            <div className="space-y-6">
              {formData.questions.map((question, qIndex) => (
                <div key={qIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Question {qIndex + 1}</h3>
                    {formData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Text *
                      </label>
                      <textarea
                        required
                        value={question.question}
                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="mcq">Multiple Choice</option>
                          <option value="multiple_select">Multiple Select</option>
                          <option value="short_answer">Short Answer</option>
                          <option value="scenario">Scenario</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Points
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={question.points}
                          onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    {(question.type === 'mcq' || question.type === 'multiple_select') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Options
                        </label>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <input
                              key={oIndex}
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder={`Option ${oIndex + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correct Answer *
                      </label>
                      <input
                        type="text"
                        required
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter the correct answer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Explanation
                      </label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Explain why this is the correct answer"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Creating...' : 'Create Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
