import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  email: string
  password?: string
  firstName: string
  lastName: string
  role: 'job_seeker' | 'employer' | 'mentor' | 'admin'
  emailVerified: boolean
  emailVerificationToken?: string
  emailVerificationExpires?: Date
  googleId?: string
  authProvider: 'local' | 'google' | 'hybrid'
  hasPassword: boolean
  profile: {
    bio?: string
    skills: string[]
    location?: string
    experience?: string
    education?: string
    availability?: 'full_time' | 'part_time' | 'contract' | 'internship'
    remote?: boolean
    profilePicture?: string
  }
  companyProfile?: {
    companyName?: string
    industry?: string
    companySize?: string
    website?: string
    description?: string
    location?: string
    phone?: string
    logo?: string
    founded?: string
    benefits?: string[]
    culture?: string
    updatedAt?: Date
  }
  verification?: {
    status: 'unverified' | 'pending' | 'verified' | 'rejected' | 'suspended'
    verifiedAt?: Date
    rejectedAt?: Date
    rejectionReason?: string
    trustScore: number
    businessRegistrationNumber?: string
    linkedInProfile?: string
    officialEmail?: string
    emailDomain?: string
    documents?: Array<{
      type: 'business_registration' | 'tax_id' | 'incorporation' | 'other'
      url: string
      uploadedAt: Date
      verified: boolean
    }>
    verificationChecks?: {
      emailDomainVerified: boolean
      businessRegistryChecked: boolean
      linkedInVerified: boolean
      websiteVerified: boolean
      manualReviewRequired: boolean
      lastCheckedAt?: Date
    }
    flags?: Array<{
      type: 'suspicious_activity' | 'user_report' | 'pattern_mismatch' | 'domain_mismatch' | 'other'
      description: string
      reportedBy?: mongoose.Types.ObjectId
      createdAt: Date
      resolved: boolean
      resolvedAt?: Date
      resolvedBy?: mongoose.Types.ObjectId
    }>
    reports?: number
    lastReviewedAt?: Date
    reviewedBy?: mongoose.Types.ObjectId
    notes?: string
  }
  resume?: {
    filename: string
    originalName: string
    cloudinaryPublicId: string
    cloudinaryUrl: string
    fileSize: number
    fileType: string
    uploadedAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function(this: IUser): boolean {
      return this.authProvider === 'local'
    },
    minlength: 6,
  },
  hasPassword: {
    type: Boolean,
    default: function(this: IUser): boolean {
      return !!this.password
    },
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationExpires: {
    type: Date,
  },
  googleId: {
    type: String,
    sparse: true,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'hybrid'],
    default: 'local',
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  role: {
    type: String,
    enum: ['job_seeker', 'employer', 'mentor', 'admin'],
    default: 'job_seeker',
  },
  profile: {
    bio: String,
    skills: [String],
    location: String,
    experience: String,
    education: String,
    availability: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'internship'],
    },
    remote: {
      type: Boolean,
      default: false,
    },
    profilePicture: String,
  },
  resume: {
    filename: String,
    originalName: String,
    cloudinaryPublicId: String,
    cloudinaryUrl: String,
    fileSize: Number,
    fileType: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  companyProfile: {
    companyName: String,
    industry: {
      type: String,
      enum: ['technology', 'healthcare', 'finance', 'education', 'retail', 'manufacturing', 'consulting', 'media', 'nonprofit', 'other']
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
    },
    website: String,
    description: String,
    location: String,
    phone: String,
    logo: String,
    founded: String,
    benefits: [String],
    culture: String,
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  
  verification: {
    status: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected', 'suspended'],
      default: function(this: IUser) {
        return this.role === 'employer' ? 'unverified' : 'verified'
      }
    },
    verifiedAt: Date,
    rejectedAt: Date,
    rejectionReason: String,
    trustScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    businessRegistrationNumber: String,
    linkedInProfile: String,
    officialEmail: String,
    emailDomain: String,
    documents: [{
      type: {
        type: String,
        enum: ['business_registration', 'tax_id', 'incorporation', 'other']
      },
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      },
      verified: {
        type: Boolean,
        default: false
      }
    }],
    verificationChecks: {
      emailDomainVerified: {
        type: Boolean,
        default: false
      },
      businessRegistryChecked: {
        type: Boolean,
        default: false
      },
      linkedInVerified: {
        type: Boolean,
        default: false
      },
      websiteVerified: {
        type: Boolean,
        default: false
      },
      manualReviewRequired: {
        type: Boolean,
        default: false
      },
      lastCheckedAt: Date
    },
    flags: [{
      type: {
        type: String,
        enum: ['suspicious_activity', 'user_report', 'pattern_mismatch', 'domain_mismatch', 'other']
      },
      description: String,
      reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      resolved: {
        type: Boolean,
        default: false
      },
      resolvedAt: Date,
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    reports: {
      type: Number,
      default: 0
    },
    lastReviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  },
  
  // Password security tracking
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  passwordResetAttempts: {
    type: Number,
    default: 0
  },
  lastPasswordResetAt: {
    type: Date
  },
}, {
  timestamps: true,
})

// Add method to check if password was changed after JWT was issued
UserSchema.methods.changedPasswordAfter = function(JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000)
    return JWTTimestamp < changedTimestamp
  }
  return false
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)