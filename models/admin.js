import mongoose from "mongoose";

const { Schema } = mongoose;

const AdminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatarUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=500",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;
