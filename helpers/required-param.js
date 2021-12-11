import { RequiredParameterError } from "./errors.js";

const requiredParam = (param) => {
  throw new RequiredParameterError("400", `${param} is required.`);
};

export default requiredParam;
