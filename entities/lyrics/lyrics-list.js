import mongoose from "mongoose";
import { ResourceNotFoundError } from "../../helpers/errors.js";

const { Error: MongooseError } = mongoose;

const makeLyricsList = ({ LyricsModel = {}, SongModel = {} }) => {
  const add = async (lyrics) => await LyricsModel.create(lyrics);

  const findById = async (lyricId) => {
    try {
      const lyrics = await LyricsModel.findById(lyricId);
      return lyrics;
    } catch (e) {
      if (e instanceof MongooseError.CastError)
        throw new ResourceNotFoundError();
      throw e;
    }
  };

  const searchLyrics = async (keyword) => {
    const lyrics = await LyricsModel.find(
      { $text: { $search: keyword } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .select("_id title")
      .limit(5);

    return lyrics;
  };

  const getLyrics = async (id, query = {}) => {
    try {
      if (id) {
        const lyrics = await findById(id);
        if (!lyrics) throw new ResourceNotFoundError();
        return lyrics;
      }

      if (query.search) return await searchLyrics(query.search);
    } catch (e) {
      if (e instanceof MongooseError.CastError)
        throw new ResourceNotFoundError();
      throw e;
    }
  };

  const findByIdAndUpdate = async (lyricsId, updateData) => {
    try {
      const options = { new: true };
      const lyrics = await LyricsModel.findByIdAndUpdate(
        lyricsId,
        updateData,
        options
      );

      return lyrics;
    } catch (e) {
      if (e instanceof MongooseError.CastError)
        throw new ResourceNotFoundError();
      throw e;
    }
  };

  const getSongCount = async (lyrics) => await SongModel.count({ lyrics });

  const findByIdAndDelete = async (lyricsId) => {
    try {
      const count = await getSongCount(lyricsId);
      if (count > 0) {
        return {
          message:
            "Please delete or unlink the song currently linked to this lyrics.",
        };
      }
      await LyricsModel.findByIdAndDelete(lyricsId);
    } catch (e) {
      if (e instanceof MongooseError.CastError)
        throw new ResourceNotFoundError();
      throw e;
    }
  };

  return Object.freeze({
    add,
    getLyrics,
    findByIdAndUpdate,
    findByIdAndDelete,
  });
};

export default makeLyricsList;
