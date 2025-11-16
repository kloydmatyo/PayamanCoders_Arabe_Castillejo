'use client'

import { CheckCircle, Eye, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface JobCreatedModalProps {
  isOpen: boolean
  jobId: string
  jobTitle: string
}

export default function JobCreatedModal({ isOpen, jobId, jobTitle }: JobCreatedModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleViewJob = () => {
    router.push(`/jobs/${jobId}`)
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/40 animate-[floatUp_0.5s_ease-out]">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-primary-500/10 rounded-3xl pointer-events-none"></div>
        
        <div className="relative">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-full p-4 shadow-lg shadow-green-500/40">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-green-600 via-green-500 to-primary-600 bg-clip-text text-transparent">
            Job Posted Successfully!
          </h2>

          {/* Message */}
          <p className="text-center text-secondary-600 mb-2 text-lg">
            Your job posting for
          </p>
          <p className="text-center font-semibold text-primary-600 mb-6 text-xl">
            "{jobTitle}"
          </p>
          <p className="text-center text-secondary-600 mb-8">
            has been published and is now visible to candidates.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleViewJob}
              className="w-full btn-primary py-4 text-lg font-semibold group/btn inline-flex items-center justify-center gap-3"
            >
              <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
              <span>View Job Posting</span>
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full btn-secondary py-4 text-lg font-semibold group/btn inline-flex items-center justify-center gap-3"
            >
              <Home className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
              <span>Go to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
