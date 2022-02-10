import mongoose from "mongoose";

import Lyrics from "./lyrics.js";
import Artist from "./artist.js";

const { Schema } = mongoose;

const SongSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverArt: {
      type: String,
      required: true,
    },
    artist: {
      type: mongoose.ObjectId,
      ref: Artist,
      required: true,
    },
    lyrics: {
      type: mongoose.ObjectId,
      ref: Lyrics,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

SongSchema.index({ title: "text" });

const Song = mongoose.model("Song", SongSchema);

export default Song;
