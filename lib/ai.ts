import Bytez from 'bytez.js';

// Initialize Bytez SDK
const getBytezClient = () => {
  const apiKey = process.env.BYTEZ_API_KEY;
  if (!apiKey) {
    throw new Error('BYTEZ_API_KEY is not configured');
  }
  return new Bytez(apiKey);
};

// AI Service for job matching and recommendations
export class AIService {
  private static model = getBytezClient().model('openai/gpt-4.1');

  /**
   * Analyze job match score between user profile and job posting
   */
  static async analyzeJobMatch(userProfile: any, job: any): Promise<{
    score: number;
    reasoning: string;
    strengths: string[];
    gaps: string[];
  }> {
    try {
      const prompt = `Analyze the match between this candidate and job posting. Provide a match score (0-100) and detailed analysis.

CANDIDATE PROFILE:
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Experience: ${userProfile.experience || 'Not specified'}
- Education: ${userProfile.education || 'Not specified'}
- Location: ${userProfile.location || 'Not specified'}
- Availability: ${userProfile.availability || 'Not specified'}

JOB POSTING:
- Title: ${job.title}
- Company: ${job.company}
- Type: ${job.type}
- Required Skills: ${job.skills?.join(', ') || 'Not specified'}
- Requirements: ${job.requirements?.join(', ') || 'Not specified'}
- Location: ${job.location}
- Remote: ${job.remote ? 'Yes' : 'No'}

Respond in JSON format:
{
  "score": <number 0-100>,
  "reasoning": "<brief explanation>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "gaps": ["<gap 1>", "<gap 2>"]
}`;

      const { error, output } = await this.model.run([
        { role: 'user', content: prompt }
      ]);

      if (error) {
        console.error('AI job match error:', error);
        return this.getFallbackMatch();
      }

      // Handle both string and object responses
      let parsed;
      if (typeof output === 'string') {
        // Try to extract JSON from markdown code blocks if present
        const jsonMatch = output.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : output;
        parsed = JSON.parse(jsonStr);
      } else if (typeof output === 'object') {
        parsed = output;
      } else {
        console.error('Unexpected output type:', typeof output);
        return this.getFallbackMatch();
      }

      return {
        score: Math.min(100, Math.max(0, parsed.score || 0)),
        reasoning: parsed.reasoning || 'Match analysis completed',
        strengths: parsed.strengths || [],
        gaps: parsed.gaps || []
      };
    } catch (error) {
      console.error('Job match analysis error:', error);
      return this.getFallbackMatch();
    }
  }

  /**
   * Generate personalized job recommendations
   */
  static async generateJobRecommendations(userProfile: any, jobs: any[]): Promise<any[]> {
    try {
      const jobSummaries = jobs.map(job => ({
        id: job._id,
        title: job.title,
        company: job.company,
        skills: job.skills,
        type: job.type
      }));

      const prompt = `Based on this candidate's profile, rank these jobs by relevance (most relevant first).

CANDIDATE:
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Experience: ${userProfile.experience || 'Not specified'}
- Availability: ${userProfile.availability || 'Not specified'}

JOBS:
${JSON.stringify(jobSummaries, null, 2)}

Return only a JSON array of job IDs in order of relevance: ["id1", "id2", "id3"]`;

      const { error, output } = await this.model.run([
        { role: 'user', content: prompt }
      ]);

      if (error) {
        console.error('AI recommendation error:', error);
        return jobs;
      }

      // Handle both string and object/array responses
      let rankedIds;
      if (typeof output === 'string') {
        // Try to extract JSON array from markdown code blocks if present
        const jsonMatch = output.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : output;
        rankedIds = JSON.parse(jsonStr);
      } else if (Array.isArray(output)) {
        rankedIds = output;
      } else {
        console.error('Unexpected output type for recommendations:', typeof output);
        return jobs;
      }

      const rankedJobs = rankedIds
        .map((id: string) => jobs.find(job => job._id.toString() === id))
        .filter(Boolean);

      return rankedJobs.length > 0 ? rankedJobs : jobs;
    } catch (error) {
      console.error('Job recommendation error:', error);
      return jobs;
    }
  }

