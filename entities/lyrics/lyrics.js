import isArray from "../../helpers/is-array.js";
import requiredParam from "../../helpers/required-param.js";
import { InvalidPropertyError } from "../../helpers/errors.js";

const makeLyrics = (lyricsData = requiredParam("lyricsData")) => {
  const validateTitle = (title) => {
    if (typeof title !== "string")
      throw new InvalidPropertyError("Song title is not valid.");
    if (title.length === 0)
      throw new InvalidPropertyError("Song title must not be empty.");
  };

  const validateLyrics = (label, lyrics) => {
    if (!isArray(lyrics))
      throw new InvalidPropertyError("Lyrics structure is not valid.");
    if (lyrics.length === 0)
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
