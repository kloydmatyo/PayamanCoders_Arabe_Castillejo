/**
 * JobCard Molecule Component
 * Displays job information in a card format
 */

import React from 'react'
import { Card, Badge, Button } from '@/components/atoms'
import { JobCardProps } from '@/interfaces'

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onApply,
  onView,
  showActions = true,
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

  return (
    <Card variant="default" padding="md" hover={!!onView} onClick={onView}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.company}</p>
          </div>
          <Badge variant={job.status === 'active' ? 'success' : 'default'}>
            {job.status}
          </Badge>
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary" size="sm">{job.type}</Badge>
          <Badge variant="info" size="sm">{job.location}</Badge>
          {job.remote && <Badge variant="success" size="sm">Remote</Badge>}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {job.skills.slice(0, 5).map((skill: string, index: number) => (
              <Badge key={index} variant="default" size="sm">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 5 && (
              <Badge variant="default" size="sm">
                +{job.skills.length - 5} more
              </Badge>
            )}
          </div>
        )}

        {/* Salary */}
        {formatSalary() && (
          <p className="text-sm font-medium text-gray-900">{formatSalary()}</p>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={onView}>
                View Details
              </Button>
            )}
            {onApply && !hasApplied && (
              <Button variant="primary" size="sm" onClick={onApply}>
                Apply Now
              </Button>
            )}
            {hasApplied && (
              <Badge variant="success">Applied</Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
