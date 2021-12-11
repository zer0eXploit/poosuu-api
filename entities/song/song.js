import {
  isValidObjectId,
  isString,
  isEmptyString,
  isValidUrl,
} from "../../helpers/validation.js";
import requiredParam from "../../helpers/required-param.js";
import { InvalidPropertyError } from "../../helpers/errors.js";

const makeSong = (songData = requiredParam("SongData")) => {
  const validateCoverArt = (artUrl) => {
    if (!isString(artUrl))
      throw new InvalidPropertyError("Cover Art url is not valid.");
    if (isEmptyString(artUrl))
      throw new InvalidPropertyError("Cover Art url must not be empty.");
    if (!isValidUrl(artUrl))
      throw new InvalidPropertyError("coverArt url must start with http(s)://");
  };

  const validateTitle = (title) => {
    if (!isString(title))
      throw new InvalidPropertyError("Song title is not valid.");
    if (isEmptyString(title))
      throw new InvalidPropertyError("Song title must not be empty.");
  };

  const validateDescription = (description) => {
    if (!isString(description))
      throw new InvalidPropertyError("Song description is not valid.");
    if (isEmptyString(description))
      throw new InvalidPropertyError("Song description must not be empty.");
  };

  const validateObjectId = (label, value) => {
    if (!isValidObjectId(value))
      throw new InvalidPropertyError(label + " is invalid.");
  };

  const validate = ({
    title = requiredParam("title"),
    description = requiredParam("description"),
    coverArt = requiredParam("coverArt"),
    artist = requiredParam("artist"),
    lyrics = requiredParam("lyrics"),
  }) => {
    validateTitle(title);
    validateDescription(description);
    validateCoverArt(coverArt);
    validateObjectId("artist", artist);
    validateObjectId("lyrics", lyrics);
    return {
      title,
      description,
      coverArt,
      artist,
      lyrics,
    };
  };

  const validSong = validate(songData);

  return Object.freeze(validSong);
};

export default makeSong;
