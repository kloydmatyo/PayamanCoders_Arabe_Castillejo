'use client';

import { Download, Edit, FileText } from 'lucide-react';

interface ResumePreviewProps {
  resumeData: any;
  onEdit: () => void;
  onDownload: () => void;
}

export default function ResumePreview({ resumeData, onEdit, onDownload }: ResumePreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          Resume Preview
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Resume Content */}
      <div className="p-8 max-h-[700px] overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          {/* Personal Info */}
          <div className="text-center mb-6 pb-6 border-b-2 border-gray-300">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {resumeData.personalInfo.fullName || 'Your Name'}
            </h1>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
              {resumeData.personalInfo.email && (
                <span>{resumeData.personalInfo.email}</span>
              )}
              {resumeData.personalInfo.phone && (
                <span>• {resumeData.personalInfo.phone}</span>
              )}
              {resumeData.personalInfo.location && (
                <span>• {resumeData.personalInfo.location}</span>
              )}
            </div>
            {(resumeData.personalInfo.linkedin || resumeData.personalInfo.portfolio) && (
              <div className="flex flex-wrap justify-center gap-3 text-sm text-blue-600 mt-2">
                {resumeData.personalInfo.linkedin && (
                  <a href={resumeData.personalInfo.linkedin} className="hover:underline">
                    LinkedIn
                  </a>
                )}
                {resumeData.personalInfo.portfolio && (
                  <a href={resumeData.personalInfo.portfolio} className="hover:underline">
                    Portfolio
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Professional Summary */}
          {resumeData.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-300">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
            </div>
          )}

          {/* Skills */}
          {resumeData.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-300">
                SKILLS
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {resumeData.experience.length > 0 && resumeData.experience[0].title && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-300">
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-4">
                {resumeData.experience.map((exp: any, idx: number) => (
                  exp.title && (
                    <div key={idx}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-bold text-gray-900">{exp.title}</h3>
                          <p className="text-gray-700">{exp.company}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>{exp.location}</p>
                          <p>
                            {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            {' - '}
                            {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 mb-2">{exp.description}</p>
                      )}
                      {exp.achievements.some((a: string) => a.trim()) && (
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {exp.achievements.map((achievement: string, achIdx: number) => (
                            achievement.trim() && (
                              <li key={achIdx}>{achievement}</li>
                            )
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resumeData.education.length > 0 && resumeData.education[0].degree && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-300">
                EDUCATION
              </h2>
              <div className="space-y-3">
                {resumeData.education.map((edu: any, idx: number) => (
                  edu.degree && (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-gray-700">{edu.institution}</p>
                        {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{edu.location}</p>
                        <p>
                          {edu.graduationDate && new Date(edu.graduationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Note */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <p className="text-sm text-gray-600 text-center">
          💡 This is a preview. Download as PDF to get the final formatted version.
        </p>
      </div>
    </div>
  );
}
