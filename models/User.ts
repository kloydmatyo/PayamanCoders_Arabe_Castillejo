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
}, {
  timestamps: true,
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)