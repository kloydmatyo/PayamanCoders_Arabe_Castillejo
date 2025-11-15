'use client'

import { useState, useEffect } from 'react'
import { X, Award, BookOpen, Target, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

const SKILL_SUGGESTIONS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java',
  'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'HTML/CSS',
  'Communication', 'Leadership', 'Problem Solving', 'Teamwork',
  'Project Management', 'Data Analysis', 'UI/UX Design', 'Marketing'
]

export default function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [customSkill, setCustomSkill] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    console.log('🎭 OnboardingModal render - isOpen:', isOpen);
  }, [isOpen]);

  if (!isOpen) return null

  const steps = [
    {
      title: 'Welcome to WorkQit! 🎉',
      description: 'Let\'s get you started with a quick setup to personalize your experience.',
      icon: Target,
      content: (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome aboard!</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We'll help you set up your profile in just 3 quick steps. This will help us match you with the best opportunities.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-blue-50 rounded-lg p-4">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Add Skills</p>
              <p className="text-xs text-gray-600 mt-1">Tell us what you know</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Take Assessment</p>
              <p className="text-xs text-gray-600 mt-1">Validate your skills</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Earn Certificate</p>
              <p className="text-xs text-gray-600 mt-1">Boost your profile</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Add Your Skills',
      description: 'Select the skills you have or add custom ones. This helps us match you with relevant opportunities.',
      icon: BookOpen,
      content: (
        <div className="py-4">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select your skills (choose as many as you like):
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {SKILL_SUGGESTIONS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => {
                    if (selectedSkills.includes(skill)) {
                      setSelectedSkills(selectedSkills.filter(s => s !== skill))
                    } else {
                      setSelectedSkills([...selectedSkills, skill])
                    }
                  }}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSkills.includes(skill)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                  {selectedSkills.includes(skill) && (
                    <Check className="w-4 h-4 inline ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a custom skill:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && customSkill.trim()) {
                    if (!selectedSkills.includes(customSkill.trim())) {
                      setSelectedSkills([...selectedSkills, customSkill.trim()])
                    }
                    setCustomSkill('')
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a skill and press Enter"
              />
              <button
                onClick={() => {
                  if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
                    setSelectedSkills([...selectedSkills, customSkill.trim()])
                    setCustomSkill('')
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          {selectedSkills.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">
                Selected Skills ({selectedSkills.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}
                      className="hover:text-blue-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Take Your First Assessment',
      description: 'Validate your skills by taking a quick assessment and earn your first certificate!',
      icon: Award,
      content: (
        <div className="text-center py-8">
          <Award className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to showcase your skills?</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Take a skill assessment to validate your expertise and earn a certificate that you can share with employers.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 max-w-md mx-auto">
            <h4 className="font-semibold text-gray-900 mb-3">Benefits of taking assessments:</h4>
            <ul className="text-sm text-gray-700 space-y-2 text-left">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Earn verifiable certificates</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Stand out to employers</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Identify skill gaps</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Track your progress</span>
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ]

  const handleNext = async () => {
    if (currentStep === 1 && selectedSkills.length > 0) {
      // Save skills
      setSaving(true)
      try {
        await fetch('/api/onboarding/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            step: currentStep,
            action: 'complete_step',
            data: { skills: selectedSkills }
          })
        })
      } catch (error) {
        console.error('Failed to save skills:', error)
      } finally {
        setSaving(false)
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = async () => {
    try {
      await fetch('/api/onboarding/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: currentStep,
          action: 'skip_step'
        })
      })
    } catch (error) {
      console.error('Failed to skip step:', error)
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    try {
      await fetch('/api/onboarding/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete_onboarding'
        })
      })
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
    }
    onComplete()
    onClose()
  }

  const step = steps[currentStep]
  const Icon = step.icon

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{step.title}</h2>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  idx <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {step.content}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            {currentStep === steps.length - 1 ? 'Maybe Later' : 'Skip'}
          </button>
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
            )}
            {currentStep === steps.length - 1 ? (
              <Link
                href="/assessments"
                onClick={handleComplete}
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
              >
                Browse Assessments
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={handleNext}
                disabled={saving || (currentStep === 1 && selectedSkills.length === 0)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? 'Saving...' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
