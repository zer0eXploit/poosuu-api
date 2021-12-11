import { makeErrorHttpResponse } from "./http-response.js";

export const errorHandler = (err, _req, res, _next) => {
  if (process.env.NODE_ENV !== "production") console.error(err);

  const errorInfo = {
    status: err.statusCode || 500,
    errorMessage: err.message || "Something went wrong on our server.",
  };
  const { headers, status, data } = makeErrorHttpResponse(errorInfo);

  res.set(headers).status(status).send(data);
};

export const notFoundHandler = (_req, res) => {
  const errorInfo = {
    status: 404,
    errorMessage: "The requested resource is not found.",
  };
  const { headers, status, data } = makeErrorHttpResponse(errorInfo);

  res.set(headers).status(status).send(data);
};
