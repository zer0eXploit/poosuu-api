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

    if (!width || !height || !left || !top) {
      return makeHttpResponse({
        error: true,
        message:
          "Some or all image crop data: 'width, height, left, top' are missing.",
      });
    }

    const coverImage = files.image;
    const imagePath = `${process.cwd()}/public/temp/${getRandomJPEGName()}`;

    const extractData = {
      width: parseInt(width),
      height: parseInt(height),
      left: parseInt(left),
      top: parseInt(top),
    };

    try {
      await cropImageAndSave(coverImage.data, extractData, imagePath);

      const uploaded = await uploadImagetoImgBB(imagePath);

      const {
        data: { url, delete_url: deleteUrl },
      } = uploaded;

      deleteImage(imagePath);

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
