'use client'

import { useState, CSSProperties } from 'react'
import { Mail, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      <div className="auth-background-grid"></div>
      <div className="auth-entry-overlay"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header */}
        <div className="mb-10 auth-panel text-center" style={{ '--float-delay': '0.1s' } as CSSProperties}>
          <h1 className="auth-title text-5xl font-bold mb-4">Contact Us</h1>
          <p className="auth-subtitle text-lg text-secondary-600/90">
            Get in Touch
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.2s_both]" style={{ '--float-delay': '0.2s' } as CSSProperties}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <h2 className="feature-heading text-4xl font-bold mb-4">Get in Touch</h2>
              <p className="auth-subtitle text-base text-secondary-600/90 mb-10 leading-relaxed">
                Have questions or feedback? We'd love to hear from you.
              </p>
              
              <div className="space-y-8">
                <div className="feature-card p-6 group/item hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="feature-icon flex-shrink-0 w-12 h-12">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover/item:text-primary-600 transition-colors duration-300">Email</h3>
                      <a 
                        href="mailto:support@workqit.com" 
                        className="auth-link text-base inline-flex items-center group/link break-all"
                      >
                        <span>support@workqit.com</span>
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="feature-card p-8 group/item hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-start gap-5">
                    <div className="feature-icon flex-shrink-0 w-14 h-14">
                      <MapPin className="h-7 w-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover/item:text-primary-600 transition-colors duration-300">Address</h3>
                      <p className="text-lg text-secondary-600/90 leading-relaxed">
                        WorkQit Platform<br />
                        123 Business Street<br />
                        City, State 12345
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.3s_both]" style={{ '--float-delay': '0.3s' } as CSSProperties}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <h2 className="feature-heading text-3xl font-bold mb-8">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="auth-label block mb-3 text-lg">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="glass-input w-full text-base px-5 py-4"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="auth-label block mb-3 text-lg">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="glass-input w-full text-base px-5 py-4"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="auth-label block mb-3 text-lg">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="glass-input w-full resize-none text-base px-5 py-4"
                    placeholder="Your message..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn-primary w-full px-8 py-4 text-lg font-semibold group/btn inline-flex items-center justify-center gap-3"
                >
                  <Send className="w-6 h-6 group-hover/btn:scale-110 transition-transform duration-300" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
