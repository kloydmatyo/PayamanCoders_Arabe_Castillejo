'use client'

import { useState, useEffect, CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, MapPin, Globe, Phone, Mail, Users, Calendar, Save, Edit3 } from 'lucide-react'

interface CompanyProfile {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: string
  companyProfile?: {
    companyName?: string
    industry?: string
    companySize?: string
    website?: string
    description?: string
    location?: string
    phone?: string
    logo?: string
    founded?: string
    benefits?: string[]
    culture?: string
  }
  createdAt: string
}

export default function CompanySettingsPage() {
  const [user, setUser] = useState<CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    description: '',
    location: '',
    phone: '',
    founded: '',
    benefits: '',
    culture: ''
  })

  useEffect(() => {
    fetchCompanyProfile()
  }, [])

  const fetchCompanyProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        
        // Check if user is an employer
        if (data.user.role !== 'employer') {
          router.push('/profile')
          return
        }

        setUser(data.user)
        const company = data.user.companyProfile || {}
        setFormData({
          companyName: company.companyName || '',
          industry: company.industry || '',
          companySize: company.companySize || '',
          website: company.website || '',
          description: company.description || '',
          location: company.location || '',
          phone: company.phone || '',
          founded: company.founded || '',
          benefits: company.benefits?.join(', ') || '',
          culture: company.culture || ''
        })
      } else {
        setError('Failed to load company profile')
      }
    } catch (error) {
      setError('Error loading company profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user/company-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyProfile: {
            companyName: formData.companyName,
            industry: formData.industry,
            companySize: formData.companySize,
            website: formData.website,
            description: formData.description,
            location: formData.location,
            phone: formData.phone,
            founded: formData.founded,
            benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b),
            culture: formData.culture
          }
        }),
      })

      if (response.ok) {
        await fetchCompanyProfile()
        setIsEditing(false)
        setSuccess('Company profile updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to update company profile')
      }
    } catch (error) {
      setError('Error updating company profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
        <div className="auth-background-grid"></div>
        <div className="auth-entry-overlay"></div>
        <div className="futuristic-loader">
          <div className="futuristic-loader-inner"></div>
        </div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
        <div className="auth-background-grid"></div>
        <div className="auth-entry-overlay"></div>
        <div className="card p-8 max-w-md mx-auto">
          <div className="text-red-600 text-center">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      <div className="auth-background-grid"></div>
      <div className="auth-entry-overlay"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header */}
        <div className="mb-8 auth-panel" style={{ '--float-delay': '0.1s' } as CSSProperties}>
          <h1 className="auth-title text-4xl font-bold mb-3">Company Settings</h1>
          <p className="auth-subtitle text-base text-secondary-600/90">
            Manage your company profile and information
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 card p-4 border-green-500/40 bg-green-500/10 text-green-600 animate-[floatUp_0.5s_ease-out_0.2s_both]">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              {success}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 card p-4 border-red-500/40 bg-red-500/10 text-red-600 animate-[floatUp_0.5s_ease-out_0.2s_both]">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              {error}
            </div>
          </div>
        )}

        {/* Company Profile Card */}
        <div className="card overflow-hidden" style={{ '--float-delay': '0.2s' } as CSSProperties}>
          <div className="px-8 py-6 border-b border-primary-500/30 flex justify-between items-center bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-secondary-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/5 to-transparent animate-pulse"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="feature-icon">
                <Building2 className="h-6 w-6" />
              </div>
              <h2 className="feature-heading text-2xl font-bold">Company Information</h2>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`relative z-10 ${isEditing ? 'btn-secondary' : 'btn-primary'} px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 group`}
            >
              <span className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                {isEditing ? 'Cancel' : 'Edit'}
              </span>
            </button>
          </div>

          <div className="p-8">
            {isEditing ? (
              <div className="space-y-8 animate-[floatUp_0.5s_ease-out]">
                {/* Company Name & Industry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="glass-input w-full px-5 py-3.5 text-base font-medium transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="group">
                    <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                      Industry
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="glass-input w-full px-5 py-3.5 text-base font-medium appearance-none bg-white/70 cursor-pointer transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                    >
                      <option value="">Select industry</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="consulting">Consulting</option>
                      <option value="media">Media & Entertainment</option>
                      <option value="nonprofit">Non-profit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Company Size & Founded */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                      Company Size
                    </label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      className="glass-input w-full px-5 py-3.5 text-base font-medium appearance-none bg-white/70 cursor-pointer transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                  <div className="group">
                    <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                      Founded Year
                    </label>
                    <input
                      type="text"
                      value={formData.founded}
                      onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                      className="glass-input w-full px-5 py-3.5 text-base font-medium transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                      placeholder="e.g., 2020"
                    />
                  </div>
                </div>

                {/* Location & Website */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="glass-input w-full px-5 py-3.5 text-base font-medium transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                      placeholder="City, State/Country"
                    />
                  </div>
                  <div className="group">
                    <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="glass-input w-full px-5 py-3.5 text-base font-medium transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                      placeholder="https://www.company.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="glass-input w-full px-5 py-3.5 text-base font-medium transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Description */}
                <div className="group">
                  <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                    Company Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="glass-input w-full px-5 py-3.5 text-base font-medium resize-none transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                    placeholder="Describe your company, mission, and what makes it unique..."
                  />
                </div>

                {/* Benefits */}
                <div className="group">
                  <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                    Benefits & Perks (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    className="glass-input w-full px-5 py-3.5 text-base font-medium transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                    placeholder="Health insurance, Remote work, Flexible hours, etc."
                  />
                </div>

                {/* Culture */}
                <div className="group">
                  <label className="auth-label block text-sm font-bold uppercase tracking-[0.15em] text-primary-600 mb-3 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                    Company Culture
                  </label>
                  <textarea
                    value={formData.culture}
                    onChange={(e) => setFormData({ ...formData, culture: e.target.value })}
                    rows={3}
                    className="glass-input w-full px-5 py-3.5 text-base font-medium resize-none transition-all duration-300 group-hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                    placeholder="Describe your company culture and work environment..."
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-4 pt-6 border-t border-white/30">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary px-8 py-3.5 text-base font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary px-10 py-3.5 text-base font-bold shadow-xl hover:shadow-2xl hover:shadow-primary-500/40 transition-all duration-300 group relative overflow-hidden disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      {saving ? 'Saving...' : 'Save Changes'}
                      {!saving && (
                        <div className="h-1.5 w-1.5 rounded-full bg-white/80 group-hover:bg-white animate-pulse"></div>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Company Header */}
                <div className="flex items-start gap-6 p-6 rounded-2xl border border-primary-500/20 bg-gradient-to-br from-primary-500/10 via-white/40 to-secondary-500/10 backdrop-blur relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/5 to-transparent opacity-50"></div>
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white flex items-center justify-center text-3xl font-bold shadow-xl shadow-primary-500/30 border-2 border-white/30 group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                    <span className="relative z-10">{user?.companyProfile?.companyName?.[0] || 'C'}</span>
                  </div>
                  <div className="flex-1 relative z-10">
                    <h3 className="feature-heading text-3xl font-bold mb-2">
                      {user?.companyProfile?.companyName || 'Company Name Not Set'}
                    </h3>
                    <p className="auth-subtitle text-base capitalize">
                      {user?.companyProfile?.industry || 'Industry not specified'}
                    </p>
                  </div>
                </div>

                {/* Company Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {user?.companyProfile?.companySize && (
                    <div className="feature-card p-5 flex items-center gap-4 group" style={{ '--float-delay': '0.3s' } as CSSProperties}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/15 text-primary-600 shadow-inner shadow-primary-900/10 flex-shrink-0">
                        <Users className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-bold text-gray-900">{user.companyProfile.companySize}</span>
                    </div>
                  )}
                  
                  {user?.companyProfile?.location && (
                    <div className="feature-card p-5 flex items-center gap-4 group" style={{ '--float-delay': '0.4s' } as CSSProperties}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/15 text-primary-600 shadow-inner shadow-primary-900/10 flex-shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-bold text-gray-900">{user.companyProfile.location}</span>
                    </div>
                  )}
                  
                  {user?.companyProfile?.website && (
                    <div className="feature-card p-5 flex items-center gap-4 group" style={{ '--float-delay': '0.5s' } as CSSProperties}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/15 text-primary-600 shadow-inner shadow-primary-900/10 flex-shrink-0">
                        <Globe className="h-5 w-5" />
                      </div>
                      <a 
                        href={user.companyProfile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="auth-link text-lg font-bold"
                      >
                        {user.companyProfile.website}
                      </a>
                    </div>
                  )}
                  
                  {user?.companyProfile?.phone && (
                    <div className="feature-card p-5 flex items-center gap-4 group" style={{ '--float-delay': '0.6s' } as CSSProperties}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/15 text-primary-600 shadow-inner shadow-primary-900/10 flex-shrink-0">
                        <Phone className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-bold text-gray-900">{user.companyProfile.phone}</span>
                    </div>
                  )}
                  
                  {user?.companyProfile?.founded && (
                    <div className="feature-card p-5 flex items-center gap-4 group" style={{ '--float-delay': '0.7s' } as CSSProperties}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/15 text-primary-600 shadow-inner shadow-primary-900/10 flex-shrink-0">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-bold text-gray-900">Founded {user.companyProfile.founded}</span>
                    </div>
                  )}
                  
                  <div className="feature-card p-5 flex items-center gap-4 group" style={{ '--float-delay': '0.8s' } as CSSProperties}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/15 text-primary-600 shadow-inner shadow-primary-900/10 flex-shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">{user?.email}</span>
                  </div>
                </div>

                {/* Description */}
                {user?.companyProfile?.description && (
                  <div className="card p-6" style={{ '--float-delay': '0.9s' } as CSSProperties}>
                    <h4 className="feature-heading text-xl font-bold mb-4">About</h4>
                    <p className="auth-subtitle text-base leading-relaxed">{user.companyProfile.description}</p>
                  </div>
                )}

                {/* Benefits */}
                {user?.companyProfile?.benefits && user.companyProfile.benefits.length > 0 && (
                  <div className="card p-6" style={{ '--float-delay': '1s' } as CSSProperties}>
                    <h4 className="feature-heading text-xl font-bold mb-4">Benefits & Perks</h4>
                    <div className="flex flex-wrap gap-3">
                      {user.companyProfile.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-green-500/20 border border-green-500/40 text-green-600 rounded-full text-sm font-bold shadow-lg shadow-green-500/20 hover:bg-green-500/30 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Culture */}
                {user?.companyProfile?.culture && (
                  <div className="card p-6" style={{ '--float-delay': '1.1s' } as CSSProperties}>
                    <h4 className="feature-heading text-xl font-bold mb-4">Company Culture</h4>
                    <p className="auth-subtitle text-base leading-relaxed">{user.companyProfile.culture}</p>
                  </div>
                )}

                {/* Empty State */}
                {!user?.companyProfile?.companyName && (
                  <div className="card p-12 text-center relative overflow-hidden group/empty animate-[floatUp_0.6s_ease-out_0.3s_both]">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <div className="feature-icon mx-auto mb-6 w-16 h-16 group-hover/empty:scale-110 transition-transform duration-500">
                        <Building2 className="h-8 w-8" />
                      </div>
                      <h3 className="feature-heading text-2xl font-bold mb-3">Complete Your Company Profile</h3>
                      <p className="auth-subtitle text-base mb-6 max-w-md mx-auto">
                        Add your company information to attract top talent and build trust with candidates.
                      </p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn-primary px-8 py-3.5 text-base font-semibold group/btn"
                      >
                        <span className="flex items-center gap-2">
                          Get Started
                          <div className="h-1.5 w-1.5 rounded-full bg-white/80 group-hover/btn:bg-white animate-pulse"></div>
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}