import mongoose from "mongoose";
import {
  ResourceNotFoundError,
  UniqueConstraintError,
} from "../../helpers/errors.js";

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

  const extractPaginationInfo = (query) => {
    const sortBy = query.sortBy || "title";
    const page = parseInt(query.page, 10) || 1;
    let limit = parseInt(query.limit) || 25;
    if (limit > 25) limit = 25;
    const skip = (page - 1) * limit;
    return { sortBy: `id ${sortBy}`, limit, page, skip };
  };

  const buildPaginationObject = async (currentPage, limit) => {
    const count = await getSongCount();
    const pages = Math.ceil(count / limit);
    const next = pages > currentPage && currentPage + 1;
    const prev = currentPage > 1 && currentPage - 1;
    return { currentPage, pages, prev, next };
  };

  const getAllSongs = async (query) => {
    const { sortBy, limit, page, skip } = extractPaginationInfo(query);
    const pagination = await buildPaginationObject(page, limit);
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
