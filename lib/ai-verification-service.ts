import Bytez from 'bytez.js'

const getBytezClient = () => {
  const apiKey = process.env.BYTEZ_API_KEY
  if (!apiKey) {
    throw new Error('BYTEZ_API_KEY is not configured')
  }
  return new Bytez(apiKey)
}

interface CompanyVerificationData {
  companyName: string
  email: string
  website?: string
  businessRegistrationNumber?: string
  linkedInProfile?: string
  description?: string
  industry?: string
  founded?: string
  location?: string
  documents?: Array<{ type: string; url: string }>
}

interface AIVerificationResult {
  credibilityScore: number
  credibilityLevel: 'trusted' | 'conditional' | 'not_credible'
  recommendation: 'auto_approve' | 'manual_review' | 'reject'
  analysis: {
    strengths: string[]
    weaknesses: string[]
    riskFactors: string[]
    recommendations: string[]
  }
  checks: {
    hasValidRegistration: boolean
    hasProfessionalEmail: boolean
    hasOnlinePresence: boolean
    hasLegalDocumentation: boolean
    hasGoodReputation: boolean
  }
  reasoning: string
}

export class AIVerificationService {
  /**
   * Use AI to analyze company credibility and provide verification recommendation
   */
  static async analyzeCompanyCredibility(data: CompanyVerificationData): Promise<AIVerificationResult> {
    try {
      const prompt = `You are an expert company verification analyst. Analyze the following company information and provide a credibility assessment.

Company Information:
- Company Name: ${data.companyName}
- Email: ${data.email}
- Website: ${data.website || 'Not provided'}
- Business Registration: ${data.businessRegistrationNumber || 'Not provided'}
- LinkedIn: ${data.linkedInProfile || 'Not provided'}
- Description: ${data.description || 'Not provided'}
- Industry: ${data.industry || 'Not provided'}
- Founded: ${data.founded || 'Not provided'}
- Location: ${data.location || 'Not provided'}
- Documents Provided: ${data.documents?.length || 0}

Credibility Scoring Guidelines:
- Score 80-100: Trusted & Credible (Valid registration, professional email, established presence, legal docs, good reputation)
- Score 60-79: Conditionally Credible (New company, limited history, mixed reviews, missing some docs)
- Score 0-59: Not Credible (Missing registration, no official email, poor presence, no legal docs)

Analyze and provide:
1. Credibility Score (0-100)
2. Credibility Level (trusted/conditional/not_credible)
3. Recommendation (auto_approve/manual_review/reject)
4. Detailed analysis with strengths, weaknesses, risk factors, and recommendations
5. Verification checks (hasValidRegistration, hasProfessionalEmail, hasOnlinePresence, hasLegalDocumentation, hasGoodReputation)
6. Reasoning for your assessment

Respond in JSON format:
{
  "credibilityScore": number,
  "credibilityLevel": "trusted" | "conditional" | "not_credible",
  "recommendation": "auto_approve" | "manual_review" | "reject",
  "analysis": {
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "riskFactors": ["risk1", "risk2"],
    "recommendations": ["rec1", "rec2"]
  },
  "checks": {
    "hasValidRegistration": boolean,
    "hasProfessionalEmail": boolean,
    "hasOnlinePresence": boolean,
    "hasLegalDocumentation": boolean,
    "hasGoodReputation": boolean
  },
  "reasoning": "detailed explanation"
}`

      const model = getBytezClient().model('openai/gpt-4.1')
      const { error, output } = await model.run([
        { role: 'user', content: prompt }
      ])
      
      if (error) {
        console.error('AI verification error:', error)
        return this.fallbackAnalysis(data)
      }
      
      // Parse AI response
      const aiResponse = output || ''
      
      // Extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Failed to parse AI response')
      }
      
      const result: AIVerificationResult = JSON.parse(jsonMatch[0])
      
      // Validate and ensure proper structure
      return {
        credibilityScore: Math.min(100, Math.max(0, result.credibilityScore || 0)),
        credibilityLevel: result.credibilityLevel || 'not_credible',
        recommendation: result.recommendation || 'manual_review',
        analysis: {
          strengths: result.analysis?.strengths || [],
          weaknesses: result.analysis?.weaknesses || [],
          riskFactors: result.analysis?.riskFactors || [],
          recommendations: result.analysis?.recommendations || []
        },
        checks: {
          hasValidRegistration: result.checks?.hasValidRegistration || false,
          hasProfessionalEmail: result.checks?.hasProfessionalEmail || false,
          hasOnlinePresence: result.checks?.hasOnlinePresence || false,
          hasLegalDocumentation: result.checks?.hasLegalDocumentation || false,
          hasGoodReputation: result.checks?.hasGoodReputation || false
        },
        reasoning: result.reasoning || 'AI analysis completed'
      }
      
    } catch (error) {
      console.error('AI verification error:', error)
      
      // Fallback to basic analysis if AI fails
      return this.fallbackAnalysis(data)
    }
  }

  /**
   * Fallback analysis if AI service fails
   */
  private static fallbackAnalysis(data: CompanyVerificationData): AIVerificationResult {
    let score = 0
    const strengths: string[] = []
    const weaknesses: string[] = []
    const riskFactors: string[] = []

    // Check email domain
    const emailDomain = data.email.split('@')[1]
    const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
    const hasProfessionalEmail = !freeProviders.includes(emailDomain?.toLowerCase())
    
    if (hasProfessionalEmail) {
      score += 25
      strengths.push('Professional email domain')
    } else {
      weaknesses.push('Using free email provider')
      riskFactors.push('No corporate email domain')
    }

    // Check business registration
    const hasValidRegistration = !!data.businessRegistrationNumber && data.businessRegistrationNumber.length > 5
    if (hasValidRegistration) {
      score += 20
      strengths.push('Business registration provided')
    } else {
      weaknesses.push('No business registration number')
    }

    // Check online presence
    const hasOnlinePresence = !!(data.website || data.linkedInProfile)
    if (hasOnlinePresence) {
      score += 15
      strengths.push('Has online presence')
    } else {
      weaknesses.push('Limited online presence')
      riskFactors.push('No website or LinkedIn profile')
    }

    // Check documentation
    const hasLegalDocumentation = (data.documents?.length || 0) > 0
    if (hasLegalDocumentation) {
      score += 15
      strengths.push('Legal documents provided')
    } else {
      weaknesses.push('No supporting documents')
    }

    // Check company info completeness
    if (data.description && data.description.length > 50) {
      score += 10
      strengths.push('Detailed company description')
    }

    if (data.industry) {
      score += 5
      strengths.push('Industry specified')
    }

    if (data.founded) {
      score += 5
      strengths.push('Founded year provided')
    }

    if (data.location) {
      score += 5
      strengths.push('Location specified')
    }

    // Determine credibility level and recommendation
    let credibilityLevel: 'trusted' | 'conditional' | 'not_credible'
    let recommendation: 'auto_approve' | 'manual_review' | 'reject'

    if (score >= 80) {
      credibilityLevel = 'trusted'
      recommendation = 'auto_approve'
    } else if (score >= 60) {
      credibilityLevel = 'conditional'
      recommendation = 'manual_review'
    } else {
      credibilityLevel = 'not_credible'
      recommendation = score < 40 ? 'reject' : 'manual_review'
    }

    return {
      credibilityScore: score,
      credibilityLevel,
      recommendation,
      analysis: {
        strengths,
        weaknesses,
        riskFactors,
        recommendations: [
          score < 80 ? 'Provide additional documentation' : 'Company meets verification standards',
          !hasProfessionalEmail ? 'Use official company email domain' : '',
          !hasValidRegistration ? 'Submit business registration documents' : '',
          !hasOnlinePresence ? 'Establish online presence (website/LinkedIn)' : ''
        ].filter(Boolean)
      },
      checks: {
        hasValidRegistration,
        hasProfessionalEmail,
        hasOnlinePresence,
        hasLegalDocumentation,
        hasGoodReputation: score >= 70
      },
      reasoning: `Automated analysis based on provided information. Score: ${score}/100. ${
        score >= 80 ? 'Company meets all credibility criteria.' :
        score >= 60 ? 'Company shows promise but needs additional verification.' :
        'Company lacks sufficient credibility indicators.'
      }`
    }
  }

  /**
   * Get credibility level description
   */
  static getCredibilityDescription(level: string): string {
    switch (level) {
      case 'trusted':
        return 'Verified, credible, and trustworthy company with established presence and documentation.'
      case 'conditional':
        return 'Possibly credible but needs additional verification. May be a new company with limited history.'
      case 'not_credible':
        return 'Unverified or unreliable. Missing critical information and documentation.'
      default:
        return 'Unknown credibility level'
    }
  }

  /**
   * Get recommendation action description
   */
  static getRecommendationDescription(recommendation: string): string {
    switch (recommendation) {
      case 'auto_approve':
        return 'Company can be automatically verified based on strong credibility indicators.'
      case 'manual_review':
        return 'Company requires manual review by admin before approval.'
      case 'reject':
        return 'Company does not meet minimum credibility standards and should be rejected.'
      default:
        return 'Unknown recommendation'
    }
  }
}
