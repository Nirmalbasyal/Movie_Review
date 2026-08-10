import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  userName: string;
  userEmail: string;
  userPassword: string;
  role: "admin" | "user";
}

const userSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true },
    userPassword: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", userSchema);
