export const buildPaginationObject = async (count, limit, current) => {
  const pages = Math.ceil(count / limit);
  const next = pages > current && current + 1;
  const prev = current > 1 && current - 1;
  return { current, pages, prev, next };
};

export const extractPaginationInfo = (query) => {
  const sortBy = query.sortBy || "_id";
  const page = parseInt(query.page, 10) || 1;
  let limit = parseInt(query.limit) || 25;
  if (limit > 25) limit = 25;
  const skip = (page - 1) * limit;
  return { sort: `id ${sortBy}`, limit, page, skip };
};
