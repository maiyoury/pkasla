import { Schema, model, type Document, type Model } from 'mongoose';

export interface TemplateDocument extends Document {
  name: string;
  title: string;
  category?: string;
  price?: number;
  isPremium: boolean;
  previewImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new Schema<TemplateDocument>(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true, 
      unique: true,
      index: true,
    },
    title: { 
      type: String, 
      required: true, 
      trim: true,
    },
    category: { 
      type: String, 
      trim: true,
      index: true,
    },
    price: { 
      type: Number, 
      min: 0,
    },
    isPremium: { 
      type: Boolean, 
      default: false,
      index: true,
    },
    previewImage: { 
      type: String,
    },
  },
  { timestamps: true },
);

templateSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    const result = ret as Record<string, any>;
    result.id = result._id;
    delete result._id;
    return result;
  },
});

export const TemplateModel: Model<TemplateDocument> = model<TemplateDocument>('Template', templateSchema);

