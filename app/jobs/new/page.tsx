'use client'

import { useState, CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import Link from 'next/link'
import JobCreatedModal from '@/components/modals/JobCreatedModal'

export default function NewJobPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdJob, setCreatedJob] = useState<{ id: string; title: string } | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    type: 'internship',
    location: '',
    remote: false,
    salary: {
      min: '',
      max: '',
      currency: 'USD'
    },
    requirements: [''],
    skills: [''],
    duration: '',
    applicationDeadline: ''
  })

  // Redirect if not employer
  if (user && user.role !== 'employer') {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
        <div className="auth-background-grid"></div>
        <div className="auth-entry-overlay"></div>
        <div className="card p-8 max-w-md mx-auto relative z-10">
          <h3 className="feature-heading text-2xl font-bold mb-3 text-red-600">Access Denied</h3>
          <p className="auth-subtitle text-base mb-6">Only employers can post jobs. Please contact support if you need to change your account type.</p>
          <Link href="/" className="btn-primary inline-flex items-center">
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [salaryField]: value
        }
      }))
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleArrayChange = (field: 'requirements' | 'skills', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'requirements' | 'skills') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field: 'requirements' | 'skills', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Clean up the data
      const salaryData = {
        min: formData.salary.min ? parseInt(formData.salary.min) : undefined,
        max: formData.salary.max ? parseInt(formData.salary.max) : undefined,
        currency: formData.salary.currency
      }

      const jobData: any = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        skills: formData.skills.filter(skill => skill.trim() !== ''),
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline) : undefined
      }

      // Only include salary if values are provided
      if (salaryData.min || salaryData.max) {
        jobData.salary = salaryData
      }

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(jobData)
      })

      const data = await response.json()

      if (response.ok) {
        setCreatedJob({
          id: data.job._id,
          title: data.job.title
        })
        setShowSuccessModal(true)
      } else {
        setError(data.error || 'Failed to post job')
      }
    } catch (error) {
      console.error('Error posting job:', error)
      setError('An error occurred while posting the job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      <div className="auth-background-grid"></div>
      <div className="auth-entry-overlay"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header */}
        <div className="mb-8 auth-panel" style={{ '--float-delay': '0.1s' } as CSSProperties}>
          <Link 
            href="/" 
            className="inline-flex items-center text-secondary-600 hover:text-primary-600 mb-6 group/back transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover/back:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold group-hover/back:text-primary-600 transition-colors duration-300">Back to Dashboard</span>
          </Link>
          <h1 className="auth-title text-4xl font-bold mb-3">Post a New Job</h1>
          <p className="auth-subtitle text-base text-secondary-600/90">
            Create a job posting to attract qualified candidates for your organization.
          </p>
        </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 card p-4 border-red-500/40 bg-red-500/10 text-red-600 animate-[floatUp_0.6s_ease-out_0.2s_both]" style={{ '--float-delay': '0.15s' } as CSSProperties}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Basic Information */}
        <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.2s_both]" style={{ '--float-delay': '0.2s' } as CSSProperties}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <h2 className="feature-heading text-3xl font-bold mb-8">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="title" className="auth-label block mb-4 text-lg">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="glass-input w-full text-base px-5 py-4"
                  placeholder="e.g. Frontend Developer Intern"
                />
              </div>

              <div>
                <label htmlFor="company" className="auth-label block mb-4 text-lg">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleInputChange}
                  className="glass-input w-full text-base px-5 py-4"
                  placeholder="e.g. TechCorp Inc."
                />
              </div>

              <div>
                <label htmlFor="type" className="auth-label block mb-4 text-lg">
                  Job Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="glass-input w-full text-base px-5 py-4"
                >
                  <option value="internship">Internship</option>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <div>
                <label htmlFor="location" className="auth-label block mb-4 text-lg">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="glass-input w-full text-base px-5 py-4"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </div>

            <div className="mt-8">
              <label className="flex items-center group/checkbox cursor-pointer">
                <input
                  type="checkbox"
                  name="remote"
                  checked={formData.remote}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="relative flex items-center justify-center w-6 h-6 rounded border-2 border-primary-500/40 bg-white/70 group-hover/checkbox:border-primary-500/60 transition-all duration-300 group-hover/checkbox:scale-110">
                  {formData.remote && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
                <span className="ml-4 text-lg font-medium text-secondary-700 group-hover/checkbox:text-primary-600 transition-colors duration-300">This is a remote position</span>
              </label>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.3s_both]" style={{ '--float-delay': '0.3s' } as CSSProperties}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <h2 className="feature-heading text-3xl font-bold mb-8">Job Description</h2>
            
            <div>
              <label htmlFor="description" className="auth-label block mb-4 text-lg">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={8}
                value={formData.description}
                onChange={handleInputChange}
                className="glass-input w-full resize-none text-base px-5 py-4"
                placeholder="Describe the role, responsibilities, and what the candidate will learn or accomplish..."
              />
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.4s_both]" style={{ '--float-delay': '0.4s' } as CSSProperties}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <h2 className="feature-heading text-3xl font-bold mb-8">Requirements</h2>
            
            <div className="space-y-5">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    className="glass-input flex-1 text-base px-5 py-4"
                    placeholder="e.g. Basic knowledge of HTML, CSS, and JavaScript"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('requirements', index)}
                      className="px-5 py-4 text-red-600 hover:text-white hover:bg-red-500/80 border border-red-500/40 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 group/remove"
                    >
                      <X className="w-5 h-5 group-hover/remove:scale-110 transition-transform duration-300" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('requirements')}
                className="inline-flex items-center gap-3 text-primary-600 hover:text-primary-500 font-semibold text-lg group/add transition-all duration-300"
              >
                <Plus className="w-6 h-6 group-hover/add:scale-110 group-hover/add:rotate-90 transition-all duration-300" />
                <span>Add Requirement</span>
                <div className="h-2 w-2 rounded-full bg-primary-500/80 group-hover/add:bg-primary-500 animate-pulse"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.5s_both]" style={{ '--float-delay': '0.5s' } as CSSProperties}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <h2 className="feature-heading text-3xl font-bold mb-8">Required Skills</h2>
            
            <div className="space-y-5">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                    className="glass-input flex-1 text-base px-5 py-4"
                    placeholder="e.g. JavaScript, React, Node.js"
                  />
                  {formData.skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('skills', index)}
                      className="px-5 py-4 text-red-600 hover:text-white hover:bg-red-500/80 border border-red-500/40 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 group/remove"
                    >
                      <X className="w-5 h-5 group-hover/remove:scale-110 transition-transform duration-300" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('skills')}
                className="inline-flex items-center gap-3 text-primary-600 hover:text-primary-500 font-semibold text-lg group/add transition-all duration-300"
              >
                <Plus className="w-6 h-6 group-hover/add:scale-110 group-hover/add:rotate-90 transition-all duration-300" />
                <span>Add Skill</span>
                <div className="h-2 w-2 rounded-full bg-primary-500/80 group-hover/add:bg-primary-500 animate-pulse"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Compensation & Details */}
        <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.6s_both]" style={{ '--float-delay': '0.6s' } as CSSProperties}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <h2 className="feature-heading text-3xl font-bold mb-8">Compensation & Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="salary.min" className="auth-label block mb-4 text-lg">
                  Minimum Salary (per hour)
                </label>
                <input
                  type="number"
                  id="salary.min"
                  name="salary.min"
                  value={formData.salary.min}
                  onChange={handleInputChange}
                  className="glass-input w-full text-base px-5 py-4"
                  placeholder="15"
                />
              </div>

              <div>
                <label htmlFor="salary.max" className="auth-label block mb-4 text-lg">
                  Maximum Salary (per hour)
                </label>
                <input
                  type="number"
                  id="salary.max"
                  name="salary.max"
                  value={formData.salary.max}
                  onChange={handleInputChange}
                  className="glass-input w-full text-base px-5 py-4"
                  placeholder="25"
                />
              </div>

              <div>
                <label htmlFor="duration" className="auth-label block mb-4 text-lg">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="glass-input w-full text-base px-5 py-4"
                  placeholder="e.g. 3 months, 6 months, Ongoing"
                />
              </div>

              <div>
                <label htmlFor="applicationDeadline" className="auth-label block mb-4 text-lg">
                  Application Deadline
                </label>
                <input
                  type="date"
                  id="applicationDeadline"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  className="glass-input w-full text-base px-5 py-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-5 animate-[floatUp_0.6s_ease-out_0.7s_both]" style={{ '--float-delay': '0.7s' } as CSSProperties}>
          <Link
            href="/"
            className="btn-secondary px-8 py-4 text-lg font-semibold group/btn inline-flex items-center gap-2"
          >
            <span>Cancel</span>
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 py-4 text-lg font-semibold group/btn inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Save className="w-6 h-6 group-hover/btn:scale-110 transition-transform duration-300" />
                <span>Post Job</span>
                <div className="h-2 w-2 rounded-full bg-white/80 group-hover/btn:bg-white animate-pulse"></div>
              </>
            )}
          </button>
        </div>
      </form>
      </div>

      {/* Success Modal */}
      {createdJob && (
        <JobCreatedModal
          isOpen={showSuccessModal}
          jobId={createdJob.id}
          jobTitle={createdJob.title}
        />
      )}
    </div>
  )
}