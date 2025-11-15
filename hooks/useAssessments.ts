/**
 * Assessment Related Hooks
 * Custom hooks for assessment operations
 */

import { useCallback } from 'react'
import { RequestService } from '@/services/RequestService'
import { API_ENDPOINTS } from '@/constants/api'
import { useBaseMutation, useBaseQuery } from './useBaseHooks'

export interface Assessment {
  _id?: string
  id?: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  questions: AssessmentQuestion[]
  passingScore: number
  createdBy?: string
  createdAt?: string
}

export interface AssessmentQuestion {
  id: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'short-answer'
  options?: string[]
  correctAnswer?: string | number
  points: number
}

export interface AssessmentSubmission {
  assessmentId: string
  answers: Record<string, any>
}

export interface AssessmentResult {
  _id?: string
  assessmentId: string
  userId: string
  score: number
  totalPoints: number
  percentage: number
  passed: boolean
  answers: Record<string, any>
  completedAt: string
}

/**
 * Hook for fetching assessments list
 */
export function useAssessments(category?: string) {
  const queryFn = useCallback(async () => {
    const params = category ? { category } : {}
    const queryString = RequestService.buildQueryParams(params)
    return RequestService.get<{ assessments: Assessment[] }>(`/api/assessments${queryString}`)
  }, [category])

  const query = useBaseQuery(queryFn, {
    enabled: true,
    refetchOnMount: true,
  })

  return {
    assessments: query.data?.assessments || [],
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for fetching a single assessment
 */
export function useAssessment(id: string, options?: { enabled?: boolean }) {
  const queryFn = useCallback(async () => {
    return RequestService.get<{ assessment: Assessment }>(`/api/assessments/${id}`)
  }, [id])

  const query = useBaseQuery(queryFn, {
    enabled: (options?.enabled ?? true) && !!id,
    refetchOnMount: true,
  })

  return {
    assessment: query.data?.assessment || null,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for submitting assessment answers
 */
export function useSubmitAssessment() {
  const mutation = useBaseMutation<{ result: AssessmentResult }, AssessmentSubmission>()

  mutation.setMutateFunction(async (data: AssessmentSubmission) => {
    return RequestService.post(`/api/assessments/${data.assessmentId}/submit`, {
      answers: data.answers,
    })
  })

  const submitAssessment = useCallback(async (data: AssessmentSubmission) => {
    try {
      const result = await mutation.mutate(data)
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    submitAssessment,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for fetching user's assessment results
 */
export function useAssessmentResults() {
  const queryFn = useCallback(async () => {
    return RequestService.get<{ results: AssessmentResult[] }>('/api/assessments/results')
  }, [])

  const query = useBaseQuery(queryFn, {
    enabled: true,
    refetchOnMount: true,
  })

  return {
    results: query.data?.results || [],
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for creating an assessment (admin only)
 */
export function useCreateAssessment() {
  const mutation = useBaseMutation<{ assessment: Assessment }, Omit<Assessment, '_id' | 'id'>>()

  mutation.setMutateFunction(async (data) => {
    return RequestService.post('/api/admin/assessments/create', data)
  })

  const createAssessment = useCallback(async (data: Omit<Assessment, '_id' | 'id'>) => {
    try {
      const result = await mutation.mutate(data)
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    createAssessment,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}
