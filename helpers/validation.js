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

export const isValidEmail = (mail) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
  return emailRegex.test(mail);
};

export const isValidPassword = (password) => {
  /**
   *  At least one upper case English letter, (?=.*?[A-Z])
      At least one lower case English letter, (?=.*?[a-z])
      At least one digit, (?=.*?[0-9])
      At least one special character, (?=.*?[#?!@$%^&*-])
      Minimum eight in length .{8,} (with the anchors)
   */
  const regex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  return regex.test(password);
};

export const isValidUsername = (username) => {
  /**
   * Must contain only alpha numeric characters.
   * Must be between 5 and 15 characters.
   */
  const regex = /^[a-zA-Z0-9]{5,15}$/;
  return regex.test(username);
};
