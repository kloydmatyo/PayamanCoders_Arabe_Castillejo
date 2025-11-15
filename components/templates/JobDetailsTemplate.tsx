/**
 * JobDetailsTemplate Component
 * Template for displaying job details
 */

import React from 'react'
import { Card, Badge, Button } from '@/components/atoms'
import { JobDetailsTemplateProps } from '@/interfaces'

export const JobDetailsTemplate: React.FC<JobDetailsTemplateProps> = ({
  job,
  onApply,
  onBack,
  hasApplied = false,
}) => {
  const formatSalary = () => {
    if (!job.salary?.min && !job.salary?.max) return null
    const currency = job.salary?.currency || 'USD'
    const period = job.salary?.period || 'yearly'
    
    if (job.salary?.min && job.salary?.max) {
      return `${currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} / ${period}`
    }
    return `${currency} ${(job.salary?.min || job.salary?.max)?.toLocaleString()} / ${period}`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back to Jobs
        </Button>
      )}

      {/* Header Card */}
      <Card variant="elevated" padding="lg">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-gray-700">{job.company}</p>
            </div>
            <Badge variant={job.status === 'active' ? 'success' : 'default'} size="lg">
              {job.status}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge variant="primary">{job.type}</Badge>
            <Badge variant="info">{job.location}</Badge>
            {job.remote && <Badge variant="success">Remote</Badge>}
          </div>

          {formatSalary() && (
            <p className="text-lg font-semibold text-gray-900">{formatSalary()}</p>
          )}

          {onApply && (
            <div className="pt-4">
              {hasApplied ? (
                <Badge variant="success" size="lg">
                  ✓ Already Applied
                </Badge>
              ) : (
                <Button variant="primary" size="lg" onClick={onApply}>
                  Apply for this Position
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Description */}
      <Card variant="default" padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
        <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
          {job.description}
        </div>
      </Card>

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <Card variant="default" padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Responsibilities */}
      {job.responsibilities && job.responsibilities.length > 0 && (
        <Card variant="default" padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {job.responsibilities.map((resp, index) => (
              <li key={index}>{resp}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <Card variant="default" padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <Badge key={index} variant="primary">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Additional Info */}
      <Card variant="default" padding="lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
        <div className="space-y-2 text-gray-700">
          {job.experience && (
            <p>
              <span className="font-medium">Experience Level:</span> {job.experience}
            </p>
          )}
          {job.deadline && (
            <p>
              <span className="font-medium">Application Deadline:</span>{' '}
              {formatDate(job.deadline)}
            </p>
          )}
          <p>
            <span className="font-medium">Posted:</span> {formatDate(job.createdAt)}
          </p>
          {job.applicantCount !== undefined && (
            <p>
              <span className="font-medium">Applicants:</span> {job.applicantCount}
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
