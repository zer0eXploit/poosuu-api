import crypto from "crypto";

import { unlink } from "fs";

import sharp from "sharp";
import fetch from "node-fetch";

import { FormData } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";

export const cropImageAndSave = (image, extractData, savePath) => {
  return sharp(image).extract(extractData).jpeg().toFile(savePath);
};

export const uploadImagetoImgBB = async (imagePath) => {
  const form = new FormData();

  form.set("image", await fileFromPath(imagePath));

  const res = await fetch(process.env.IMAGE_UPLOAD_URL, {
    method: "POST",
    body: form,
  });

  return await res.json();
};

export const deleteImage = (imagePath) => {
  unlink(imagePath, async (err) => {
    if (err) throw err;
  });
};

export const getRandomJPEGName = () => `${crypto.randomUUID()}.jpeg`;
