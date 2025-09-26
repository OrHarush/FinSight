import mongoose, { Schema, Document } from 'mongoose';

interface Provider {
  provider: string;
  providerId: string;
}

export interface IUser extends Document {
  email: string;
  name: string;
  picture?: string;
  providers: Provider[];
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    picture: String,
    providers: [
      {
        provider: { type: String, required: true },
        providerId: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
