/**
 * Component Props Interfaces
 * Type definitions for all atomic design components
 */

import { Job, Application, JobQueryParams, ApplicationQueryParams } from './index'

/**
 * Atom Component Props
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

export interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  className?: string
  onClick?: () => void
}

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'white'
  className?: string
}

/**
 * Molecule Component Props
 */

export interface JobCardProps {
  job: Job
  onApply?: (job: Job) => void
  onView?: (job: Job) => void
  showActions?: boolean
  hasApplied?: boolean
}

export interface ApplicationCardProps {
  application: Application
  onView?: (application: Application) => void
  onUpdateStatus?: (id: string, status: string) => void
  showActions?: boolean
  viewMode?: 'applicant' | 'employer'
}

export interface SearchBarProps {
  onSearch: (term: string) => void
  placeholder?: string
  showFilters?: boolean
  filters?: SearchFilter[]
  onFilterChange?: (name: string, value: string) => void
}

export interface SearchFilter {
  name: string
  label: string
  type: 'text' | 'select' | 'date'
  value?: string
  options?: { label: string; value: string }[]
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPageNumbers?: boolean
  maxPageNumbers?: number
}

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}

/**
 * Organism Component Props
 */

export interface JobListProps {
  initialFilters?: JobQueryParams
  onJobClick?: (job: Job) => void
  onJobApply?: (job: Job) => void
  showSearch?: boolean
  showFilters?: boolean
}

export interface ApplicationListProps {
  viewMode?: 'applicant' | 'employer'
  initialFilters?: ApplicationQueryParams
  onApplicationClick?: (application: Application) => void
}

/**
 * Template Component Props
 */

export interface DashboardTemplateProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
}

export interface JobDetailsTemplateProps {
  job: Job
  onApply?: () => void
  onBack?: () => void
  hasApplied?: boolean
}

export interface ApplicationDetailsTemplateProps {
  application: Application
  viewMode?: 'applicant' | 'employer'
  onBack?: () => void
  onUpdateStatus?: (status: string) => void
}
