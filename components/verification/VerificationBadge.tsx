'use client'

interface VerificationBadgeProps {
  status: 'unverified' | 'pending' | 'verified' | 'rejected' | 'suspended'
  trustScore?: number
  size?: 'sm' | 'md' | 'lg'
  showScore?: boolean
}

export default function VerificationBadge({ 
  status, 
  trustScore = 0, 
  size = 'md',
  showScore = false 
}: VerificationBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  }

  const statusConfig = {
    verified: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      icon: '✓',
      label: 'Verified'
    },
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      icon: '⏳',
      label: 'Pending'
    },
    unverified: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-300',
      icon: '○',
      label: 'Unverified'
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      icon: '✗',
      label: 'Rejected'
    },
    suspended: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      icon: '⊘',
      label: 'Suspended'
    }
  }

  const config = statusConfig[status]

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeClasses[size]} ${config.bg} ${config.text} ${config.border}`}
      >
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </span>
      {showScore && status === 'verified' && (
        <span className="text-sm text-gray-600">
          Trust Score: <span className="font-semibold">{trustScore}/100</span>
        </span>
      )}
    </div>
  )
}
