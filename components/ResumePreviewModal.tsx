'use client';

import { useState, useEffect } from 'react';
import { X, Download, AlertCircle, FileText } from 'lucide-react';

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl: string;
  filename: string;
  applicantName?: string;
}

export default function ResumePreviewModal({
  isOpen,
  onClose,
  resumeUrl,
  filename,
  applicantName = 'Applicant'
}: ResumePreviewModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (isOpen && resumeUrl) {
      generatePreviewUrl();
    }
  }, [isOpen, resumeUrl]);

  const generatePreviewUrl = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Original URL:', resumeUrl);
      
      if (resumeUrl.includes('cloudinary.com')) {
        // Extract the public ID from the Cloudinary URL
        const urlParts = resumeUrl.split('/');
        const uploadIndex = urlParts.findIndex(part => part === 'upload');
        
        if (uploadIndex === -1) {
          setError('Invalid Cloudinary URL format');
          return;
        }
        
        // Get everything after 'upload' and remove version/flags
        const pathAfterUpload = urlParts.slice(uploadIndex + 1);
        
        // Remove version numbers (v1234567890) and flags (fl_attachment, etc.)
        const cleanPath = pathAfterUpload.filter(part => 
          !part.startsWith('v') || !/^v\d+$/.test(part)
        ).filter(part => 
          !part.startsWith('fl_')
        );
        
        // Join to get the public ID and remove file extension
        let publicId = cleanPath.join('/');
        if (publicId.endsWith('.pdf')) {
          publicId = publicId.slice(0, -4);
        }
        
        console.log('📋 Extracted public ID:', publicId);
        
        // Use our API route instead of direct Cloudinary URL
        const apiUrl = `/api/files/resume/${encodeURIComponent(publicId)}`;
        console.log('🔗 Using API URL:', apiUrl);
        
        // Test the API URL before setting it
        try {
          const testResponse = await fetch(apiUrl);
          if (testResponse.status === 503) {
            const errorData = await testResponse.json();
            if (errorData.needsMigration) {
              setError('This resume file has a compatibility issue and cannot be previewed. Please ask the applicant to re-upload their resume, or use the download button to view it externally.');
              setLoading(false);
              return;
            }
          }
        } catch (testErr) {
          console.log('API test failed, will try to load anyway:', testErr);
        }
        
        setPreviewUrl(apiUrl);
      } else {
        // Non-Cloudinary URLs - use as-is
        console.log('📄 Using non-Cloudinary URL as-is');
        setPreviewUrl(resumeUrl);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('❌ Error generating preview URL:', err);
      setError('Failed to generate preview URL');
      setLoading(false);
    }
  };

  const handleIframeLoad = () => {
    console.log('✅ Document loaded successfully');
    setLoading(false);
    setError('');
  };

  const handleIframeError = async () => {
    console.log('❌ Document failed to load in iframe');
    
    // Check if this is a migration issue by testing the API endpoint
    if (previewUrl.includes('/api/files/resume/')) {
      try {
        const response = await fetch(previewUrl);
        if (response.status === 503) {
          const errorData = await response.json();
          if (errorData.needsMigration) {
            setError('This resume file has a compatibility issue and cannot be previewed. Please ask the applicant to re-upload their resume, or download the file to view it externally.');
            return;
          }
        } else if (response.status === 401) {
          setError('You do not have permission to view this resume.');
          return;
        } else if (response.status === 404) {
          setError('Resume file not found. It may have been deleted or moved.');
          return;
        }
      } catch (err) {
        console.log('Error checking API response:', err);
      }
    }
    
    setLoading(false);
    setError('Failed to load document. The file might not support inline viewing.');
  };

  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  };

  const downloadResume = () => {
    // Use the same API URL for download, but add download parameter
    let downloadUrl = previewUrl;
    
    if (resumeUrl.includes('cloudinary.com')) {
      // Extract public ID same way as preview
      const urlParts = resumeUrl.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      
      if (uploadIndex !== -1) {
        const pathAfterUpload = urlParts.slice(uploadIndex + 1);
        const cleanPath = pathAfterUpload.filter(part => 
          !part.startsWith('v') || !/^v\d+$/.test(part)
        ).filter(part => 
          !part.startsWith('fl_')
        );
        
        let publicId = cleanPath.join('/');
        if (publicId.endsWith('.pdf')) {
          publicId = publicId.slice(0, -4);
        }
        
        // Use API route with download parameter
        downloadUrl = `/api/files/resume/${encodeURIComponent(publicId)}?download=true`;
        console.log('📥 Download URL:', downloadUrl);
      }
    }
    
    // Create and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.target = '_blank';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const fileType = getFileType(filename);
  const isPDF = fileType === 'pdf';
  const isDoc = ['doc', 'docx'].includes(fileType);
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {applicantName}'s Resume
              </h3>
              <p className="text-sm text-gray-500">
                {filename} • {fileType.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={downloadResume}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading {fileType.toUpperCase()}...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center max-w-md mx-auto p-4">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Preview Not Available
                </h4>
                <p className="text-sm text-gray-600 mb-4">{error}</p>
                <div className="space-y-2">
                  <button
                    onClick={downloadResume}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download to View
                  </button>
                  {error.includes('compatibility issue') ? (
                    <button
                      onClick={() => {
                        // For now, just show a helpful message
                        alert(`Please contact ${applicantName} to re-upload their resume with a fresh PDF file. This will resolve the compatibility issue.`);
                      }}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      Request Re-upload
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setError('');
                        generatePreviewUrl();
                      }}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {!loading && !error && previewUrl && (
            <>
              {isPDF || isImage ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  title={`${applicantName}'s Resume`}
                  allow="fullscreen"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center max-w-md mx-auto p-4">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {isDoc ? 'Word Document' : 'Document'} Preview
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {isDoc 
                        ? 'Word documents cannot be previewed in the browser. Please download to view.' 
                        : 'This file type cannot be previewed in the browser. Please download to view.'
                      }
                    </p>
                    <button
                      onClick={downloadResume}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Debug Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="grid grid-cols-1 gap-2 text-xs text-gray-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <strong>Original:</strong> {resumeUrl}
              </div>
              <div>
                <strong>Preview:</strong> {previewUrl}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <strong>Type:</strong> {fileType.toUpperCase()}
              </div>
              <div>
                <strong>Supports Preview:</strong> {isPDF || isImage ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Status:</strong> {loading ? 'Loading' : error ? 'Error' : 'Ready'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}