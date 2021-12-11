import mongoose from "mongoose";

const {
  Types: { ObjectId },
} = mongoose;

export const isValidObjectId = (id) => {
  if (ObjectId.isValid(id)) {
    return String(new ObjectId(id)) === id;
  }
  return false;
};

export const isString = (value) => typeof value === "string";

export const isEmptyString = (value) => value.length === 0;

export const isValidUrl = (url) => {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (_) {
    return false;
  }
};

export const isArray = (input) => Array.isArray(input);

export const isEmptyArray = (input) => isArray(input) && input.length === 0;
