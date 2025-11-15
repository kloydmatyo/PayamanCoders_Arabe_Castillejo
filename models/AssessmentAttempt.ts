import mongoose from 'mongoose'

export interface IAssessmentAttempt extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  assessmentId: mongoose.Types.ObjectId
  answers: Array<{
    questionId: string
    answer: string | string[]
    isCorrect: boolean
    pointsEarned: number
  }>
  score: number
  totalPoints: number
  passed: boolean
  startedAt: Date
  completedAt?: Date
  timeSpent: number // in seconds
  certificateId?: mongoose.Types.ObjectId
}

const AssessmentAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  answers: [{
    questionId: String,
    answer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    pointsEarned: Number
  }],
  score: {
    type: Number,
    required: true
  },
  totalPoints: Number,
  passed: Boolean,
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  timeSpent: Number,
  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  }
}, {
  timestamps: true
})

export default mongoose.models.AssessmentAttempt || mongoose.model<IAssessmentAttempt>('AssessmentAttempt', AssessmentAttemptSchema)
