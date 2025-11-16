'use client'

import Link from 'next/link'
import { User } from 'lucide-react'

interface UserProfile {
  _id: string
  firstName: string
  lastName: string
  email: string
  profile: {
    bio?: string
    skills: string[]
    location?: string
    profilePicture?: string
    experience?: string
    education?: string
    availability?: string
    remote?: boolean
  }
}

interface ProfileCardProps {
  userProfile: UserProfile | null
}

export default function ProfileCard({ userProfile }: ProfileCardProps) {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6 animate-[floatUp_0.85s_ease-out]">
        <h2 className="feature-heading text-xl font-semibold">
          Your Profile
        </h2>
        <Link
          href="/profile"
          className="auth-link text-sm font-medium"
        >
          Edit Profile
        </Link>
      </div>
      
      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary-500/20 to-primary-500/5 text-primary-600 shadow-inner shadow-primary-900/10">
            {userProfile?.profile?.profilePicture ? (
              <img
                src={userProfile.profile.profilePicture}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <User className="h-8 w-8" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {userProfile?.firstName} {userProfile?.lastName}
            </h3>
            <p className="text-sm text-secondary-600">{userProfile?.email}</p>
          </div>
        </div>

        {/* About */}
        {userProfile?.profile?.bio && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-secondary-600">
              About
            </h4>
            <p className="text-sm text-secondary-700 leading-relaxed">
              {userProfile.profile.bio}
            </p>
          </div>
        )}

        {/* Experience */}
        {userProfile?.profile?.experience && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-secondary-600">
              Experience
            </h4>
            <p className="text-sm text-secondary-700">
              {userProfile.profile.experience}
            </p>
          </div>
        )}

        {/* Education */}
        {userProfile?.profile?.education && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-secondary-600">
              Education
            </h4>
            <p className="text-sm text-secondary-700">
              {userProfile.profile.education}
            </p>
          </div>
        )}

        {/* Skills & Interests */}
        {userProfile?.profile?.skills && userProfile.profile.skills.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-secondary-600">
              Skills & Interests
            </h4>
            <div className="flex flex-wrap gap-2">
              {userProfile.profile.skills
                .slice(0, 6)
                .map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border text-primary-600 bg-primary-500/20 border-primary-500/30 shadow-inner shadow-primary-700/20"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!userProfile?.profile?.bio && 
         !userProfile?.profile?.experience && 
         !userProfile?.profile?.education && 
         (!userProfile?.profile?.skills || userProfile.profile.skills.length === 0) && (
          <div className="text-center py-6">
            <p className="text-sm text-secondary-500 mb-4">
              Complete your profile to showcase your background
            </p>
            <Link
              href="/profile"
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              Complete Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
