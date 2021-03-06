import {
  isString,
  isEmptyString,
  isValidUrl,
} from "../../helpers/validation.js";

import requiredParam from "../../helpers/required-param.js";
import { InvalidPropertyError } from "../../helpers/errors.js";

const makeArtist = (artistData = requiredParam("ArtistData")) => {
  const validateUrl = (label, url) => {
    if (!isString(url))
      throw new InvalidPropertyError(label + " must be a string.");
    if (isEmptyString(url))
      throw new InvalidPropertyError(label + " must not be empty.");
    if (!isValidUrl(url))
      throw new InvalidPropertyError(label + " must be http(s):// and valid.");
  };

  const validateName = (name) => {
    if (!isString(name))
      throw new InvalidPropertyError("Artist name is not valid.");
    if (isEmptyString(name))
      throw new InvalidPropertyError("Artist name must not be empty.");
  };

  const validateArtistBio = (bio) => {
    if (!isString(bio))
      throw new InvalidPropertyError("Artist bio is not valid.");
    if (isEmptyString(bio))
      throw new InvalidPropertyError("Artist bio must not be empty.");
  };

  const validate = ({
    name = requiredParam("name"),
    bio = requiredParam("bio"),
    image = requiredParam("image"),
    cover = requiredParam("cover"),
    coverDeleteUrl,
  }) => {
    validateName(name);
    validateArtistBio(bio);
    validateUrl("Image URL", image);
    validateUrl("Cover Image URL", cover);
    validateUrl("Cover Delete URL", coverDeleteUrl);
    return {
      name,
      bio,
      image,
      cover,
      coverDeleteUrl,
    };
  };

  const validArtist = validate(artistData);

  return Object.freeze(validArtist);
};

export default makeArtist;
