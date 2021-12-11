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

const makeArtistList = ({ ArtistModel = {}, SongModel = {} }) => {
  const createArtist = async (artist) => {
    try {
      const created = await ArtistModel.create(artist);
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

  const getArtistCount = async () => await ArtistModel.count();

  const getArtistById = async (id) => await ArtistModel.findById(id);

  const getAllArtists = async (query) => {
    const { sortBy, limit, page, skip } = extractPaginationInfo(query);
    const count = await getArtistCount();
    const pagination = await buildPaginationObject(count, limit, page);
    const artists = await ArtistModel.find()
      .skip(skip)
      .limit(limit)
      .sort(sortBy);
    return { artists, pagination };
  };

  const getArtist = async (id, query = {}) => {
    try {
      if (id) {
        const artist = await getArtistById(id);
        if (!artist) throw new ResourceNotFoundError();
        return artist;
      }

      const artists = await getAllArtists(query);
      return artists;
    } catch (e) {
      if (e instanceof MongooseError.CastError)
        throw new ResourceNotFoundError();
      throw e;
    }
  };

  const updateArtist = async (artistId, updateData) => {
    try {
      const options = { new: true };
      const updated = await ArtistModel.findByIdAndUpdate(
        artistId,
        updateData,
        options
      );

      return updated;
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

  const countArtistSongs = async (artist) => await SongModel.count({ artist });

  const deleteArtist = async (id) => {
    try {
      const songs = await countArtistSongs(id);
      if (songs > 0) {
        return {
          message: "Please delete all the songs related to the artist first.",
        };
      }
      await ArtistModel.findByIdAndDelete(id);
    } catch (e) {
      if (e instanceof MongooseError.CastError)
        throw new ResourceNotFoundError();
      throw e;
    }
  };

  return Object.freeze({
    createArtist,
    getArtist,
    updateArtist,
    deleteArtist,
  });
};

export default makeArtistList;
