import dns from 'dns'
import { promisify } from 'util'

const resolveMx = promisify(dns.resolveMx)

interface VerificationResult {
  passed: boolean
  score: number
  checks: {
    emailDomainVerified: boolean
    businessRegistryChecked: boolean
    linkedInVerified: boolean
    websiteVerified: boolean
    manualReviewRequired: boolean
  }
  flags: Array<{
    type: string
    description: string
  }>
}

export class VerificationService {
  /**
   * Verify email domain has valid MX records
   */
  static async verifyEmailDomain(email: string): Promise<boolean> {
    try {
      const domain = email.split('@')[1]
      if (!domain) return false

      // Check for common free email providers
      const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com']
      if (freeProviders.includes(domain.toLowerCase())) {
        return false
      }

      // Verify MX records exist
      const mxRecords = await resolveMx(domain)
      return mxRecords && mxRecords.length > 0
    } catch (error) {
      console.error('Email domain verification error:', error)
      return false
    }
  }

  /**
   * Check if website domain matches email domain
   */
  static verifyDomainMatch(email: string, website: string): boolean {
    try {
      const emailDomain = email.split('@')[1]?.toLowerCase()
      const websiteUrl = new URL(website.startsWith('http') ? website : `https://${website}`)
      const websiteDomain = websiteUrl.hostname.replace('www.', '').toLowerCase()

      return emailDomain === websiteDomain
    } catch (error) {
      console.error('Domain match verification error:', error)
      return false
    }
  }

  /**
   * Validate LinkedIn profile URL format
   */
  static validateLinkedInProfile(url: string): boolean {
    try {
      const linkedInPattern = /^https?:\/\/(www\.)?linkedin\.com\/(company|in)\/.+/i
      return linkedInPattern.test(url)
    } catch (error) {
      return false
    }
  }

  /**
   * Check for suspicious patterns in company information
   */
  static detectSuspiciousPatterns(data: {
    companyName?: string
    website?: string
    description?: string
    email?: string
  }): Array<{ type: string; description: string }> {
    const flags: Array<{ type: string; description: string }> = []

    // Check for generic/suspicious company names
    const suspiciousNames = ['test', 'fake', 'demo', 'sample', 'example']
    if (data.companyName) {
      const nameLower = data.companyName.toLowerCase()
      if (suspiciousNames.some(word => nameLower.includes(word))) {
        flags.push({
          type: 'pattern_mismatch',
          description: 'Company name contains suspicious keywords'
        })
      }
    }

    // Check for very short descriptions
    if (data.description && data.description.length < 50) {
      flags.push({
        type: 'pattern_mismatch',
        description: 'Company description is too short'
      })
    }

    // Check for missing website
    if (!data.website || data.website.trim() === '') {
      flags.push({
        type: 'pattern_mismatch',
        description: 'No company website provided'
      })
    }

    return flags
  }

  /**
   * Calculate trust score based on verification checks
   */
  static calculateTrustScore(checks: {
    emailDomainVerified: boolean
    businessRegistryChecked: boolean
    linkedInVerified: boolean
    websiteVerified: boolean
    hasDocuments: boolean
    domainMatch: boolean
    flagCount: number
  }): number {
    let score = 0

    // Email domain verification (25 points)
    if (checks.emailDomainVerified) score += 25

    // Business registry check (20 points)
    if (checks.businessRegistryChecked) score += 20

    // LinkedIn verification (15 points)
    if (checks.linkedInVerified) score += 15

    // Website verification (15 points)
    if (checks.websiteVerified) score += 15

    // Documents uploaded (15 points)
    if (checks.hasDocuments) score += 15

    // Domain match (10 points)
    if (checks.domainMatch) score += 10

    // Deduct points for flags (5 points each, max 25)
    const flagPenalty = Math.min(checks.flagCount * 5, 25)
    score -= flagPenalty

    return Math.max(0, Math.min(100, score))
  }

  /**
   * Perform comprehensive employer verification
   */
  static async verifyEmployer(data: {
    email: string
    companyName?: string
    website?: string
    description?: string
    linkedInProfile?: string
    businessRegistrationNumber?: string
    hasDocuments: boolean
  }): Promise<VerificationResult> {
    const checks = {
      emailDomainVerified: false,
      businessRegistryChecked: false,
      linkedInVerified: false,
      websiteVerified: false,
      manualReviewRequired: false
    }

    const flags: Array<{ type: string; description: string }> = []

    // Verify email domain
    checks.emailDomainVerified = await this.verifyEmailDomain(data.email)
    if (!checks.emailDomainVerified) {
      flags.push({
        type: 'domain_mismatch',
        description: 'Email domain could not be verified or is a free provider'
      })
    }

    // Verify domain match
    let domainMatch = false
    if (data.website && checks.emailDomainVerified) {
      domainMatch = this.verifyDomainMatch(data.email, data.website)
      checks.websiteVerified = domainMatch
      if (!domainMatch) {
        flags.push({
          type: 'domain_mismatch',
          description: 'Email domain does not match company website'
        })
      }
    }

    // Validate LinkedIn profile
    if (data.linkedInProfile) {
      checks.linkedInVerified = this.validateLinkedInProfile(data.linkedInProfile)
      if (!checks.linkedInVerified) {
        flags.push({
          type: 'pattern_mismatch',
          description: 'Invalid LinkedIn profile URL format'
        })
      }
    }

    // Check for business registration number
    if (data.businessRegistrationNumber && data.businessRegistrationNumber.length > 5) {
      checks.businessRegistryChecked = true
    }

    // Detect suspicious patterns
    const patternFlags = this.detectSuspiciousPatterns({
      companyName: data.companyName,
      website: data.website,
      description: data.description,
      email: data.email
    })
    flags.push(...patternFlags)

    // Determine if manual review is required
    checks.manualReviewRequired = 
      flags.length > 2 || 
      !checks.emailDomainVerified || 
      (!data.businessRegistrationNumber && !data.hasDocuments)

    // Calculate trust score
    const score = this.calculateTrustScore({
      emailDomainVerified: checks.emailDomainVerified,
      businessRegistryChecked: checks.businessRegistryChecked,
      linkedInVerified: checks.linkedInVerified,
      websiteVerified: checks.websiteVerified,
      hasDocuments: data.hasDocuments,
      domainMatch,
      flagCount: flags.length
    })

    return {
      passed: score >= 50 && !checks.manualReviewRequired,
      score,
      checks,
      flags
    }
  }
}
