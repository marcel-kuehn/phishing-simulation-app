import mongoose from 'mongoose';

export const CampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    monthlyMailFrequency: {
      type: Number,
      required: true,
    },
    ownerId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    mailListId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    strict: true,
  },
);

export type Campaign = mongoose.Document<
  mongoose.InferSchemaType<typeof CampaignSchema>
>;
