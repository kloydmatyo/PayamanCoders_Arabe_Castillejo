'use client';

import { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Resume Builder
            </h1>
            <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create a professional resume in minutes
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
            <div className="w-24 h-1 bg-gray-300 rounded">
              <div 
                className={`h-full bg-purple-600 rounded transition-all ${
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form/Input */}
          <div className="lg:col-span-2">
            {step === 'build' && (
              <ResumeBuilderForm
                initialData={resumeData}
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
          <div className="space-y-6">
            {/* Tips Card */}
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Pro Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Use action verbs to start bullet points
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Quantify achievements with numbers
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Highlight relevant skills and experience
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Keep it concise (1-2 pages max)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Proofread for spelling and grammar
                </li>
              </ul>
            </div>

            {/* Best Practices */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Best Practices
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  Include contact information at the top
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  List work experience in reverse chronological order
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  Focus on achievements, not just responsibilities
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  Tailor your resume for each application
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
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
          active 
            ? 'bg-purple-600 text-white ring-4 ring-purple-200' 
            : completed
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        {completed ? <CheckCircle className="w-5 h-5" /> : number}
      </div>
      <span className={`text-xs font-medium ${active ? 'text-purple-600' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );
}
