import mongoose from "mongoose";
import {
  ResourceNotFoundError,
  UniqueConstraintError,
} from "../../helpers/errors.js";
import {
  buildPaginationObject,
  extractPaginationInfo,
} from "../../helpers/pagination.js";

const { Error: MongooseError } = mongoose;

const makeSongList = ({ SongModel = {} }) => {
  const addSong = async (song) => {
    try {
      const created = await SongModel.create(song);
      return created;
    } catch (e) {
      if (e.name === "MongoServerError" && e.code === 11000) {
        const firstKey = Object.keys(e.keyValue)[0];
        const errMsg = `Value '${e.keyValue[firstKey]}' for ${firstKey} is not unique.`;
        throw new UniqueConstraintError(errMsg);
      }
      throw e;
    }
  };

  const getSongCount = async () => await SongModel.count();

  const getSongById = async (id) => await SongModel.findById(id);

  const getAllSongs = async (query) => {
    const { sortBy, limit, page, skip } = extractPaginationInfo(query);
    const count = await getSongCount();
    const pagination = await buildPaginationObject(count, limit, page);
    const songs = await SongModel.find().skip(skip).limit(limit).sort(sortBy);
    return { songs, pagination };
  };

  const getSong = async (id, query = {}) => {
    try {
      if (id) {
        const song = await getSongById(id);
        if (!song) throw new ResourceNotFoundError();
        return song;
      }

      const songs = await getAllSongs(query);
      return songs;
    } catch (e) {
      if (e instanceof MongooseError.CastError)
        throw new ResourceNotFoundError();
      throw e;
    }
  };

  const updateSong = async (songId, updateData) => {
    try {
      const options = { new: true };
      const song = await SongModel.findByIdAndUpdate(
        songId,
        updateData,
        options
      );

      return song;
    } catch (e) {
      if (e instanceof MongooseError.CastError)
        throw new ResourceNotFoundError();

      if (e.name === "MongoServerError" && e.code === 11000) {
        const firstKey = Object.keys(e.keyValue)[0];
        const errMsg = `Value '${e.keyValue[firstKey]}' for ${firstKey} is not unique.`;
        throw new UniqueConstraintError(errMsg);
      }

      throw e;
    }
  };

  // TO DO!
  // Make sure all the related lyrics are deleted too!
  const deleteSong = async (id) => await SongModel.findByIdAndDelete(id);

  return Object.freeze({
    addSong,
    getSong,
    updateSong,
    deleteSong,
  });
};

export default makeSongList;
