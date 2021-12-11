const adaptRequest = (req = {}) => {
  return Object.freeze({
    path: req.path,
    method: req.method,
    headers: req.headers,
    params: req.params,
    query: req.query,
    body: req.body,
  });
};

export default adaptRequest;
