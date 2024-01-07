import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
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

export type InferedUser = mongoose.InferSchemaType<typeof UserSchema>;
export type User = { _id: mongoose.Types.ObjectId } & InferedUser;
