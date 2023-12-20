import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    strict: true,
  },
);

export type User = mongoose.InferSchemaType<typeof UserSchema>;
