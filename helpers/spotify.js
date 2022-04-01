import axios from "axios";

const AUTH_ENDPOINT = "https://accounts.spotify.com/api/token";
const SEARCH_ENDPOINT = "https://api.spotify.com/v1/search";
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

let token = null;
let lastRequested = 0;

const getAccessToken = async (clientId, clientSecret) => {
  const axiosConfig = {
    url: AUTH_ENDPOINT,
    method: "POST",
    params: {
      grant_type: "client_credentials",
    },
    headers: {
      Authorization: `Basic ${Buffer.from(
        clientId + ":" + clientSecret
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const response = await axios(axiosConfig);
    return response.data.access_token;
  } catch (e) {
    console.error("[Get Spotify Token]".red.inverse);
    console.error(e.response.data);

    return null;
  }
};

const search = async ({
  q = "Are You with Me",
  type = "track,",
  limit = 10,
  page = 0,
}) => {
  if (!token) {
    token = await getAccessToken(clientId, clientSecret);
    lastRequested = Date.now();

    // Token expires in 1 hour (3600000 milliseconds). So if there is token, check expiry.
  } else if (token && lastRequested + 3500000 < Date.now()) {
    token = await getAccessToken(clientId, clientSecret);
    lastRequested = Date.now();
  }

  if (!token) return null;

  const axiosConfig = {
    url: SEARCH_ENDPOINT,
    method: "GET",
    params: { q, type, limit, offset: page * limit },
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios(axiosConfig);

    return response.data;
  } catch (e) {
    console.error("[Spotify Artist Search]".red.inverse);
    console.error(e.response.data);

    return null;
  }
};

export default Object.freeze({
  search,
});
