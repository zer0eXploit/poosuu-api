import mongoose from "mongoose";

const { Schema } = mongoose;

const LyricsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    lyricsData: [{}],
    youtubeEmbed: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

LyricsSchema.index({ title: "text" });

const Lyrics = mongoose.model("Lyrics", LyricsSchema);

export default Lyrics;
