import { Schema, model, type Document, type Model, Types } from 'mongoose';

export type InvitationStatus = 'pending' | 'approved' | 'declined';

export interface InvitationDocument extends Document {
  eventId: Types.ObjectId;
  userId: Types.ObjectId; // User requesting invitation
  message?: string; // Optional message from user
  status: InvitationStatus;
  respondedAt?: Date; // When host responded
  createdAt: Date;
  updatedAt: Date;
}

const invitationSchema = new Schema<InvitationDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    message: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined'],
      default: 'pending',
      index: true,
    },
    respondedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Compound indexes
invitationSchema.index({ eventId: 1, userId: 1 }, { unique: true });
invitationSchema.index({ eventId: 1, status: 1 });
invitationSchema.index({ userId: 1, status: 1 });

invitationSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    const result = ret as Record<string, any>;
    result.id = result._id;
    delete result._id;
    return result;
  },
});

export const InvitationModel: Model<InvitationDocument> = model<InvitationDocument>('Invitation', invitationSchema);

