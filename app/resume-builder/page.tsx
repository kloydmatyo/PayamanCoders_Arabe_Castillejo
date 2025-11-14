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
import ATSScoreCard from '@/components/resume-builder/ATSScoreCard';
import JobDescriptionInput from '@/components/resume-builder/JobDescriptionInput';

export default function ResumeBuilderPage() {
  const [step, setStep] = useState<'job' | 'build' | 'preview'>('job');
  const [jobDescription, setJobDescription] = useState('');
  const [jobAnalysis, setJobAnalysis] = useState<any>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const [atsScore, setAtsScore] = useState<any>(null);

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
              Smart Resume Builder
            </h1>
            <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create a professional, ATS-optimized resume tailored to your target job in minutes
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <StepIndicator 
              number={1} 
              label="Job Description" 
              active={step === 'job'}
              completed={step !== 'job'}
            />
            <div className="w-16 h-1 bg-gray-300 rounded">
              <div 
                className={`h-full bg-purple-600 rounded transition-all ${
                  step !== 'job' ? 'w-full' : 'w-0'
                }`}
              />
            </div>
            <StepIndicator 
              number={2} 
              label="Build Resume" 
              active={step === 'build'}
              completed={step === 'preview'}
            />
            <div className="w-16 h-1 bg-gray-300 rounded">
              <div 
                className={`h-full bg-purple-600 rounded transition-all ${
                  step === 'preview' ? 'w-full' : 'w-0'
                }`}
              />
            </div>
            <StepIndicator 
              number={3} 
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
            {step === 'job' && (
              <JobDescriptionInput
                onAnalyze={(description, analysis) => {
                  setJobDescription(description);
                  setJobAnalysis(analysis);
                  setStep('build');
                }}
              />
            )}

            {step === 'build' && (
              <ResumeBuilderForm
                jobDescription={jobDescription}
                jobAnalysis={jobAnalysis}
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
                  // Download functionality
                  alert('Download feature coming soon!');
                }}
              />
            )}
          </div>

          {/* Right Column - AI Insights */}
          <div className="space-y-6">
            {/* ATS Score Card */}
            {resumeData && jobDescription && (
              <ATSScoreCard
                resumeData={resumeData}
                jobDescription={jobDescription}
                onScoreUpdate={setAtsScore}
              />
            )}

            {/* Job Analysis Card */}
            {jobAnalysis && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Job Insights
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Skills Required</h4>
                    <div className="flex flex-wrap gap-2">
                      {jobAnalysis.keySkills?.slice(0, 6).map((skill: string, idx: number) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">ATS Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {jobAnalysis.atsKeywords?.slice(0, 5).map((keyword: string, idx: number) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                  Match keywords from job description
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Keep it concise (1-2 pages max)
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
