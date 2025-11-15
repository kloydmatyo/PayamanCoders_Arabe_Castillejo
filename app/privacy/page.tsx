'use client'

import { CSSProperties } from 'react'
import { Shield, Database, Settings, Lock, UserCheck, Mail } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      <div className="auth-background-grid"></div>
      <div className="auth-entry-overlay"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Header */}
        <div className="mb-10 auth-panel text-center" style={{ '--float-delay': '0.1s' } as CSSProperties}>
          <div className="feature-icon mx-auto mb-6 w-16 h-16 flex items-center justify-center">
            <Shield className="h-12 w-12" />
          </div>
          <h1 className="auth-title text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="auth-subtitle text-xl text-secondary-600/90">
            Your privacy and data security are our top priorities
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Introduction */}
          <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.2s_both]" style={{ '--float-delay': '0.2s' } as CSSProperties}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="feature-icon w-10 h-10 flex items-center justify-center">
                  <Shield className="h-8 w-8" />
                </div>
                <h2 className="feature-heading text-4xl font-bold">Introduction</h2>
              </div>
              <p className="text-lg text-secondary-600/90 leading-relaxed">
                At WorkQit, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our platform.
              </p>
            </div>
          </div>
          
          {/* Information We Collect */}
          <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.3s_both]" style={{ '--float-delay': '0.3s' } as CSSProperties}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="feature-icon w-10 h-10 flex items-center justify-center">
                  <Database className="h-8 w-8" />
                </div>
                <h2 className="feature-heading text-4xl font-bold">Information We Collect</h2>
              </div>
              <p className="text-lg text-secondary-600/90 mb-6">We collect information that you provide directly to us, including:</p>
              <ul className="space-y-3">
                {[
                  'Name, email address, and contact information',
                  'Resume and professional profile information',
                  'Job application data',
                  'Account credentials'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 group/item">
                    <div className="mt-2 w-2.5 h-2.5 rounded-full bg-primary-500/60 group-hover/item:bg-primary-500 flex-shrink-0"></div>
                    <span className="text-lg text-secondary-600/90 group-hover/item:text-primary-600 transition-colors duration-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* How We Use Your Information */}
          <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.4s_both]" style={{ '--float-delay': '0.4s' } as CSSProperties}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="feature-icon w-10 h-10 flex items-center justify-center">
                  <Settings className="h-8 w-8" />
                </div>
                <h2 className="feature-heading text-4xl font-bold">How We Use Your Information</h2>
              </div>
              <p className="text-lg text-secondary-600/90 mb-6">We use the information we collect to:</p>
              <ul className="space-y-3">
                {[
                  'Provide, maintain, and improve our services',
                  'Process job applications and connect job seekers with employers',
                  'Send you technical notices and support messages',
                  'Respond to your comments and questions'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 group/item">
                    <div className="mt-2 w-2.5 h-2.5 rounded-full bg-primary-500/60 group-hover/item:bg-primary-500 flex-shrink-0"></div>
                    <span className="text-lg text-secondary-600/90 group-hover/item:text-primary-600 transition-colors duration-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Data Security */}
          <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.5s_both]" style={{ '--float-delay': '0.5s' } as CSSProperties}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="feature-icon w-10 h-10 flex items-center justify-center">
                  <Lock className="h-8 w-8" />
                </div>
                <h2 className="feature-heading text-4xl font-bold">Data Security</h2>
              </div>
              <p className="text-lg text-secondary-600/90 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>
          </div>
          
          {/* Your Rights */}
          <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.6s_both]" style={{ '--float-delay': '0.6s' } as CSSProperties}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="feature-icon w-10 h-10 flex items-center justify-center">
                  <UserCheck className="h-8 w-8" />
                </div>
                <h2 className="feature-heading text-4xl font-bold">Your Rights</h2>
              </div>
              <p className="text-lg text-secondary-600/90 mb-6">You have the right to:</p>
              <ul className="space-y-3">
                {[
                  'Access your personal information',
                  'Correct inaccurate data',
                  'Request deletion of your data',
                  'Object to processing of your data'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 group/item">
                    <div className="mt-2 w-2.5 h-2.5 rounded-full bg-primary-500/60 group-hover/item:bg-primary-500 flex-shrink-0"></div>
                    <span className="text-lg text-secondary-600/90 group-hover/item:text-primary-600 transition-colors duration-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Contact Us */}
          <div className="card p-10 relative overflow-hidden group animate-[floatUp_0.6s_ease-out_0.7s_both]" style={{ '--float-delay': '0.7s' } as CSSProperties}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="feature-icon w-10 h-10 flex items-center justify-center">
                  <Mail className="h-8 w-8" />
                </div>
                <h2 className="feature-heading text-4xl font-bold">Contact Us</h2>
              </div>
              <p className="text-lg text-secondary-600/90">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@workqit.com" className="auth-link inline-flex items-center gap-2 group/link text-lg">
                  <span>privacy@workqit.com</span>
                </a>
              </p>
            </div>
          </div>
          
          {/* Last Updated */}
          <div className="text-center animate-[floatUp_0.6s_ease-out_0.8s_both]" style={{ '--float-delay': '0.8s' } as CSSProperties}>
            <p className="text-base text-secondary-500/80 font-medium">
              Last updated: November 14, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
