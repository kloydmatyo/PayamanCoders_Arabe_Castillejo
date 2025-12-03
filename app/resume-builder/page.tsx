'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Eye, 
  Save,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Lightbulb
} from 'lucide-react';
import ResumeBuilderForm from '@/components/resume-builder/ResumeBuilderForm';
import ResumePreview from '@/components/resume-builder/ResumePreview';

export default function ResumeBuilderPage() {
  const [step, setStep] = useState<'build' | 'preview'>('build');
  const [resumeData, setResumeData] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.user);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="hero-gradient relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="auth-background-grid" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/20 blur-3xl animate-pulse"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-lg text-secondary-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-secondary-500/15 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-10">
        {/* Header */}
        <div className="text-center mb-8 animate-[floatUp_0.85s_ease-out]">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-500/35 bg-primary-500/15 text-primary-500 shadow-inner shadow-primary-700/25">
              <FileText className="w-7 h-7" />
            </div>
            <h1 className="auth-title text-4xl font-bold">
              Resume Builder
            </h1>
            <Sparkles className="w-6 h-6 text-primary-600 animate-pulse" />
          </div>
          <p className="auth-subtitle text-lg max-w-2xl mx-auto">
            Create a professional resume in minutes with AI assistance
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <StepIndicator 
              number={1} 
              label="Build Resume" 
              active={step === 'build'}
              completed={step === 'preview'}
            />
            <div className="w-24 h-1 bg-white/40 rounded-full backdrop-blur">
              <div 
                className={`h-full bg-gradient-to-r from-primary-600 to-primary-500 rounded-full transition-all duration-500 ${
                  step === 'preview' ? 'w-full' : 'w-0'
                }`}
              />
            </div>
            <StepIndicator 
              number={2} 
              label="Preview & Download" 
              active={step === 'preview'}
              completed={false}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column - Form/Input */}
          <div className="xl:col-span-8">
            {step === 'build' && (
              <ResumeBuilderForm
                initialData={resumeData}
                userProfile={userProfile}
                onSave={(data: any) => {
                  setResumeData(data);
                }}
                onPreview={(data: any) => {
                  setResumeData(data);
                  setStep('preview');
                }}
              />
            )}

            {step === 'preview' && resumeData && (
              <ResumePreview
                resumeData={resumeData}
                onEdit={() => setStep('build')}
                onDownload={() => {
                  // PDF download handled in ResumePreview component
                  console.log('Resume downloaded successfully');
                }}
              />
            )}
          </div>

          {/* Right Column - Tips */}
          <div className="xl:col-span-4 space-y-6">
            {/* Tips Card */}
            <div className="card border-primary-200/50 bg-gradient-to-br from-primary-50/50 to-white sticky top-6">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-primary-200/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30">
                  <TrendingUp className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Pro Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-secondary-700">
                <li className="flex items-start gap-2 p-2 rounded-lg hover:bg-primary-50/50 transition-colors duration-200">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use action verbs to start bullet points</span>
                </li>
                <li className="flex items-start gap-2 p-2 rounded-lg hover:bg-primary-50/50 transition-colors duration-200">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Quantify achievements with numbers</span>
                </li>
                <li className="flex items-start gap-2 p-2 rounded-lg hover:bg-primary-50/50 transition-colors duration-200">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Highlight relevant skills and experience</span>
                </li>
                <li className="flex items-start gap-2 p-2 rounded-lg hover:bg-primary-50/50 transition-colors duration-200">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Keep it concise (1-2 pages max)</span>
                </li>
                <li className="flex items-start gap-2 p-2 rounded-lg hover:bg-primary-50/50 transition-colors duration-200">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Proofread for spelling and grammar</span>
                </li>
              </ul>
            </div>

            {/* Best Practices */}
            <div className="card bg-gradient-to-br from-yellow-50/50 to-white border-yellow-200/50">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-yellow-200/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Best Practices</h3>
              </div>
              <ul className="space-y-2 text-sm text-secondary-700">
                <li className="flex items-start gap-2 p-2 rounded-lg hover:bg-yellow-50/50 transition-colors duration-200">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Include contact information at the top</span>
                </li>
                <li className="flex items-start gap-2 p-2 rounded-lg hover:bg-yellow-50/50 transition-colors duration-200">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>List work experience in reverse chronological order</span>
                </li>
                <li className="flex items-start gap-2 p-2 rounded-lg hover:bg-yellow-50/50 transition-colors duration-200">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Focus on achievements, not just responsibilities</span>
                </li>
                <li className="flex items-start gap-2 p-2 rounded-lg hover:bg-yellow-50/50 transition-colors duration-200">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Tailor your resume for each application</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ 
  number, 
  label, 
  active, 
  completed 
}: { 
  number: number; 
  label: string; 
  active: boolean; 
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
          active 
            ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white ring-4 ring-primary-200 shadow-lg shadow-primary-500/30' 
            : completed
            ? 'bg-gradient-to-br from-green-600 to-green-500 text-white shadow-lg'
            : 'bg-white/60 text-secondary-500 border border-white/40 backdrop-blur'
        }`}
      >
        {completed ? <CheckCircle className="w-6 h-6" /> : number}
      </div>
      <span className={`text-sm font-medium ${active ? 'text-primary-600' : 'text-secondary-500'}`}>
        {label}
      </span>
    </div>
  );
}
