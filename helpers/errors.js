export class ResourceNotFoundError extends Error {
  constructor(msg = "Oops! That's a 404!") {
    super(msg);

    if (Error.captureStackTrace)
      Error.captureStackTrace(this, ResourceNotFoundError);

    this.name = "ResourceNotFoundError";
    this.statusCode = 404;
  }
}

export class RequiredParameterError extends Error {
  constructor(
    statusCode = 400,
    msg = "At least one required parameter is not present."
  ) {
    super(msg);

    if (Error.captureStackTrace)
      Error.captureStackTrace(this, RequiredParameterError);

    this.name = "RequiredParameterError";
    this.statusCode = statusCode;
  }
}

export class InvalidPropertyError extends Error {
  constructor(msg = "Invalid property value supplied.", statusCode = 422) {
    super(msg);

    if (Error.captureStackTrace)
      Error.captureStackTrace(this, InvalidPropertyError);

    this.name = "InvalidPropertyError";
    this.statusCode = statusCode;
  }
}

export class UniqueConstraintError extends Error {
  constructor(msg = "Value must be unique.", statusCode = 400) {
    super(msg);

    if (Error.captureStackTrace)
      Error.captureStackTrace(this, UniqueConstraintError);

    this.name = "UniqueConstraintError";
    this.statusCode = statusCode;
  }
}
