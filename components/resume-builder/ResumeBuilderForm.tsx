'use client';

import { useState, useEffect } from 'react';
import { User, Briefcase, GraduationCap, Award, Code, Plus, Trash2, Sparkles, Save, Eye } from 'lucide-react';

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  profilePicture: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: any[];
  projects: any[];
}

interface ResumeBuilderFormProps {
  initialData?: ResumeData;
  userProfile?: any;
  onSave: (data: ResumeData) => void;
  onPreview: (data: ResumeData) => void;
}

// Predefined options for resume fields
const JOB_TITLES_BY_CATEGORY = {
  'Technology': [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile Developer',
    'Data Scientist',
    'Data Analyst',
    'DevOps Engineer',
    'QA Engineer',
    'UI/UX Designer',
    'Product Manager',
    'Technical Lead',
    'System Administrator',
    'Database Administrator',
    'Security Engineer',
    'Cloud Architect'
  ],
  'Business': [
    'Business Analyst',
    'Project Manager',
    'Product Manager',
    'Marketing Manager',
    'Sales Manager',
    'Account Executive',
    'Business Development Manager',
    'Operations Manager',
    'HR Manager',
    'Recruiter',
    'Customer Success Manager'
  ],
  'Finance': [
    'Financial Analyst',
    'Accountant',
    'Auditor',
    'Investment Banker',
    'Financial Advisor',
    'Tax Consultant',
    'Budget Analyst',
    'Credit Analyst'
  ],
  'Healthcare': [
    'Registered Nurse',
    'Medical Assistant',
    'Healthcare Administrator',
    'Physician',
    'Pharmacist',
    'Physical Therapist',
    'Medical Technologist'
  ],
  'Education': [
    'Teacher',
    'Professor',
    'Academic Advisor',
    'Curriculum Developer',
    'Education Coordinator',
    'School Administrator'
  ],
  'Creative': [
    'Graphic Designer',
    'Content Writer',
    'Video Editor',
    'Photographer',
    'Art Director',
    'Creative Director',
    'Copywriter',
    'Social Media Manager'
  ]
};

const DEGREE_TYPES = [
  'High School Diploma',
  'Associate Degree',
  'Bachelor of Science (BS)',
  'Bachelor of Arts (BA)',
  'Bachelor of Engineering (BE)',
  'Bachelor of Technology (BTech)',
  'Bachelor of Business Administration (BBA)',
  'Bachelor of Commerce (BCom)',
  'Master of Science (MS)',
  'Master of Arts (MA)',
  'Master of Business Administration (MBA)',
  'Master of Engineering (ME)',
  'Master of Technology (MTech)',
  'Doctor of Philosophy (PhD)',
  'Doctor of Medicine (MD)',
  'Juris Doctor (JD)',
  'Other'
];

const FIELDS_OF_STUDY = [
  'Computer Science',
  'Information Technology',
  'Software Engineering',
  'Data Science',
  'Artificial Intelligence',
  'Cybersecurity',
  'Business Administration',
  'Marketing',
  'Finance',
  'Accounting',
  'Economics',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Psychology',
  'Biology',
  'Chemistry',
  'Physics',
  'Mathematics',
  'Statistics',
  'English Literature',
  'Communications',
  'Journalism',
  'Nursing',
  'Medicine',
  'Pharmacy',
  'Education',
  'Law',
  'Political Science',
  'Sociology',
  'Other'
];

