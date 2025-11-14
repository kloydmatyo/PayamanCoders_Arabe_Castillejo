'use client';

import { useState, useEffect } from 'react';
import { User, Briefcase, GraduationCap, Award, Code, Plus, Trash2, Sparkles, Save, Eye } from 'lucide-react';

interface ResumeBuilderFormProps {
  jobDescription: string;
  jobAnalysis: any;
  onSave: (data: any) => void;
  onPreview: (data: any) => void;
}

export default function ResumeBuilderForm({ 
  jobDescription, 
  jobAnalysis, 
  onSave, 
  onPreview 
}: ResumeBuilderFormProps) {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: ''
    },
    summary: '',
    experience: [{
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: ['']
    }],
    education: [{
      degree: '',
      institution: '',
      location: '',
      graduationDate: '',
      gpa: ''
    }],
    skills: [] as string[],
    certifications: [],
    projects: []
  });

  const [activeSection, setActiveSection] = useState('personal');
  const [aiLoading, setAiLoading] = useState(false);

  // Generate AI summary
  const generateSummary = async () => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/resume-builder/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        setResumeData(prev => ({ ...prev, summary: data.summary }));
      }
    } catch (error) {
      console.error('Summary generation error:', error);
    } finally {
      setAiLoading(false);
    }
  };

  // Optimize bullet points
  const optimizeBullets = async (expIndex: number) => {
    const exp = resumeData.experience[expIndex];
    if (!exp.achievements.some(a => a.trim())) return;

    setAiLoading(true);
    try {
      const response = await fetch('/api/resume-builder/optimize-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletPoints: exp.achievements.filter(a => a.trim()),
          jobTitle: exp.title,
          jobDescription
        }),
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        const newExperience = [...resumeData.experience];
        newExperience[expIndex].achievements = data.optimizedBullets;
        setResumeData(prev => ({ ...prev, experience: newExperience }));
      }
    } catch (error) {
      console.error('Bullet optimization error:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = () => {
    onSave(resumeData);
  };

  const handlePreview = () => {
    onPreview(resumeData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Section Tabs */}
      <div className="border-b border-gray-200 px-6 pt-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'personal', label: 'Personal Info', icon: User },
            { id: 'summary', label: 'Summary', icon: Sparkles },
            { id: 'experience', label: 'Experience', icon: Briefcase },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'skills', label: 'Skills', icon: Code }
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 max-h-[600px] overflow-y-auto">
        {/* Personal Info Section */}
        {activeSection === 'personal' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, email: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, phone: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, location: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="New York, NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={resumeData.personalInfo.linkedin}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio/Website
                </label>
                <input
                  type="url"
                  value={resumeData.personalInfo.portfolio}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, portfolio: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="johndoe.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* Summary Section */}
        {activeSection === 'summary' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
              <button
                onClick={generateSummary}
                disabled={aiLoading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                {aiLoading ? 'Generating...' : 'AI Generate'}
              </button>
            </div>

            <textarea
              value={resumeData.summary}
              onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Write a compelling 3-4 sentence summary highlighting your key qualifications and career goals..."
            />

            <p className="text-sm text-gray-500">
              💡 Tip: A strong summary should highlight your most relevant skills and experience for the target role.
            </p>
          </div>
        )}

        {/* Experience Section */}
        {activeSection === 'experience' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
              <button
                onClick={() => setResumeData(prev => ({
                  ...prev,
                  experience: [...prev.experience, {
                    title: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: '',
                    achievements: ['']
                  }]
                }))}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </button>
            </div>

            {resumeData.experience.map((exp, expIndex) => (
              <div key={expIndex} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900">Experience #{expIndex + 1}</h4>
                  {resumeData.experience.length > 1 && (
                    <button
                      onClick={() => setResumeData(prev => ({
                        ...prev,
                        experience: prev.experience.filter((_, i) => i !== expIndex)
                      }))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => {
                      const newExp = [...resumeData.experience];
                      newExp[expIndex].title = e.target.value;
                      setResumeData(prev => ({ ...prev, experience: newExp }));
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Job Title"
                  />

                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...resumeData.experience];
                      newExp[expIndex].company = e.target.value;
                      setResumeData(prev => ({ ...prev, experience: newExp }));
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Company Name"
                  />

                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => {
                      const newExp = [...resumeData.experience];
                      newExp[expIndex].location = e.target.value;
                      setResumeData(prev => ({ ...prev, experience: newExp }));
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Location"
                  />

                  <div className="flex gap-2">
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[expIndex].startDate = e.target.value;
                        setResumeData(prev => ({ ...prev, experience: newExp }));
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[expIndex].endDate = e.target.value;
                        setResumeData(prev => ({ ...prev, experience: newExp }));
                      }}
                      disabled={exp.current}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => {
                      const newExp = [...resumeData.experience];
                      newExp[expIndex].current = e.target.checked;
                      if (e.target.checked) newExp[expIndex].endDate = '';
                      setResumeData(prev => ({ ...prev, experience: newExp }));
                    }}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">I currently work here</span>
                </label>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Achievements</label>
                    <button
                      onClick={() => optimizeBullets(expIndex)}
                      disabled={aiLoading}
                      className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3" />
                      AI Optimize
                    </button>
                  </div>

                  {exp.achievements.map((achievement, achIndex) => (
                    <div key={achIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={achievement}
                        onChange={(e) => {
                          const newExp = [...resumeData.experience];
                          newExp[expIndex].achievements[achIndex] = e.target.value;
                          setResumeData(prev => ({ ...prev, experience: newExp }));
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="• Achieved X by doing Y, resulting in Z"
                      />
                      {exp.achievements.length > 1 && (
                        <button
                          onClick={() => {
                            const newExp = [...resumeData.experience];
                            newExp[expIndex].achievements = newExp[expIndex].achievements.filter((_, i) => i !== achIndex);
                            setResumeData(prev => ({ ...prev, experience: newExp }));
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const newExp = [...resumeData.experience];
                      newExp[expIndex].achievements.push('');
                      setResumeData(prev => ({ ...prev, experience: newExp }));
                    }}
                    className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Achievement
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education Section */}
        {activeSection === 'education' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Education</h3>
              <button
                onClick={() => setResumeData(prev => ({
                  ...prev,
                  education: [...prev.education, {
                    degree: '',
                    institution: '',
                    location: '',
                    graduationDate: '',
                    gpa: ''
                  }]
                }))}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </div>

            {resumeData.education.map((edu, eduIndex) => (
              <div key={eduIndex} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900">Education #{eduIndex + 1}</h4>
                  {resumeData.education.length > 1 && (
                    <button
                      onClick={() => setResumeData(prev => ({
                        ...prev,
                        education: prev.education.filter((_, i) => i !== eduIndex)
                      }))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[eduIndex].degree = e.target.value;
                      setResumeData(prev => ({ ...prev, education: newEdu }));
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Degree (e.g., Bachelor of Science in Computer Science)"
                  />

                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[eduIndex].institution = e.target.value;
                      setResumeData(prev => ({ ...prev, education: newEdu }));
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Institution Name"
                  />

                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[eduIndex].location = e.target.value;
                      setResumeData(prev => ({ ...prev, education: newEdu }));
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Location"
                  />

                  <input
                    type="month"
                    value={edu.graduationDate}
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[eduIndex].graduationDate = e.target.value;
                      setResumeData(prev => ({ ...prev, education: newEdu }));
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />

                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(e) => {
                      const newEdu = [...resumeData.education];
                      newEdu[eduIndex].gpa = e.target.value;
                      setResumeData(prev => ({ ...prev, education: newEdu }));
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="GPA (optional)"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
            
            {jobAnalysis?.keySkills && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="text-sm font-medium text-purple-900 mb-2">
                  💡 Recommended Skills from Job Description
                </h4>
                <div className="flex flex-wrap gap-2">
                  {jobAnalysis.keySkills.map((skill: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!resumeData.skills.includes(skill)) {
                          setResumeData(prev => ({
                            ...prev,
                            skills: [...prev.skills, skill]
                          }));
                        }
                      }}
                      className="px-3 py-1 bg-white border border-purple-300 text-purple-700 rounded-full text-sm hover:bg-purple-100 transition-colors"
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Skills
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {resumeData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => setResumeData(prev => ({
                        ...prev,
                        skills: prev.skills.filter((_, i) => i !== idx)
                      }))}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  id="skillInput"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Type a skill and press Enter"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget;
                      const skill = input.value.trim();
                      if (skill && !resumeData.skills.includes(skill)) {
                        setResumeData(prev => ({
                          ...prev,
                          skills: [...prev.skills, skill]
                        }));
                        input.value = '';
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('skillInput') as HTMLInputElement;
                    const skill = input.value.trim();
                    if (skill && !resumeData.skills.includes(skill)) {
                      setResumeData(prev => ({
                        ...prev,
                        skills: [...prev.skills, skill]
                      }));
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          <Save className="w-5 h-5" />
          Save Draft
        </button>
        <button
          onClick={handlePreview}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium"
        >
          <Eye className="w-5 h-5" />
          Preview Resume
        </button>
      </div>
    </div>
  );
}
