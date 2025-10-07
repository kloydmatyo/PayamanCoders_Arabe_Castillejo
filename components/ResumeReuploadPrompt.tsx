'use client';

import { useState } from 'react';
import { Upload, AlertTriangle, X } from 'lucide-react';

interface ResumeReuploadPromptProps {
  isOpen: boolean;
  onClose: () => void;
  applicantName: string;
  onReuploadSuccess?: () => void;
}

export default function ResumeReuploadPrompt({
  isOpen,
  onClose,
  applicantName,
  onReuploadSuccess
}: ResumeReuploadPromptProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Resume re-uploaded successfully');
        onReuploadSuccess?.();
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Resume Update Required
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            {applicantName}'s resume file has a compatibility issue and cannot be previewed. 
            This sometimes happens with older file uploads.
          </p>
          
          <p className="text-gray-600 mb-4">
            To resolve this issue, please ask {applicantName} to re-upload their resume 
            using the form below, or contact support for assistance.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> The original resume content is still available for download, 
              but cannot be previewed in the browser due to technical limitations.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Resume
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          {uploading && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Uploading...</span>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Trigger file input click
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                fileInput?.click();
              }}
              disabled={uploading}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}