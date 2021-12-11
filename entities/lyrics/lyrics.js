import {
  isArray,
  isString,
  isEmptyString,
  isEmptyArray,
} from "../../helpers/validation.js";

import requiredParam from "../../helpers/required-param.js";
import { InvalidPropertyError } from "../../helpers/errors.js";

const makeLyrics = (lyricsData = requiredParam("lyricsData")) => {
  const validateTitle = (title) => {
    if (!isString(title))
      throw new InvalidPropertyError("Song title is not valid.");
    if (isEmptyString(title))
      throw new InvalidPropertyError("Song title must not be empty.");
  };

  const validateLyrics = (label, lyrics) => {
    if (!isArray(lyrics))
      throw new InvalidPropertyError("Lyrics structure is not valid.");
    if (isEmptyArray(lyrics))
      throw new InvalidPropertyError(`${label} must not be empty.`);
  };

  const validate = ({
    title = requiredParam("title"),
    enLyrics = requiredParam("enLyrics"),
    mmLyrics = [],
    jpLyrics = [],
    krLyrics = [],
  } = {}) => {
    validateLyrics("English Lyrics", enLyrics);
    validateTitle(title);
    return {
      title: title,
      enLyrics: Object.freeze(enLyrics),
      mmLyrics: Object.freeze(mmLyrics),
      jpLyrics: Object.freeze(jpLyrics),
      krLyrics: Object.freeze(krLyrics),
    };
  };

  const validLyrics = validate(lyricsData);

  return Object.freeze(validLyrics);
};

export default makeLyrics;
