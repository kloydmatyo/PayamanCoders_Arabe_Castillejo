import Bytez from 'bytez.js';

// Initialize Bytez SDK for resume building
const getBytezClient = () => {
  const apiKey = process.env.BYTEZ_API_KEY;
  if (!apiKey) {
    throw new Error('BYTEZ_API_KEY is not configured');
  }
  return new Bytez(apiKey);
};

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary?: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: string[];
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}

export class ResumeBuilderAI {
  private static model = getBytezClient().model('openai/gpt-4.1');

  /**
   * Analyze job description and extract key requirements
   */
  static async analyzeJobDescription(jobDescription: string): Promise<{
    keySkills: string[];
    requiredExperience: string[];
    keywords: string[];
    industryStandards: string[];
    atsKeywords: string[];
  }> {
    try {
      const prompt = `Analyze this job description and extract key information for resume optimization.

JOB DESCRIPTION:
${jobDescription.substring(0, 2000)}

Respond in JSON format:
{
  "keySkills": ["skill1", "skill2", ...],
  "requiredExperience": ["experience1", "experience2", ...],
  "keywords": ["keyword1", "keyword2", ...],
  "industryStandards": ["standard1", "standard2", ...],
  "atsKeywords": ["ats_keyword1", "ats_keyword2", ...]
}`;

      const { error, output } = await this.model.run([
        { role: 'user', content: prompt }
      ]);

      if (error) {
        console.error('Job description analysis error:', error);
        return this.getFallbackJobAnalysis();
      }

      return JSON.parse(output);
    } catch (error) {
      console.error('Job description analysis error:', error);
      return this.getFallbackJobAnalysis();
    }
  }

  /**
   * Generate tailored professional summary
   */
  static async generateProfessionalSummary(
    userProfile: any,
    jobDescription: string
  ): Promise<string> {
    try {
      const prompt = `Write a compelling professional summary (3-4 sentences) for a resume.

CANDIDATE PROFILE:
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Experience: ${userProfile.experience || 'Not specified'}
- Education: ${userProfile.education || 'Not specified'}

TARGET JOB:
${jobDescription.substring(0, 500)}

Write a professional summary that highlights relevant skills and experience for this specific role.`;

      const { error, output } = await this.model.run([
        { role: 'user', content: prompt }
      ]);

      if (error) {
        return this.getFallbackSummary();
      }

      return output.trim();
    } catch (error) {
      console.error('Summary generation error:', error);
      return this.getFallbackSummary();
    }
  }

  /**
   * Optimize bullet points for experience section
   */
  static async optimizeBulletPoints(
    bulletPoints: string[],
    jobTitle: string,
    targetJobDescription: string
  ): Promise<string[]> {
    try {
      const prompt = `Optimize these resume bullet points to be more impactful and ATS-friendly.

CURRENT ROLE: ${jobTitle}
BULLET POINTS:
${bulletPoints.map((bp, i) => `${i + 1}. ${bp}`).join('\n')}

TARGET JOB:
${targetJobDescription.substring(0, 500)}

Rewrite each bullet point to:
- Start with strong action verbs
- Include quantifiable achievements where possible
- Use keywords from the target job
- Be concise and impactful (1-2 lines each)

Return as JSON array: ["bullet1", "bullet2", ...]`;

      const { error, output } = await this.model.run([
        { role: 'user', content: prompt }
      ]);

      if (error) {
        return bulletPoints;
      }

      return JSON.parse(output);
    } catch (error) {
      console.error('Bullet point optimization error:', error);
      return bulletPoints;
    }
  }

  /**
   * Suggest skills to add based on job description
   */
  static async suggestSkills(
    currentSkills: string[],
    jobDescription: string
  ): Promise<{
    matching: string[];
    missing: string[];
    recommended: string[];
  }> {
    try {
      const prompt = `Compare candidate skills with job requirements.

CANDIDATE SKILLS:
${currentSkills.join(', ')}

JOB DESCRIPTION:
${jobDescription.substring(0, 1000)}

Respond in JSON format:
{
  "matching": ["skills that match job requirements"],
  "missing": ["critical skills from job that candidate lacks"],
  "recommended": ["additional skills that would strengthen application"]
}`;

      const { error, output } = await this.model.run([
        { role: 'user', content: prompt }
      ]);

      if (error) {
        return {
          matching: currentSkills,
          missing: [],
          recommended: []
        };
      }

      return JSON.parse(output);
    } catch (error) {
      console.error('Skill suggestion error:', error);
      return {
        matching: currentSkills,
        missing: [],
        recommended: []
      };
    }
  }

