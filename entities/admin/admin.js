import bcrypt from "bcryptjs";

import {
  isString,
  isEmptyString,
  isValidEmail,
  isValidPassword,
  isValidUsername,
} from "../../helpers/validation.js";

import requiredParam from "../../helpers/required-param.js";
import { InvalidPropertyError } from "../../helpers/errors.js";

const makeAdmin = (adminData = requiredParam("AdminData")) => {
  const validateName = (name) => {
    if (!isString(name))
      throw new InvalidPropertyError("Admin name is not valid.");
    if (isEmptyString(name))
      throw new InvalidPropertyError("Admin name must not be empty.");
  };

  const validateEmail = (email) => {
    if (!isValidEmail(email))
      throw new InvalidPropertyError("Email must be valid.");
  };

  const validatePassword = (password) => {
    if (!isValidPassword(password))
      throw new InvalidPropertyError("Password must be valid.");
  };

  const validateUsername = (username) => {
    if (!isValidUsername(username))
      throw new InvalidPropertyError("Username must be valid.");
  };

  const validate = ({
    name = requiredParam("name"),
    username = requiredParam("username"),
    email = requiredParam("email"),
    password = requiredParam("password"),
  }) => {
    validateName(name);
    validateUsername(username);
    validatePassword(password);
    validateEmail(email);

    // Hash User Password
    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);

    return {
      name,
      username,
      email,
      password: hashedPassword,
    };
  };

  const validAdmin = validate(adminData);

  return Object.freeze(validAdmin);
};

export default makeAdmin;
