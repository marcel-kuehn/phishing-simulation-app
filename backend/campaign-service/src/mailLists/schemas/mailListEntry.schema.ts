import mongoose from 'mongoose';
const crypto = require('crypto');

export const MailListEntrySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    mailListId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    verificationToken: {
      type: String,
      default: () => crypto.randomBytes(40).toString('hex'),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      validate: (value) => value === null || value instanceof Date,
    },
    isUnsubscribed: {
      type: Boolean,
      default: false,
    },
    unsubscribedAt: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      validate: (value) => value === null || value instanceof Date,
    },
    unsubscribeToken: {
      type: String,
      default: () => crypto.randomBytes(40).toString('hex'),
    },
  },
  {
    strict: true,
  },
);

MailListEntrySchema.index({ email: 1, mailListId: 1 }, { unique: true });

export type MailListEntry = mongoose.InferSchemaType<
  typeof MailListEntrySchema
>;
