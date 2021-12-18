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

const makeSongList = ({ SongModel = {}, LyricsModel = {} }) => {
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
    const { artist } = query;
    const { sortBy, limit, page, skip } = extractPaginationInfo(query);
    const count = await getSongCount();
    const pagination = await buildPaginationObject(count, limit, page);
    const findOption = {};

    if (artist) findOption.artist = artist;

    const songs = await SongModel.find(findOption)
      .skip(skip)
      .limit(limit)
      .sort(sortBy);
    return { songs, pagination };
  };

  const searchSongs = async (keyword) => {
    const artists = await SongModel.find(
      { $text: { $search: keyword } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .select("_id title coverArt")
      .limit(5);

    return artists;
  };

  const getSong = async (id, query = {}) => {
    try {
      if (id) {
        const song = await getSongById(id);
        if (!song) throw new ResourceNotFoundError();
        return song;
      }

      if (query.search) return await searchSongs(query.search);

      const songs = await getAllSongs(query);
      return songs;
    } catch (e) {
      if (e instanceof MongooseError.CastError)
        throw new ResourceNotFoundError();
      throw e;
    }
  };

  const getArtistSongs = async (artistId, query) => {
    try {
      const { sortBy, limit, page, skip } = extractPaginationInfo(query);
      const count = await getSongCount();
      const pagination = await buildPaginationObject(count, limit, page);

      const songs = await SongModel.find({ artist: artistId })
        .skip(skip)
        .limit(limit)
        .sort(sortBy);
      return { songs, pagination };
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
  const deleteSong = async (id) => {
    try {
      const song = await getSong(id);
      if (!song) throw new ResourceNotFoundError();
      await SongModel.findByIdAndDelete(id);
      await LyricsModel.findByIdAndDelete(song.lyrics);
    } catch (e) {
      if (e instanceof MongooseError.CastError)
        throw new ResourceNotFoundError();
      throw e;
    }
  };

  return Object.freeze({
    addSong,
    getSong,
    updateSong,
    deleteSong,
    getArtistSongs,
  });
};

export default makeSongList;
