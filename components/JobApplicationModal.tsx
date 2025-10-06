'use client';

import { useState, useEffect } from 'react';
import { X, Upload, File, AlertCircle, CheckCircle, User } from 'lucide-react';

interface ResumeData {
  filename: string;
  url: string;
  size: number;
  type?: string;
  uploadedAt: string;
}

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  company: string;
  onSuccess: () => void;
}

export default function JobApplicationModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  company,
  onSuccess,
}: JobApplicationModalProps) {
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch current resume when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCurrentResume();
      setCoverLetter('');
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  const fetchCurrentResume = async () => {
    try {
      const response = await fetch('/api/upload/resume', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.hasResume) {
          setCurrentResume(data.resume);
        }
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only PDF and DOCX files are allowed.',
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size too large. Maximum size is 10MB.',
      };
    }

    return { valid: true };
  };

  const handleFileUpload = async (file: File) => {
    setError('');
    setSuccess('');

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentResume(data.resume);
        setSuccess('Resume uploaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to upload resume');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleSubmitApplication = async () => {
    setError('');
    setSuccess('');

    // Check if resume is uploaded
    if (!currentResume) {
      setError('Please upload your resume before applying.');
      return;
    }

    // Check if cover letter is provided
    if (!coverLetter.trim()) {
      setError('Please provide a cover letter.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          coverLetter: coverLetter.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Application submitted successfully!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(data.error || 'Failed to submit application');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Apply for Position</h2>
            <p className="text-sm text-gray-600 mt-1">
              {jobTitle} at {company}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                {success}
              </div>
            </div>
          )}

          {/* Resume Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Upload your resume to complete your application. Only PDF and DOCX files are accepted (max 10MB).
            </p>

            {currentResume ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="h-8 w-8 text-blue-500" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{currentResume.filename}</h4>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(currentResume.size)} • {currentResume.type?.toUpperCase() || 'DOCUMENT'} • 
                        Uploaded {currentResume.uploadedAt ? new Date(currentResume.uploadedAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Ready</span>
                  </div>
                </div>
                
                {/* Replace Resume Option */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label htmlFor="resume-replace" className="cursor-pointer">
                    <span className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Replace Resume'}
                    </span>
                  </label>
                  <input
                    id="resume-replace"
                    name="resume-replace"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                </div>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      {uploading ? 'Uploading...' : 'Upload your resume'}
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      Drag and drop or click to select
                    </span>
                    <span className="mt-1 block text-xs text-gray-400">
                      PDF, DOCX up to 10MB
                    </span>
                  </label>
                  <input
                    id="resume-upload"
                    name="resume-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cover Letter Section */}
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Tell the employer why you're interested in this position and what makes you a great fit.
            </p>
            <textarea
              id="coverLetter"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Dear Hiring Manager,

I am writing to express my interest in the [Position Title] role at [Company Name]. With my background in [relevant experience/skills], I believe I would be a valuable addition to your team.

[Explain why you're interested in the role and company]

[Highlight relevant experience and achievements]

[Conclude with enthusiasm and next steps]

Thank you for considering my application. I look forward to hearing from you.

Best regards,
[Your Name]"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              disabled={loading}
            />
            <div className="mt-2 text-sm text-gray-500">
              {coverLetter.length}/2000 characters
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            <User className="inline h-4 w-4 mr-1" />
            Your application will be sent to the employer
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitApplication}
              disabled={loading || !currentResume || !coverLetter.trim()}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}