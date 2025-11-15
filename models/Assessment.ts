import mongoose from 'mongoose'

export interface IAssessment extends mongoose.Document {
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // in minutes
  passingScore: number // percentage
  questions: Array<{
    id: string
    type: 'mcq' | 'multiple_select' | 'scenario' | 'short_answer'
    question: string
    options?: string[]
    correctAnswer: string | string[]
    explanation: string
    points: number
  }>
  skills: string[]
  isActive: boolean
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const AssessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technical', 'soft_skills', 'industry_specific', 'general']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  duration: {
    type: Number,
    required: true,
    default: 30
  },
  passingScore: {
    type: Number,
    required: true,
    default: 70
  },
  questions: [{
    id: String,
    type: {
      type: String,
      enum: ['mcq', 'multiple_select', 'scenario', 'short_answer']
    },
    question: String,
    options: [String],
    correctAnswer: mongoose.Schema.Types.Mixed,
    explanation: String,
    points: {
      type: Number,
      default: 1
    }
  }],
  skills: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

export default mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema)
