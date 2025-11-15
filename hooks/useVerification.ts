/**
 * Verification Related Hooks
 * Custom hooks for employer verification operations
 */

import { useCallback } from 'react'
import { RequestService } from '@/services/RequestService'
import { API_ENDPOINTS } from '@/constants/api'
import { useBaseMutation, useBaseQuery } from './useBaseHooks'

export interface VerificationData {
  companyName: string
  companyWebsite: string
  companyEmail: string
  companyPhone: string
  businessRegistration?: File
  proofOfAddress?: File
  additionalDocs?: File[]
}

export interface VerificationStatus {
  status: 'pending' | 'approved' | 'rejected' | 'not_submitted'
  submittedAt?: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
}

/**
 * Hook for submitting verification request
 */
export function useSubmitVerification() {
  const mutation = useBaseMutation<{ success: boolean }, VerificationData>()

  mutation.setMutateFunction(async (data: VerificationData) => {
    const formData = new FormData()
    formData.append('companyName', data.companyName)
    formData.append('companyWebsite', data.companyWebsite)
    formData.append('companyEmail', data.companyEmail)
    formData.append('companyPhone', data.companyPhone)
    
    if (data.businessRegistration) {
      formData.append('businessRegistration', data.businessRegistration)
    }
    if (data.proofOfAddress) {
      formData.append('proofOfAddress', data.proofOfAddress)
    }
    if (data.additionalDocs) {
      data.additionalDocs.forEach((doc) => {
        formData.append('additionalDocs', doc)
      })
    }

    return RequestService.uploadFile('/api/verification/submit', formData)
  })

  const submitVerification = useCallback(async (data: VerificationData) => {
    try {
      const result = await mutation.mutate(data)
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    submitVerification,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for checking verification status
 */
export function useVerificationStatus() {
  const queryFn = useCallback(async () => {
    return RequestService.get<VerificationStatus>('/api/verification/status')
  }, [])

  const query = useBaseQuery(queryFn, {
    enabled: true,
    refetchOnMount: true,
  })

  return {
    status: query.data || null,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for reporting an employer
 */
export function useReportEmployer() {
  const mutation = useBaseMutation<{ success: boolean }, { employerId: string; reason: string; details: string }>()

  mutation.setMutateFunction(async (data) => {
    return RequestService.post('/api/verification/report', data)
  })

  const reportEmployer = useCallback(async (employerId: string, reason: string, details: string) => {
    try {
      const result = await mutation.mutate({ employerId, reason, details })
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    reportEmployer,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}
