export const makeHttpResponse = (
  data = {},
  status = 200,
  headers = { "Content-Type": "application/json" }
) => ({ headers, status, data: JSON.stringify(data) });

export const makeEmptyHttpResponse = () => ({
  headers: {},
  status: 204,
  data: {},
});

export const makeErrorHttpResponse = ({
  status = 500,
  errorMessage = "Something went wrong on our server.",
}) => {
  return {
    headers: {
      "Content-Type": "application/json",
    },
    status,
    data: JSON.stringify({
      success: false,
      error: errorMessage,
    }),
  };
};
