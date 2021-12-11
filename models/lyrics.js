import mongoose from "mongoose";

const { Schema } = mongoose;

const LyricsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    enLyrics: [{ type: String, required: true }],
    mmLyrics: [String],
    jpLyrics: [String],
    krLyrics: [String],
  },
  {
    timestamps: true,
  }
);

const Lyrics = mongoose.model("Lyrics", LyricsSchema);

export default Lyrics;
