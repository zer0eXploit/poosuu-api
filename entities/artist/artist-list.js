import mongoose from "mongoose";
import {
  ResourceNotFoundError,
  UniqueConstraintError,
} from "../../helpers/errors.js";

const { Error: MongooseError } = mongoose;

const makeArtistList = ({ ArtistModel = {} }) => {
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

  const extractPaginationInfo = (query) => {
    const sortBy = query.sortBy || "title";
    const page = parseInt(query.page, 10) || 1;
    let limit = parseInt(query.limit) || 25;
    if (limit > 25) limit = 25;
    const skip = (page - 1) * limit;
    return { sortBy: `id ${sortBy}`, limit, page, skip };
  };

  const buildPaginationObject = async (currentPage, limit) => {
    const count = await getArtistCount();
    const pages = Math.ceil(count / limit);
    const next = pages > currentPage && currentPage + 1;
    const prev = currentPage > 1 && currentPage - 1;
    return { currentPage, pages, prev, next };
  };

  const getAllArtists = async (query) => {
    const { sortBy, limit, page, skip } = extractPaginationInfo(query);
    const pagination = await buildPaginationObject(page, limit);
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

  //   DELETE must happen only after all the songs of the artist are deleted
  //   const deleteArtist = async (id) => await ArtistModel.findByIdAndDelete(id);

  return Object.freeze({
    createArtist,
    getArtist,
    updateArtist,
  });
};

export default makeArtistList;
