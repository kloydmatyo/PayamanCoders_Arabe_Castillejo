'use client'

import { useState, useEffect } from 'react'
import { Award, TrendingUp, AlertCircle, CheckCircle, XCircle, RefreshCw, ChevronDown, Video, Users, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface ScoreData {
  totalScore: number
  breakdown: {
    profileCompleteness: number
    webinarActivity: number
    mentorshipEngagement: number
    platformContribution: number
    accountQuality: number
  }
  tier: 'beginner' | 'active' | 'experienced' | 'expert' | 'master'
  missingItems: string[]
  recommendations: string[]
}

export default function MentorScoreCard() {
  const [score, setScore] = useState<ScoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchScore()
  }, [])

  const fetchScore = async () => {
    try {
      setError('')
      const response = await fetch('/api/mentor/score')
      if (response.ok) {
        const data = await response.json()
        setScore(data.score)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to load score')
      }
    } catch (error) {
      console.error('Failed to fetch score:', error)
      setError('Failed to load score')
    } finally {
      setLoading(false)
    }
  }

  const refreshScore = async () => {
    try {
      setRefreshing(true)
      setError('')
      const response = await fetch('/api/mentor/score', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        setScore(data.score)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to refresh score')
      }
    } catch (error) {
      console.error('Failed to refresh score:', error)
      setError('Failed to refresh score')
    } finally {
      setRefreshing(false)
    }
  }

  const getTierConfig = (tier: string) => {
    switch (tier) {
      case 'master':
        return {
          color: 'from-purple-500 to-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-700',
          icon: <Award className="w-6 h-6" />,
          label: 'Master Mentor',
          description: 'You are an exceptional mentor with outstanding impact'
        }
      case 'expert':
        return {
          color: 'from-blue-500 to-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700',
          icon: <CheckCircle className="w-6 h-6" />,
          label: 'Expert Mentor',
          description: 'You are a highly experienced and trusted mentor'
        }
      case 'experienced':
        return {
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          icon: <CheckCircle className="w-6 h-6" />,
          label: 'Experienced Mentor',
          description: 'You have solid mentoring experience and good engagement'
        }
      case 'active':
        return {
          color: 'from-yellow-500 to-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-700',
          icon: <TrendingUp className="w-6 h-6" />,
          label: 'Active Mentor',
          description: 'You are building your mentoring presence'
        }
      default:
        return {
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-700',
          icon: <AlertCircle className="w-6 h-6" />,
          label: 'Beginner Mentor',
          description: 'Complete your profile to start your mentoring journey'
        }
    }
  }

  if (loading) {
    return (
      <div className="card relative overflow-hidden animate-pulse">
        <div className="p-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card relative overflow-hidden border-2 border-red-200 bg-red-50">
        <div className="p-8">
          <div className="flex items-center gap-3 text-red-700 mb-4">
            <AlertCircle className="w-6 h-6" />
            <p className="font-semibold">{error}</p>
          </div>
          <button
            onClick={fetchScore}
            className="btn-secondary text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!score) {
    return null
  }

  const config = getTierConfig(score.tier)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 group">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" aria-hidden="true"></div>
      
      {/* Collapsed Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full relative overflow-hidden transition-all duration-500 ease-out ${
          isExpanded ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
        
        <div className={`relative z-10 p-5 transition-all duration-500 ${isExpanded ? 'pb-3' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Score Badge */}
              <div className={`relative flex h-14 w-14 items-center justify-center rounded-xl shadow-lg transition-all duration-500 ${
                isExpanded 
                  ? 'bg-white/20 backdrop-blur-sm border border-white/30' 
                  : 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30'
              }`}>
                <Award className={`w-7 h-7 transition-colors duration-500 ${isExpanded ? 'text-white' : 'text-purple-600'}`} />
                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs font-bold shadow-lg">
                  {Math.round(score.totalScore)}
                </div>
              </div>
              
              {/* Title & Score */}
              <div className="text-left">
                <h2 className={`text-xl font-bold mb-1 transition-colors duration-500 ${
                  isExpanded ? 'text-white' : 'text-gray-900'
                }`}>
                  Mentor Profile Score
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold transition-colors duration-500 ${
                    isExpanded ? 'text-white' : 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'
                  }`}>
                    {score.totalScore.toFixed(1)}
                  </span>
                  <span className={`text-sm font-medium transition-colors duration-500 ${
                    isExpanded ? 'text-white/80' : 'text-secondary-600'
                  }`}>
                    / 100
                  </span>
                  <span className={`ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-500 ${
                    isExpanded 
                      ? 'bg-white/20 text-white border border-white/30' 
                      : `${config.bgColor} ${config.textColor} border ${config.borderColor}`
                  }`}>
                    {config.icon}
                    {config.label}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Expand Button */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className={`text-xs font-medium transition-colors duration-500 ${
                  isExpanded ? 'text-white/90' : 'text-secondary-600'
                }`}>
                  {isExpanded ? 'Hide details' : 'View details'}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-500 ${
                isExpanded 
                  ? 'bg-white/20 border border-white/30' 
                  : 'bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500/20'
              }`}>
                <ChevronDown 
                  className={`w-5 h-5 transition-all duration-500 ease-out ${
                    isExpanded ? 'rotate-180 text-white' : 'rotate-0 text-purple-600'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      <div 
        className={`transition-all duration-700 ease-out ${
          isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          transitionProperty: 'max-height, opacity',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Content - White Background */}
        <div className="p-6 bg-white relative z-10 space-y-6">
          {/* Refresh Button */}
          <div className="flex justify-end animate-[floatUp_0.6s_ease-out_0.1s_both]">
            <button
              onClick={(e) => {
                e.stopPropagation()
                refreshScore()
              }}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/60 hover:bg-white border border-purple-500/40 text-purple-600 font-semibold text-sm transition-all duration-300 hover:shadow-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Updating...' : 'Refresh Score'}
            </button>
          </div>

        {/* Score Breakdown */}
        <div className="mb-6 animate-[floatUp_0.6s_ease-out_0.2s_both]">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowDetails(!showDetails)
            }}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <span className="text-sm font-bold text-gray-900">Score Breakdown</span>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                showDetails ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {showDetails && (
            <div className="space-y-3 animate-[floatUp_0.3s_ease-out]">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/60">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{score.breakdown.profileCompleteness}/25</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/60">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Webinar Activity</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{score.breakdown.webinarActivity}/25</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/60">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Mentorship Engagement</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{score.breakdown.mentorshipEngagement}/25</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/60">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">Platform Contribution</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{score.breakdown.platformContribution}/15</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/60">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Account Quality</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{score.breakdown.accountQuality}/10</span>
              </div>
            </div>
          )}
        </div>

        {/* Missing Items */}
        {score.missingItems.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-yellow-900 mb-2">To Improve Your Score</h4>
                <ul className="space-y-1">
                  {score.missingItems.map((item, index) => (
                    <li key={index} className="text-sm text-yellow-800">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {score.recommendations.length > 0 && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 animate-[floatUp_0.6s_ease-out_0.4s_both]">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-blue-900 mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {score.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-blue-800">• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
