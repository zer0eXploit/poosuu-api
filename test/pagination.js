import assert from "assert";

import {
  buildPaginationObject,
  extractPaginationInfo,
} from "../helpers/pagination.js";

describe("Test pagination helper functions", function () {
  describe("#buildPaginationObject()", function () {
    it("should return the expected result", async function () {
      const result = { current: 1, pages: 10, prev: false, next: 2 };

      assert.deepEqual(await buildPaginationObject(100, 10, 1), result);
    });
  });

  describe("#extractPaginationInfo()", function () {
    it("should return the expected result", function () {
      const query = { sortBy: `name`, limit: 10, page: 1, skip: 0 };
      const result = { page: 1, skip: 0, limit: 10, sortBy: `id name` };

      assert.deepEqual(extractPaginationInfo(query), result);
    });
  });
});
