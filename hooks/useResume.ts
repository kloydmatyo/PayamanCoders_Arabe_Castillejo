/**
 * Resume Related Hooks
 * Custom hooks for resume builder operations
 */

import { useCallback } from 'react'
import { RequestService } from '@/services/RequestService'
import { useBaseMutation, useBaseQuery } from './useBaseHooks'

export interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin?: string
    portfolio?: string
  }
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: string[]
  certifications?: CertificationItem[]
  projects?: ProjectItem[]
}

export interface ExperienceItem {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate?: string
  current: boolean
  description: string[]
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  gpa?: string
}

export interface CertificationItem {
  id: string
  name: string
  issuer: string
  date: string
  url?: string
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
}

export interface ATSScore {
  overall: number
  breakdown: {
    keywords: number
    formatting: number
    experience: number
    education: number
    skills: number
  }
  suggestions: string[]
}

/**
 * Hook for saving resume data
 */
export function useSaveResume() {
  const mutation = useBaseMutation<{ success: boolean; resumeId: string }, ResumeData>()

  mutation.setMutateFunction(async (data: ResumeData) => {
    return RequestService.post('/api/resume-builder/save', data)
  })

  const saveResume = useCallback(async (data: ResumeData) => {
    try {
      const result = await mutation.mutate(data)
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    saveResume,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for fetching user's resume
 */
export function useResume() {
  const queryFn = useCallback(async () => {
    return RequestService.get<{ resume: ResumeData }>('/api/resume-builder/get')
  }, [])

  const query = useBaseQuery(queryFn, {
    enabled: true,
    refetchOnMount: true,
  })

  return {
    resume: query.data?.resume || null,
    loading: query.loading,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook for analyzing resume with ATS
 */
export function useAnalyzeResume() {
  const mutation = useBaseMutation<{ score: ATSScore }, { resume: ResumeData; jobDescription?: string }>()

  mutation.setMutateFunction(async (data) => {
    return RequestService.post('/api/resume-builder/analyze', data)
  })

  const analyzeResume = useCallback(async (resume: ResumeData, jobDescription?: string) => {
    try {
      const result = await mutation.mutate({ resume, jobDescription })
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    analyzeResume,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for optimizing resume bullets with AI
 */
export function useOptimizeBullets() {
  const mutation = useBaseMutation<{ optimized: string[] }, { bullets: string[]; jobDescription?: string }>()

  mutation.setMutateFunction(async (data) => {
    return RequestService.post('/api/resume-builder/optimize-bullets', data)
  })

  const optimizeBullets = useCallback(async (bullets: string[], jobDescription?: string) => {
    try {
      const result = await mutation.mutate({ bullets, jobDescription })
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    optimizeBullets,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for generating PDF resume
 */
export function useGenerateResumePDF() {
  const mutation = useBaseMutation<{ pdfUrl: string }, ResumeData>()

  mutation.setMutateFunction(async (data: ResumeData) => {
    return RequestService.post('/api/resume-builder/generate-pdf', data)
  })

  const generatePDF = useCallback(async (resume: ResumeData) => {
    try {
      const result = await mutation.mutate(resume)
      return result
    } catch (error) {
      throw error
    }
  }, [mutation.mutate])

  return {
    generatePDF,
    loading: mutation.loading,
    error: mutation.error,
    reset: mutation.reset,
  }
}
