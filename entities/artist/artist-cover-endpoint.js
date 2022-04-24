import {
  deleteImage,
  cropImageAndSave,
  uploadImagetoImgBB,
  getRandomJPEGName,
} from "../../helpers/image.js";
import { checkAuthorization } from "../../helpers/auth.js";
import { makeHttpResponse } from "../../helpers/http-response.js";

const makeArtistCoverEndpointsHandler = () => {
  const createArtistCover = async (httpRequest) => {
    const { headers } = httpRequest;

    console.log("Before auth!");
    checkAuthorization(headers);

    const {
      body: { width, height, left, top },
      files,
    } = httpRequest;

    if (!files || Object.keys(files).length === 0) {
      return makeHttpResponse({
        error: true,
        message: "Image file with 'image' field is required.",
      });
    }

    console.log("File Detected!");

    if (!width || !height || !left || !top) {
      return makeHttpResponse({
        error: true,
        message:
          "Some or all image crop data: 'width, height, left, top' are missing.",
      });
    }

    console.log("Other params present!");

    const coverImage = files.image;
    const imagePath = `${process.cwd()}/public/temp/${getRandomJPEGName()}`;

    console.log(imagePath);

    const extractData = {
      width: parseInt(width),
      height: parseInt(height),
      left: parseInt(left),
      top: parseInt(top),
    };

    try {
      await cropImageAndSave(coverImage.data, extractData, imagePath);

      console.log("Image Saved!");

      const uploaded = await uploadImagetoImgBB(imagePath);

      console.log("Image Uploaded to ImgBB!");

      const {
        data: { url, delete_url: deleteUrl },
      } = uploaded;

      deleteImage(imagePath);

      console.log("Image removed from disk!");

      return makeHttpResponse({ url, deleteUrl }, 201);
    } catch (e) {
      throw e;
    }
  };

  const handle = (httpRequest) => {
    switch (httpRequest.method) {
      case "POST":
        return createArtistCover(httpRequest);

      default:
        return makeErrorHttpResponse({
          status: 405,
          errorMessage: `${httpRequest.method} method not allowed.`,
        });
    }
  };

  return handle;
};

export default makeArtistCoverEndpointsHandler;