const SKILLS_BY_CATEGORY = {
  'Programming Languages': [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 
    'Ruby', 'Go', 'Swift', 'Kotlin', 'TypeScript', 'Rust',
    'Scala', 'R', 'MATLAB', 'Perl'
  ],
  'Web Development': [
    'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js',
    'Django', 'Flask', 'Spring Boot', 'HTML', 'CSS', 'Sass',
    'Bootstrap', 'Tailwind CSS', 'Next.js', 'Nuxt.js'
  ],
  'Mobile Development': [
    'React Native', 'Flutter', 'iOS Development', 'Android Development',
    'Xamarin', 'Ionic', 'Swift', 'Kotlin'
  ],
  'Databases': [
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle',
    'SQL Server', 'Firebase', 'DynamoDB', 'Cassandra', 'SQLite'
  ],
  'Cloud & DevOps': [
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
    'Jenkins', 'GitLab CI', 'GitHub Actions', 'Terraform', 'Ansible',
    'CircleCI', 'Travis CI'
  ],
  'Data Science & AI': [
    'Machine Learning', 'Deep Learning', 'TensorFlow',
    'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'NLP',
    'Computer Vision', 'Data Visualization', 'Tableau', 'Power BI'
  ],
  'Soft Skills': [
    'Communication', 'Leadership', 'Problem Solving',
    'Team Collaboration', 'Time Management', 'Critical Thinking',
    'Adaptability', 'Creativity', 'Conflict Resolution',
    'Public Speaking', 'Negotiation', 'Emotional Intelligence'
  ],
  'Business Skills': [
    'Project Management', 'Agile/Scrum', 'Strategic Planning',
    'Business Analysis', 'Financial Analysis', 'Marketing Strategy',
    'Sales', 'Customer Service', 'Negotiation', 'Risk Management',
    'Change Management', 'Stakeholder Management'
  ],
  'Design': [
    'Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Sketch',
    'Adobe XD', 'InDesign', 'UI Design', 'UX Design',
    'Wireframing', 'Prototyping', 'User Research'
  ]
};

const PROFICIENCY_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
];

const COMMON_COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta (Facebook)',
  'Netflix', 'Tesla', 'IBM', 'Oracle', 'Salesforce',
  'Adobe', 'Intel', 'Cisco', 'SAP', 'Accenture',
  'Deloitte', 'PwC', 'EY', 'KPMG', 'McKinsey & Company',
  'Goldman Sachs', 'JPMorgan Chase', 'Bank of America',
  'Startup', 'Small Business', 'Freelance', 'Other'
];

const COMMON_UNIVERSITIES = [
  'Massachusetts Institute of Technology (MIT)',
  'Stanford University',
  'Harvard University',
  'University of California, Berkeley',
  'Carnegie Mellon University',
  'University of Oxford',
  'University of Cambridge',
  'California Institute of Technology (Caltech)',
  'Princeton University',
  'Yale University',
  'Columbia University',
  'University of Chicago',
  'Cornell University',
  'University of Pennsylvania',
  'University of Michigan',
  'State University',
  'Community College',
  'Technical Institute',
  'Online University',
  'Other'
];

