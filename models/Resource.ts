import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  type: 'article' | 'video' | 'template' | 'guide' | 'tool' | 'course';
  category: string;
  tags: string[];
  url?: string;
  fileUrl?: string;
  author: {
    userId: mongoose.Types.ObjectId;
    name: string;
  };
  upvotes: number;
  upvotedBy: mongoose.Types.ObjectId[];
  downloads: number;
  views: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['article', 'video', 'template', 'guide', 'tool', 'course'],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [String],
    url: String,
    fileUrl: String,
    author: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ResourceSchema.index({ category: 1, featured: -1 });
ResourceSchema.index({ tags: 1 });
ResourceSchema.index({ upvotes: -1 });

export default mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);
