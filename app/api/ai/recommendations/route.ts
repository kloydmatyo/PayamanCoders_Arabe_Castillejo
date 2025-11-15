import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { AIService } from '@/lib/ai';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import Job from '@/models/Job';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
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

    // Get active jobs
    const jobs = await Job.find({ status: 'active' })
      .limit(20)
      .lean();

    if (jobs.length === 0) {
      return NextResponse.json({
        success: true,
        recommendations: []
      });
    }

    // Calculate skill-based match scores (fast, no AI calls needed)
    const userSkills = (userProfile.profile?.skills || []).map((s: string) => s.toLowerCase());
    
    const jobsWithScores = jobs.map((job: any) => {
      const jobSkills = (job.skills || []).map((s: string) => s.toLowerCase());
      const matchingSkills = userSkills.filter((skill: string) => 
        jobSkills.some((jobSkill: string) => 
          jobSkill.includes(skill) || skill.includes(jobSkill)
        )
      );
      
      // Calculate match score based on skill overlap
      const skillMatchRatio = jobSkills.length > 0 
        ? (matchingSkills.length / jobSkills.length) * 100 
        : 0;
      
      // Boost score if user has more matching skills
      const userSkillRatio = userSkills.length > 0
        ? (matchingSkills.length / userSkills.length) * 100
        : 0;
      
      const matchScore = Math.round((skillMatchRatio * 0.7 + userSkillRatio * 0.3));
      
      // Generate match reason
      let matchReason = '';
      if (matchingSkills.length > 0) {
        const displaySkills = matchingSkills.slice(0, 3).join(', ');
        matchReason = `Strong match for your ${displaySkills}${matchingSkills.length > 3 ? ` and ${matchingSkills.length - 3} more` : ''} skills`;
      } else if (userSkills.length === 0) {
        matchReason = 'Add skills to your profile for better matches';
      } else {
        matchReason = 'Good opportunity to learn new skills';
      }
      
      return {
        ...job,
        matchScore: Math.min(matchScore, 99), // Cap at 99%
        matchReason,
        matchingSkills
      };
    });
    
    // Sort by match score (highest first)
    const sortedJobs = jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
    
    // Use AI to re-rank only the top candidates (optional, faster)
    let finalRecommendations = sortedJobs.slice(0, 10);
    
    // Try AI ranking for better results, but don't wait too long
    try {
      const aiRanked = await Promise.race([
        AIService.generateJobRecommendations(userProfile.profile, sortedJobs.slice(0, 15)),
        new Promise((resolve) => setTimeout(() => resolve(sortedJobs.slice(0, 10)), 3000))
      ]);
      
      if (Array.isArray(aiRanked) && aiRanked.length > 0) {
        // Merge AI ranking with our scores
        finalRecommendations = aiRanked.slice(0, 10).map((job: any) => {
          const scored = jobsWithScores.find((j: any) => j._id.toString() === job._id.toString());
          return scored || job;
        });
      }
    } catch (error) {
      console.log('AI ranking skipped, using skill-based ranking');
    }

    return NextResponse.json({
      success: true,
      recommendations: finalRecommendations
    });
  } catch (error) {
    console.error('AI recommendations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