export default function ResumeBuilderForm({ 
  initialData,
  userProfile,
  onSave, 
  onPreview 
}: ResumeBuilderFormProps) {
  // Pre-populate resume data from user profile if available
  const getInitialData = (): ResumeData => {
    if (initialData) return initialData;
    
    // If user profile exists, pre-populate fields
    if (userProfile) {
      return {
        personalInfo: {
          fullName: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim(),
          email: userProfile.email || '',
          phone: userProfile.contactNumber || '',
          location: userProfile.profile?.location || userProfile.address || '',
          linkedin: '',
          portfolio: '',
          profilePicture: userProfile.profile?.profilePicture || ''
        },
        summary: userProfile.profile?.bio || '',
        experience: userProfile.profile?.experience ? [{
          title: '',
          company: '',
          location: userProfile.profile?.location || '',
          startDate: '',
          endDate: '',
          current: false,
          description: userProfile.profile.experience,
          achievements: userProfile.profile.experience.split('\n').filter((line: string) => line.trim().startsWith('-') || line.trim().startsWith('•')).map((line: string) => line.replace(/^[-•]\s*/, '').trim()).filter((line: string) => line.length > 0)
        }] : [{
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          achievements: ['']
        }],
        education: userProfile.profile?.education ? [{
          degree: '',
          institution: '',
          location: userProfile.profile?.location || '',
          graduationDate: '',
          gpa: ''
        }] : [{
          degree: '',
          institution: '',
          location: '',
          graduationDate: '',
          gpa: ''
        }],
        skills: userProfile.profile?.skills || [],
        certifications: [],
        projects: []
      };
    }
    
    // Default empty data
    return {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
        profilePicture: ''
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
    };
  };

  const [resumeData, setResumeData] = useState<ResumeData>(getInitialData());

  const [activeSection, setActiveSection] = useState('personal');
  const [aiLoading, setAiLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Update resume data when user profile changes
  useEffect(() => {
    if (userProfile && !initialData) {
      setResumeData(getInitialData());
    }
  }, [userProfile]);

  // Generate AI summary
  const generateSummary = async () => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/resume-builder/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          personalInfo: resumeData.personalInfo,
          experience: resumeData.experience,
          skills: resumeData.skills
        }),
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
          jobTitle: exp.title
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

  const sections = ['personal', 'summary', 'experience', 'education', 'skills'];

  const handleSave = () => {
    onSave(resumeData);
  };

  const handleNext = () => {
    const currentIndex = sections.indexOf(activeSection);
    
    // Validate current section before moving to next
    if (activeSection === 'personal') {
      if (!resumeData.personalInfo.profilePicture) {
        alert('Please upload a profile picture before continuing.');
        return;
      }
      if (!resumeData.personalInfo.fullName || !resumeData.personalInfo.email || 
          !resumeData.personalInfo.phone || !resumeData.personalInfo.location) {
        alert('Please fill in all required personal information fields.');
        return;
      }
    }
    
    // Move to next section or preview
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1]);
    } else {
      // Last section, go to preview
      onPreview(resumeData);
    }
  };

  const handlePreview = () => {
    // Validate required fields
    if (!resumeData.personalInfo.profilePicture) {
      alert('Please upload a profile picture before previewing your resume.');
      setActiveSection('personal');
      return;
    }
    
    if (!resumeData.personalInfo.fullName || !resumeData.personalInfo.email || 
        !resumeData.personalInfo.phone || !resumeData.personalInfo.location) {
      alert('Please fill in all required personal information fields.');
      setActiveSection('personal');
      return;
    }
    
    onPreview(resumeData);
  };

  return (
    <div className="card relative overflow-hidden group/form hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/form:opacity-100 transition-opacity duration-500" aria-hidden="true"></div>
      
      {/* Section Tabs */}
      <div className="relative border-b border-primary-500/20 px-8 pt-8 bg-gradient-to-r from-primary-500/5 via-white/50 to-secondary-500/5">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
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
              className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap group/tab ${
                activeSection === section.id
                  ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/40 scale-105'
                  : 'bg-white/60 text-secondary-600 hover:bg-white hover:text-primary-600 hover:shadow-md border border-white/40 backdrop-blur'
              }`}
            >
              <section.icon className={`w-5 h-5 transition-transform duration-300 ${
                activeSection === section.id ? 'scale-110' : 'group-hover/tab:scale-110'
              }`} />
              <span className="text-sm">{section.label}</span>
              {activeSection === section.id && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8 max-h-[800px] overflow-y-auto custom-scrollbar">
        {/* Personal Info Section */}
        {activeSection === 'personal' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            

            {/* Profile Picture Upload */}
            <div className="mb-6 p-6 bg-gradient-to-br from-primary-50/50 to-secondary-50/50 rounded-2xl border-2 border-primary-200/50 hover:border-primary-300/70 transition-all duration-300 group/upload">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture *
              </label>
              <p className="text-xs text-gray-600 mb-3">
                Please upload a professional headshot for your resume
              </p>
              <div className="flex items-center gap-4">
                {resumeData.personalInfo.profilePicture ? (
                  <div className="relative">
                    <img
                      src={resumeData.personalInfo.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <button
                      onClick={() => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, profilePicture: '' }
                      }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <User className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-red-100 border-2 border-red-300 flex items-center justify-center">
                    <User className="w-12 h-12 text-red-400" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    id="profilePicture"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadingPhoto(true);
                        try {
                          // Convert to base64 for preview
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setResumeData(prev => ({
                              ...prev,
                              personalInfo: { ...prev.personalInfo, profilePicture: reader.result as string }
                            }));
                          };
                          reader.readAsDataURL(file);
                        } catch (error) {
                          console.error('Photo upload error:', error);
                        } finally {
                          setUploadingPhoto(false);
                        }
                      }
                    }}
                  />
                  <label
                    htmlFor="profilePicture"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    {uploadingPhoto ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4" />
                        Upload Photo
                      </>
                    )}
                  </label>
                  <p className="text-xs text-red-600 font-medium mt-1">
                    Required: Professional headshot, square format
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-bold text-primary-600 mb-2 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border-2 border-primary-500/30 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 bg-white/70 backdrop-blur transition-all duration-300 group-hover:border-primary-500/50 font-medium"
                  placeholder="John Doe"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-primary-600 mb-2 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                  Email *
                </label>
                <input
                  type="email"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, email: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border-2 border-primary-500/30 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 bg-white/70 backdrop-blur transition-all duration-300 group-hover:border-primary-500/50 font-medium"
                  placeholder="john@example.com"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-primary-600 mb-2 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                  Phone *
                </label>
                <input
                  type="tel"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, phone: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border-2 border-primary-500/30 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 bg-white/70 backdrop-blur transition-all duration-300 group-hover:border-primary-500/50 font-medium"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-primary-600 mb-2 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                  Location *
                </label>
                <input
                  type="text"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, location: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border-2 border-primary-500/30 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 bg-white/70 backdrop-blur transition-all duration-300 group-hover:border-primary-500/50 font-medium"
                  placeholder="New York, NY"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-secondary-600 mb-2">
                  LinkedIn (Optional)
                </label>
                <input
                  type="url"
                  value={resumeData.personalInfo.linkedin}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border-2 border-secondary-500/20 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 bg-white/70 backdrop-blur transition-all duration-300 group-hover:border-secondary-500/40 font-medium"
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-secondary-600 mb-2">
                  Portfolio/Website (Optional)
                </label>
                <input
                  type="url"
                  value={resumeData.personalInfo.portfolio}
                  onChange={(e) => setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, portfolio: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border-2 border-secondary-500/20 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 bg-white/70 backdrop-blur transition-all duration-300 group-hover:border-secondary-500/40 font-medium"
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
              className="w-full h-40 px-4 py-3 border-2 border-primary-500/30 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 bg-white/70 backdrop-blur resize-none transition-all duration-300 hover:border-primary-500/50 font-medium"
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
              <div key={expIndex} className="p-6 border-2 border-primary-500/20 rounded-2xl space-y-5 bg-gradient-to-br from-white/80 to-primary-50/30 backdrop-blur hover:border-primary-500/40 hover:shadow-lg transition-all duration-300 group/exp">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title *
                    </label>
                    <select
                      value={exp.title}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[expIndex].title = e.target.value;
                        setResumeData(prev => ({ ...prev, experience: newExp }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Job Title</option>
                      {Object.entries(JOB_TITLES_BY_CATEGORY).map(([category, titles]) => (
                        <optgroup key={category} label={category}>
                          {titles.map(title => (
                            <option key={title} value={title}>{title}</option>
                          ))}
                        </optgroup>
                      ))}
                      <option value="custom">Other (Type Custom)</option>
                    </select>
                    {exp.title === 'custom' && (
                      <input
                        type="text"
                        placeholder="Enter custom job title"
                        onChange={(e) => {
                          const newExp = [...resumeData.experience];
                          newExp[expIndex].title = e.target.value;
                          setResumeData(prev => ({ ...prev, experience: newExp }));
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mt-2"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[expIndex].company = e.target.value;
                        setResumeData(prev => ({ ...prev, experience: newExp }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Google, Microsoft, Acme Corp"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the name of the company or organization
                    </p>
                  </div>

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
              <div key={eduIndex} className="p-6 border-2 border-primary-500/20 rounded-2xl space-y-5 bg-gradient-to-br from-white/80 to-primary-50/30 backdrop-blur hover:border-primary-500/40 hover:shadow-lg transition-all duration-300 group/edu">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree Type *
                    </label>
                    <select
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...resumeData.education];
                        newEdu[eduIndex].degree = e.target.value;
                        setResumeData(prev => ({ ...prev, education: newEdu }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Degree Type</option>
                      {DEGREE_TYPES.map(degree => (
                        <option key={degree} value={degree}>{degree}</option>
                      ))}
                    </select>
                    {edu.degree === 'Other' && (
                      <input
                        type="text"
                        placeholder="Enter custom degree"
                        onChange={(e) => {
                          const newEdu = [...resumeData.education];
                          newEdu[eduIndex].degree = e.target.value;
                          setResumeData(prev => ({ ...prev, education: newEdu }));
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mt-2"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field of Study *
                    </label>
                    <select
                      value={edu.location}
                      onChange={(e) => {
                        const newEdu = [...resumeData.education];
                        newEdu[eduIndex].location = e.target.value;
                        setResumeData(prev => ({ ...prev, education: newEdu }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Field of Study</option>
                      {FIELDS_OF_STUDY.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </select>
                    {edu.location === 'Other' && (
                      <input
                        type="text"
                        placeholder="Enter custom field"
                        onChange={(e) => {
                          const newEdu = [...resumeData.education];
                          newEdu[eduIndex].location = e.target.value;
                          setResumeData(prev => ({ ...prev, education: newEdu }));
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mt-2"
                      />
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution Name *
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEdu = [...resumeData.education];
                        newEdu[eduIndex].institution = e.target.value;
                        setResumeData(prev => ({ ...prev, education: newEdu }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Massachusetts Institute of Technology (MIT)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your university, college, or educational institution name
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Graduation Date *
                    </label>
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
                  </div>

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
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>

            {/* Selected Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Selected Skills
              </label>
              <div className="flex flex-wrap gap-2 mb-3 min-h-[60px] p-3 border border-gray-200 rounded-lg bg-gray-50">
                {resumeData.skills.length === 0 ? (
                  <p className="text-gray-400 text-sm">No skills selected yet. Choose from categories below.</p>
                ) : (
                  resumeData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-2"
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
                  ))
                )}
              </div>
            </div>

            {/* Skill Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Skills by Category
              </label>
              <div className="space-y-4">
                {Object.entries(SKILLS_BY_CATEGORY).map(([category, skills]) => (
                  <div key={category} className="border-2 border-primary-500/20 rounded-2xl p-6 bg-gradient-to-br from-white/80 to-primary-50/30 backdrop-blur hover:border-primary-500/40 hover:shadow-lg transition-all duration-300">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-base">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30">
                        <Code className="w-5 h-5 text-primary-600" />
                      </div>
                      {category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => {
                        const isSelected = resumeData.skills.includes(skill);
                        return (
                          <button
                            key={skill}
                            onClick={() => {
                              if (isSelected) {
                                setResumeData(prev => ({
                                  ...prev,
                                  skills: prev.skills.filter(s => s !== skill)
                                }));
                              } else {
                                setResumeData(prev => ({
                                  ...prev,
                                  skills: [...prev.skills, skill]
                                }));
                              }
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                              isSelected
                                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/40 scale-105 border-2 border-primary-400'
                                : 'bg-white border-2 border-primary-500/20 text-gray-700 hover:border-primary-400 hover:bg-primary-50 hover:scale-105 hover:shadow-md'
                            }`}
                          >
                            {isSelected && '✓ '}
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Skill Input */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Custom Skill (Not in the list above)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="skillInput"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Type a custom skill and press Enter or click Add"
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="relative border-t border-primary-500/20 px-8 py-6 bg-gradient-to-r from-primary-500/5 via-white/50 to-secondary-500/5 flex gap-4">
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-white/80 text-secondary-700 rounded-xl hover:bg-white hover:shadow-lg border-2 border-secondary-500/30 hover:border-secondary-500/50 transition-all duration-300 font-semibold group"
        >
          <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          <span>Save Draft</span>
        </button>
        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white rounded-xl hover:shadow-xl hover:shadow-primary-500/50 hover:scale-[1.02] transition-all duration-300 font-bold group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000" aria-hidden="true"></div>
          {activeSection === 'skills' ? (
            <>
              <Eye className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative z-10">Preview Resume</span>
            </>
          ) : (
            <>
              <span className="relative z-10">Next Section</span>
              <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
