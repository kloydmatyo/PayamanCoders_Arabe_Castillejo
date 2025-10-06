'use client';

import { useState, useRef } from 'react';
import { Upload, File, Trash2, Download, AlertCircle, CheckCircle } from 'lucide-react';

interface ResumeData {
  filename: string;
  url: string;
  size: number;
  type?: string;
  uploadedAt: string;
}

interface ResumeUploadProps {
  currentResume?: ResumeData | null;
  onUploadSuccess?: (resume: ResumeData) => void;
  onDeleteSuccess?: () => void;
  className?: string;
}

export default function ResumeUpload({
  currentResume,
  onUploadSuccess,
  onDeleteSuccess,
  className = '',
}: ResumeUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
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
        setSuccess('Resume uploaded successfully!');
        onUploadSuccess?.(data.resume);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to upload resume');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!currentResume) return;

    setError('');
    setSuccess('');
    setDeleting(true);

    try {
      const response = await fetch('/api/upload/resume', {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Resume deleted successfully!');
        onDeleteSuccess?.();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete resume');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setDeleting(false);
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
      handleUpload(files[0]);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
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

      {/* Current Resume Display */}
      {currentResume ? (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
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
              <a
                href={currentResume.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Area */
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
              ref={fileInputRef}
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

      {/* Replace Resume Button */}
      {currentResume && (
        <div className="text-center">
          <label htmlFor="resume-replace" className="cursor-pointer">
            <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">
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
      )}
    </div>
  );
}