  /**
   * Get ATS optimization score and suggestions
   */
  static async getATSScore(resumeData: ResumeData, jobDescription: string): Promise<{
    score: number;
    suggestions: string[];
    keywordMatches: number;
    totalKeywords: number;
  }> {
    try {
      const resumeText = this.resumeToText(resumeData);

      const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility.

RESUME:
${resumeText.substring(0, 2000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 1000)}

Respond in JSON format:
{
  "score": <number 0-100>,
  "suggestions": ["suggestion1", "suggestion2", ...],
  "keywordMatches": <number of matching keywords>,
  "totalKeywords": <total keywords in job description>
}`;

      const { error, output } = await this.model.run([
        { role: 'user', content: prompt }
      ]);

      if (error) {
        return {
          score: 70,
          suggestions: ['Add more keywords from job description', 'Use standard section headings'],
          keywordMatches: 5,
          totalKeywords: 10
        };
      }

      return JSON.parse(output);
    } catch (error) {
      console.error('ATS score error:', error);
      return {
        score: 70,
        suggestions: ['Add more keywords from job description'],
        keywordMatches: 5,
        totalKeywords: 10
      };
    }
  }

  /**
   * Suggest resume template based on job and industry
   */
  static async suggestTemplate(
    jobDescription: string,
    experienceLevel: string
  ): Promise<{
    templateName: string;
    reason: string;
    features: string[];
  }> {
    try {
      const prompt = `Recommend the best resume template for this job application.

JOB DESCRIPTION:
${jobDescription.substring(0, 500)}

EXPERIENCE LEVEL: ${experienceLevel}

Available templates:
1. Professional - Clean, traditional format for corporate roles
2. Modern - Contemporary design for tech and creative roles
3. Minimal - Simple, ATS-friendly for any industry
4. Creative - Bold design for design/marketing roles
5. Executive - Sophisticated format for senior positions

Respond in JSON format:
{
  "templateName": "<template name>",
  "reason": "<why this template is best>",
  "features": ["feature1", "feature2", ...]
}`;

      const { error, output } = await this.model.run([
        { role: 'user', content: prompt }
      ]);

      if (error) {
        return {
          templateName: 'Professional',
          reason: 'Versatile template suitable for most roles',
          features: ['ATS-friendly', 'Clean layout', 'Professional appearance']
        };
      }

      return JSON.parse(output);
    } catch (error) {
      console.error('Template suggestion error:', error);
      return {
        templateName: 'Professional',
        reason: 'Versatile template suitable for most roles',
        features: ['ATS-friendly', 'Clean layout']
      };
    }
  }

  /**
   * Get real-time feedback on resume section
   */
  static async getSectionFeedback(
    sectionName: string,
    sectionContent: string,
    jobDescription: string
  ): Promise<{
    score: number;
    feedback: string[];
    improvements: string[];
  }> {
    try {
      const prompt = `Provide feedback on this resume section.

SECTION: ${sectionName}
CONTENT:
${sectionContent}

TARGET JOB:
${jobDescription.substring(0, 500)}

Respond in JSON format:
{
  "score": <number 0-100>,
  "feedback": ["positive point 1", "positive point 2"],
  "improvements": ["improvement 1", "improvement 2"]
}`;

      const { error, output } = await this.model.run([
        { role: 'user', content: prompt }
      ]);

      if (error) {
        return {
          score: 75,
          feedback: ['Section is well-structured'],
          improvements: ['Consider adding more specific details']
        };
      }

      return JSON.parse(output);
    } catch (error) {
      console.error('Section feedback error:', error);
      return {
        score: 75,
        feedback: ['Section is well-structured'],
        improvements: ['Consider adding more specific details']
      };
    }
  }

  // Helper methods
  private static resumeToText(resumeData: ResumeData): string {
    let text = `${resumeData.personalInfo.fullName}\n`;
    text += `${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}\n\n`;
    
    if (resumeData.summary) {
      text += `SUMMARY\n${resumeData.summary}\n\n`;
    }

    text += `SKILLS\n${resumeData.skills.join(', ')}\n\n`;

    text += `EXPERIENCE\n`;
    resumeData.experience.forEach(exp => {
      text += `${exp.title} at ${exp.company}\n`;
      text += `${exp.description}\n`;
      exp.achievements.forEach(ach => text += `- ${ach}\n`);
      text += '\n';
    });

    return text;
  }

  private static getFallbackJobAnalysis() {
    return {
      keySkills: ['Communication', 'Problem Solving', 'Teamwork'],
      requiredExperience: ['Relevant work experience'],
      keywords: ['professional', 'experienced', 'skilled'],
      industryStandards: ['Professional communication', 'Technical proficiency'],
      atsKeywords: ['experience', 'skills', 'education']
    };
  }

  private static getFallbackSummary(): string {
    return 'Motivated professional with strong skills and experience seeking to contribute to organizational success.';
  }
}
