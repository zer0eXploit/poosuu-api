import mongoose from "mongoose";

import {
  ResourceNotFoundError,
  UniqueConstraintError,
} from "../../helpers/errors.js";

const { Error: MongooseError } = mongoose;

const makeAdminList = ({ AdminModel = {} }) => {
  const createAdmin = async (admin) => {
    try {
      const created = await AdminModel.create(admin);
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

  const getAdminById = async (id) => await AdminModel.findById(id);

  const updateAdmin = async (adminId, updateData) => {
    try {
      const options = { new: true };
      const updated = await AdminModel.findByIdAndUpdate(
        adminId,
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

  return Object.freeze({
    createAdmin,
    getAdminById,
    updateAdmin,
  });
};

export default makeAdminList;
