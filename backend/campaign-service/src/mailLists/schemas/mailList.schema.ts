import mongoose from 'mongoose';

export const MailListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    strict: true,
  },
);

export type MailList = mongoose.InferSchemaType<typeof MailListSchema>;