  /**
   * Analyze resume and provide improvement suggestions
   */
  static async analyzeResume(resumeText: string, targetJob?: any): Promise<{
    score: number;
    suggestions: string[];
    strengths: string[];
    keywords: string[];
  }> {
    try {
      const jobContext = targetJob 
        ? `\n\nTARGET JOB:\n- Title: ${targetJob.title}\n- Skills: ${targetJob.skills?.join(', ')}\n- Requirements: ${targetJob.requirements?.join(', ')}`
        : '';

      const prompt = `Analyze this resume and provide improvement suggestions.${jobContext}

RESUME CONTENT:
${resumeText.substring(0, 3000)}

Respond in JSON format:
{
  "score": <number 0-100>,
  "suggestions": ["<suggestion 1>", "<suggestion 2>"],
  "strengths": ["<strength 1>", "<strength 2>"],
  "keywords": ["<keyword 1>", "<keyword 2>"]
}`;

      const { error, output } = await this.model.run([
        { role: 'user', content: prompt }
      ]);

      if (error) {
        console.error('AI resume analysis error:', error);
        return this.getFallbackResumeAnalysis();
      }

      // Handle both string and object responses
      let parsed;
      if (typeof output === 'string') {
        const jsonMatch = output.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : output;
        parsed = JSON.parse(jsonStr);
      } else if (typeof output === 'object') {
        parsed = output;
      } else {
        return this.getFallbackResumeAnalysis();
      }

      return parsed;
    } catch (error) {
      console.error('Resume analysis error:', error);
      return this.getFallbackResumeAnalysis();
    }
  }

  /**
   * Generate interview preparation tips
   */
  static async generateInterviewTips(job: any, userProfile: any): Promise<string[]> {
    try {
      const prompt = `Generate 5 specific interview preparation tips for this candidate applying to this job.

JOB:
- Title: ${job.title}
- Company: ${job.company}
- Skills Required: ${job.skills?.join(', ')}

CANDIDATE:
- Skills: ${userProfile.skills?.join(', ')}
- Experience: ${userProfile.experience}

Return a JSON array of tips: ["tip1", "tip2", "tip3", "tip4", "tip5"]`;

      const { error, output } = await this.model.run([
        { role: 'user', content: prompt }
      ]);

      if (error) {
        return this.getFallbackInterviewTips();
      }

      return JSON.parse(output);
    } catch (error) {
      console.error('Interview tips generation error:', error);
      return this.getFallbackInterviewTips();
    }
  }

  /**
   * Generate cover letter suggestions
   */
  static async generateCoverLetterSuggestions(job: any, userProfile: any): Promise<string> {
    try {
      const prompt = `Write a professional cover letter for this candidate applying to this job.

JOB:
- Title: ${job.title}
- Company: ${job.company}
- Description: ${job.description?.substring(0, 500)}

CANDIDATE:
- Name: ${userProfile.firstName} ${userProfile.lastName}
- Skills: ${userProfile.skills?.join(', ')}
- Experience: ${userProfile.experience}

Write a concise, professional cover letter (200-300 words).`;

      const { error, output } = await this.model.run([
        { role: 'user', content: prompt }
      ]);

      if (error) {
        return this.getFallbackCoverLetter();
      }

      return output;
    } catch (error) {
      console.error('Cover letter generation error:', error);
      return this.getFallbackCoverLetter();
    }
  }

  // Fallback methods
  private static getFallbackMatch() {
    return {
      score: 50,
      reasoning: 'Basic match analysis unavailable',
      strengths: ['Profile matches some requirements'],
      gaps: ['AI analysis temporarily unavailable']
    };
  }

  private static getFallbackResumeAnalysis() {
    return {
      score: 70,
      suggestions: ['Add more specific achievements', 'Include relevant keywords'],
      strengths: ['Professional format'],
      keywords: ['skills', 'experience', 'education']
    };
  }

  private static getFallbackInterviewTips() {
    return [
      'Research the company thoroughly',
      'Prepare examples of your past work',
      'Practice common interview questions',
      'Prepare questions to ask the interviewer',
      'Review the job requirements carefully'
    ];
  }

  private static getFallbackCoverLetter() {
    return 'Dear Hiring Manager,\n\nI am writing to express my interest in this position. My skills and experience align well with the requirements, and I am excited about the opportunity to contribute to your team.\n\nThank you for your consideration.\n\nBest regards';
  }
}
