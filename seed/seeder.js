import "colors";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { readFile } from "fs/promises";

dotenv.config({ path: path.join(process.cwd(), "/config", ".env") });

// Import Models
import Artist from "../models/artist.js";
import Lyrics from "../models/lyrics.js";
import Song from "../models/song.js";
import Admin from "../models/admin.js";

// Connect to MongoDB
// @desc    Connects to mongodb and logs hostname
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.black.bgBlue);
};

await connectDB();

// Import JSON Data
const songs = JSON.parse(
  await readFile(new URL("./data/songs.json", import.meta.url))
);
const artists = JSON.parse(
  await readFile(new URL("./data/artists.json", import.meta.url))
);
const admins = JSON.parse(
  await readFile(new URL("./data/admins.json", import.meta.url))
);
const lyrics = JSON.parse(
  await readFile(new URL("./data/lyrics.json", import.meta.url))
);

// Seed into database
const seedToDB = async () => {
  try {
    await Song.create(songs);
    await Artist.create(artists);
    await Admin.create(admins);
    await Lyrics.create(lyrics);
    console.log(`DATA SEEDED`.green.inverse);
    process.exit();
  } catch (e) {
    console.log(`${e}`.red.inverse);
    process.exit();
  }
};

const destroyDB = async () => {
  try {
    await Song.deleteMany();
    await Artist.deleteMany();
    await Lyrics.deleteMany();
    await Admin.deleteMany();
    console.log(`ALL DELETED`.green.inverse);
    process.exit();
  } catch (e) {
    console.log(`${e}`.red.inverse);
    process.exit();
  }
};

if (process.argv[2] === "-i") {
  await seedToDB();
} else if (process.argv[2] === "-d") {
  await destroyDB();
}
