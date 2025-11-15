import mongoose from 'mongoose'

export interface ICertificate extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  assessmentId: mongoose.Types.ObjectId
  certificateId: string
  title: string
  category: string
  difficulty: string
  score: number
  passingScore: number
  totalQuestions: number
  correctAnswers: number
  skills: string[]
  issuedAt: Date
  expiresAt?: Date
  verificationUrl: string
  badgeUrl?: string
}

const CertificateSchema = new mongoose.Schema({
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
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  category: String,
  difficulty: String,
  score: {
    type: Number,
    required: true
  },
  passingScore: Number,
  totalQuestions: Number,
  correctAnswers: Number,
  skills: [String],
  issuedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  verificationUrl: String,
  badgeUrl: String
}, {
  timestamps: true
})

export default mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema)
