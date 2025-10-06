import mongoose from 'mongoose'

export interface IJob extends mongoose.Document {
  title: string
  description: string
  company: string
  employerId: mongoose.Types.ObjectId
  type: 'internship' | 'apprenticeship' | 'full_time' | 'part_time' | 'contract'
  location: string
  remote: boolean
  salary?: {
    min: number
    max: number
    currency: string
  }
  requirements: string[]
  skills: string[]
  duration?: string
  applicationDeadline?: Date
  status: 'active' | 'inactive' | 'closed' | 'draft'
  applicants: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['internship', 'apprenticeship', 'full_time', 'part_time', 'contract'],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  remote: {
    type: Boolean,
    default: false,
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD',
    },
  },
  requirements: [String],
  skills: [String],
  duration: String,
  applicationDeadline: Date,
  status: {
    type: String,
    enum: ['active', 'inactive', 'closed', 'draft'],
    default: 'active',
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
})

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema)