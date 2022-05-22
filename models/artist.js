import mongoose from "mongoose";

const { Schema } = mongoose;

const ArtistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    coverDeleteUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ArtistSchema.index({ name: "text" });

const Artist = mongoose.model("Artist", ArtistSchema);

export default Artist;
