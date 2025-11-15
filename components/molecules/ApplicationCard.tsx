/**
 * ApplicationCard Molecule Component
 * Displays application information in a card format
 */

import React from 'react'
import { Card, Badge, Button } from '@/components/atoms'
import { ApplicationCardProps } from '@/interfaces'

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onView,
  onUpdateStatus,
  showActions = true,
  viewMode = 'applicant',
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'success'
      case 'rejected':
        return 'danger'
      case 'reviewed':
        return 'info'
      default:
        return 'warning'
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card variant="default" padding="md" hover={!!onView}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {application.job?.title || 'Job Title'}
            </h3>
            <p className="text-sm text-gray-600">
              {application.job?.company || 'Company Name'}
            </p>
          </div>
          <Badge variant={getStatusVariant(application.status)}>
            {application.status}
          </Badge>
        </div>

        {/* Applicant Info (for employer view) */}
        {viewMode === 'employer' && application.applicant && (
          <div className="text-sm text-gray-700">
            <p className="font-medium">
              {application.applicant.firstName} {application.applicant.lastName}
            </p>
            <p className="text-gray-600">{application.applicant.email}</p>
          </div>
        )}

        {/* Job Details (for applicant view) */}
        {viewMode === 'applicant' && application.job && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary" size="sm">{application.job.type}</Badge>
            <Badge variant="info" size="sm">{application.job.location}</Badge>
            {application.job.remote && (
              <Badge variant="success" size="sm">Remote</Badge>
            )}
          </div>
        )}

        {/* Application Date */}
        <p className="text-sm text-gray-600">
          Applied on {formatDate(application.createdAt)}
        </p>

        {/* Cover Letter Preview */}
        {application.coverLetter && (
          <p className="text-sm text-gray-700 line-clamp-2">
            {application.coverLetter}
          </p>
        )}

        {/* Feedback */}
        {application.feedback?.notes && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">Feedback:</p>
            <p className="text-sm text-gray-700">{application.feedback.notes}</p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(application)}>
                View Details
              </Button>
            )}
            {onUpdateStatus && viewMode === 'employer' && (
              <>
                {application.status === 'pending' && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => onUpdateStatus(application._id || '', 'reviewed')}
                    >
                      Review
                    </Button>
                  </>
                )}
                {application.status === 'reviewed' && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => onUpdateStatus(application._id || '', 'accepted')}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onUpdateStatus(application._id || '', 'rejected')}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
