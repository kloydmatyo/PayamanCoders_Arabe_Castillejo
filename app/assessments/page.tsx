'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Award, Clock, BarChart, BookOpen, Filter, Trophy, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

type SortField = 'title' | 'category' | 'difficulty' | 'duration' | 'questions'
type SortOrder = 'asc' | 'desc'

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ category: '', difficulty: '' })
  const [sortField, setSortField] = useState<SortField>('title')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    fetchAssessments()
  }, [filter])

  // Real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchAssessments, 30000)
    return () => clearInterval(interval)
  }, [filter])

  const fetchAssessments = async () => {
    try {
      const params = new URLSearchParams()
      if (filter.category) params.append('category', filter.category)
      if (filter.difficulty) params.append('difficulty', filter.difficulty)
      
      const response = await fetch(`/api/assessments?${params}`)
      if (response.ok) {
        const data = await response.json()
        setAssessments(data.assessments)
      }
    } catch (error) {
      console.error('Failed to fetch assessments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  const getSortedAssessments = () => {
    const sorted = [...assessments].sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === 'questions') {
        aValue = a.questions?.length || 0
        bValue = b.questions?.length || 0
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }

  const getPaginatedAssessments = () => {
    const sorted = getSortedAssessments()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sorted.slice(startIndex, endIndex)
  }

  const totalPages = Math.ceil(assessments.length / itemsPerPage)

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-primary-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-primary-600" />
    )
  }

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-[-10%] bottom-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-purple-400/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" role="main">
        <header className="mb-10">
          <div className="relative overflow-hidden group/header mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover/header:opacity-100 transition-opacity duration-500 rounded-2xl" aria-hidden="true"></div>
            <div className="relative flex items-center gap-4">
              <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-500 text-white shadow-xl shadow-blue-500/40 group/icon flex-shrink-0" aria-hidden="true">
                <Award className="h-8 w-8 md:h-10 md:w-10 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/50 to-purple-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300" aria-hidden="true"></div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  Skill Assessments
                </h1>
                <p className="text-lg md:text-xl text-secondary-600">
                  Test your skills and earn certificates to boost your employability
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Filters */}
        <section className="card relative overflow-hidden group/filter hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 mb-10" aria-label="Assessment filters">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/filter:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
          <div className="relative p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="category-filter" className="block text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30" aria-hidden="true">
                    <Filter className="h-4 w-4 text-primary-600" aria-hidden="true" />
                  </div>
                  Category
                </label>
                <select
                  id="category-filter"
                  value={filter.category}
                  onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                  className="w-full px-5 py-3 text-base font-medium rounded-xl border-2 border-primary-500/30 bg-white/70 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 shadow-lg backdrop-blur-xl hover:border-primary-400 hover:bg-white/90 transition-all"
                  aria-label="Filter assessments by category"
                >
                  <option value="">All Categories</option>
                  <option value="technical">Technical</option>
                  <option value="soft_skills">Soft Skills</option>
                  <option value="industry_specific">Industry Specific</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label htmlFor="difficulty-filter" className="block text-base font-bold text-gray-700 mb-3">
                  Difficulty
                </label>
                <select
                  id="difficulty-filter"
                  value={filter.difficulty}
                  onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
                  className="w-full px-5 py-3 text-base font-medium rounded-xl border-2 border-primary-500/30 bg-white/70 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 shadow-lg backdrop-blur-xl hover:border-primary-400 hover:bg-white/90 transition-all"
                  aria-label="Filter assessments by difficulty level"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="flex items-end">
                <Link
                  href="/certificates"
                  className="relative w-full flex items-center justify-center gap-3 px-6 py-4 text-base font-bold rounded-xl border-2 border-primary-500/50 bg-white/60 backdrop-blur-xl text-primary-600 shadow-xl shadow-primary-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-500/70 hover:bg-white/80 overflow-hidden group/btn"
                  aria-label="View my earned certificates"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl" aria-hidden="true"></div>
                  <Trophy className="w-5 h-5 relative z-10 group-hover/btn:scale-125 transition-transform duration-300" aria-hidden="true" />
                  <span className="relative z-10">View My Certificates</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-1000" aria-hidden="true"></div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Assessments Table */}
        {loading ? (
          <div className="text-center py-16" role="status" aria-live="polite">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-6" aria-hidden="true"></div>
            <p className="text-lg text-secondary-600 font-medium">Loading assessments...</p>
          </div>
        ) : assessments.length === 0 ? (
          <div className="card relative overflow-hidden group/empty hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500" role="status">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
            <div className="relative py-20 text-center">
              <div className="feature-icon mx-auto mb-6 w-20 h-20" aria-hidden="true">
                <BookOpen className="w-12 h-12 text-primary-500" />
              </div>
              <p className="text-xl text-gray-500 font-bold">No assessments found</p>
            </div>
          </div>
        ) : (
          <>
            {/* Table Container */}
            <section className="card overflow-hidden" aria-label="Assessments table">
              <div className="overflow-x-auto">
                <table className="w-full" role="table" aria-label="Available skill assessments">
                  <thead className="bg-gradient-to-r from-primary-50 to-secondary-50 border-b-2 border-primary-100">
                    <tr>
                      <th 
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold text-gray-900 cursor-pointer hover:bg-primary-100/50 transition-colors"
                        onClick={() => handleSort('title')}
                        aria-sort={sortField === 'title' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                      >
                        <button className="flex items-center gap-2 w-full text-left" aria-label={`Sort by assessment title ${sortField === 'title' ? (sortOrder === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}>
                          <span>Assessment Title</span>
                          <SortIcon field="title" />
                        </button>
                      </th>
                      <th 
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold text-gray-900 cursor-pointer hover:bg-primary-100/50 transition-colors"
                        onClick={() => handleSort('category')}
                        aria-sort={sortField === 'category' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                      >
                        <button className="flex items-center gap-2 w-full text-left" aria-label={`Sort by category ${sortField === 'category' ? (sortOrder === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}>
                          <span>Category</span>
                          <SortIcon field="category" />
                        </button>
                      </th>
                      <th 
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-bold text-gray-900 cursor-pointer hover:bg-primary-100/50 transition-colors"
                        onClick={() => handleSort('difficulty')}
                        aria-sort={sortField === 'difficulty' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                      >
                        <button className="flex items-center gap-2 w-full text-left" aria-label={`Sort by difficulty ${sortField === 'difficulty' ? (sortOrder === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}>
                          <span>Difficulty</span>
                          <SortIcon field="difficulty" />
                        </button>
                      </th>
                      <th 
                        scope="col"
                        className="px-6 py-4 text-center text-sm font-bold text-gray-900 cursor-pointer hover:bg-primary-100/50 transition-colors"
                        onClick={() => handleSort('duration')}
                        aria-sort={sortField === 'duration' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                      >
                        <button className="flex items-center justify-center gap-2 w-full" aria-label={`Sort by duration ${sortField === 'duration' ? (sortOrder === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}>
                          <Clock className="w-4 h-4" aria-hidden="true" />
                          <span>Duration</span>
                          <SortIcon field="duration" />
                        </button>
                      </th>
                      <th 
                        scope="col"
                        className="px-6 py-4 text-center text-sm font-bold text-gray-900 cursor-pointer hover:bg-primary-100/50 transition-colors"
                        onClick={() => handleSort('questions')}
                        aria-sort={sortField === 'questions' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
                      >
                        <button className="flex items-center justify-center gap-2 w-full" aria-label={`Sort by number of questions ${sortField === 'questions' ? (sortOrder === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}>
                          <BarChart className="w-4 h-4" aria-hidden="true" />
                          <span>Questions</span>
                          <SortIcon field="questions" />
                        </button>
                      </th>
                      <th scope="col" className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                        <div className="flex items-center justify-center gap-2">
                          <Award className="w-4 h-4" aria-hidden="true" />
                          <span>Pass Score</span>
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getPaginatedAssessments().map((assessment) => (
                      <tr 
                        key={assessment._id}
                        className="hover:bg-primary-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex-shrink-0" aria-hidden="true">
                              <Award className="w-5 h-5 text-primary-600" aria-hidden="true" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                {assessment.title}
                              </h3>
                              <p className="text-sm text-secondary-600 line-clamp-2 mt-1">
                                {assessment.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 border border-blue-500/40">
                            {assessment.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-bold ${getDifficultyColor(assessment.difficulty)}`}>
                            {assessment.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-base font-semibold text-gray-900" aria-label={`${assessment.duration} minutes`}>
                            {assessment.duration} min
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-base font-semibold text-gray-900" aria-label={`${assessment.questions?.length || 0} questions`}>
                            {assessment.questions?.length || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-base font-semibold text-gray-900" aria-label={`Passing score ${assessment.passingScore} percent`}>
                            {assessment.passingScore}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            href={`/assessments/${assessment._id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg border-2 border-primary-500/50 bg-white text-primary-600 shadow-md hover:shadow-lg hover:scale-105 hover:border-primary-500 hover:bg-primary-50 transition-all duration-300"
                            aria-label={`Start ${assessment.title} assessment`}
                          >
                            Start
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="card mt-6" aria-label="Pagination navigation">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-secondary-600" role="status" aria-live="polite">
                    Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-bold text-gray-900">
                      {Math.min(currentPage * itemsPerPage, assessments.length)}
                    </span>{' '}
                    of <span className="font-bold text-gray-900">{assessments.length}</span> assessments
                  </div>
                  <div className="flex items-center gap-2" role="group" aria-label="Pagination controls">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-bold rounded-lg border-2 border-primary-500/50 bg-white text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      aria-label="Go to previous page"
                      aria-disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-bold rounded-lg transition-all ${
                            currentPage === page
                              ? 'bg-primary-500 text-white shadow-lg'
                              : 'bg-white text-gray-700 hover:bg-primary-50 border border-gray-300'
                          }`}
                          aria-label={`Go to page ${page}`}
                          aria-current={currentPage === page ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-bold rounded-lg border-2 border-primary-500/50 bg-white text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      aria-label="Go to next page"
                      aria-disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  )
}
