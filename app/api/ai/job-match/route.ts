import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { AIService } from '@/lib/ai';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Job from '@/models/Job';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Get user profile
    const userProfile = await User.findById(user.userId);
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Calculate skill-based match (fast and reliable)
    const userSkills = (userProfile.profile?.skills || []).map((s: string) => s.toLowerCase());
    const jobSkills = (job.skills || []).map((s: string) => s.toLowerCase());
    
    const matchingSkills = userSkills.filter((skill: string) => 
      jobSkills.some((jobSkill: string) => 
        jobSkill.includes(skill) || skill.includes(jobSkill)
      )
    );
    
    // Calculate match score
    const skillMatchRatio = jobSkills.length > 0 
      ? (matchingSkills.length / jobSkills.length) * 100 
      : 0;
    
    const userSkillRatio = userSkills.length > 0
      ? (matchingSkills.length / userSkills.length) * 100
      : 0;
    
    const matchScore = Math.round((skillMatchRatio * 0.7 + userSkillRatio * 0.3));
    
    // Identify strengths and gaps
    const strengths = matchingSkills.length > 0
      ? matchingSkills.map((skill: string) => `Strong ${skill} skills`)
      : ['Eager to learn new skills'];
    
    const missingSkills = jobSkills.filter((skill: string) => 
      !userSkills.some((userSkill: string) => 
        skill.includes(userSkill) || userSkill.includes(skill)
      )
    );
    
    const gaps = missingSkills.length > 0
      ? missingSkills.slice(0, 3).map((skill: string) => `Consider learning ${skill}`)
      : ['No significant skill gaps identified'];
    
    // Generate reasoning
    let reasoning = '';
    if (matchingSkills.length > 0) {
      reasoning = `You match ${matchingSkills.length} of ${jobSkills.length} required skills (${matchingSkills.slice(0, 3).join(', ')}${matchingSkills.length > 3 ? ` and ${matchingSkills.length - 3} more` : ''})`;
    } else if (userSkills.length === 0) {
      reasoning = 'Add skills to your profile for better match analysis';
    } else {
      reasoning = 'This role offers an opportunity to expand your skill set';
    }
    
    const matchAnalysis = {
      score: Math.min(matchScore, 99),
      reasoning,
      strengths: strengths.slice(0, 3),
      gaps: gaps.slice(0, 3)
    };
    
    // Try to enhance with AI analysis (optional, with timeout)
    try {
      const aiAnalysis = await Promise.race([
        AIService.analyzeJobMatch(userProfile.profile, job),
        new Promise((resolve) => setTimeout(() => resolve(null), 2000))
      ]);
      
      if (aiAnalysis && typeof aiAnalysis === 'object' && 'score' in aiAnalysis) {
        // Use AI analysis if it provides a better score
        const aiScore = (aiAnalysis as any).score;
        if (aiScore > 0 && aiScore > matchScore) {
          return NextResponse.json({
            success: true,
            match: aiAnalysis
          });
        }
      }
    } catch (error) {
      console.log('AI enhancement skipped, using skill-based analysis');
    }

    return NextResponse.json({
      success: true,
      match: matchAnalysis
    });
  } catch (error) {
    console.error('Job match API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
