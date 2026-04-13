export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static BadRequest(message: string) {
    return new ApiError(400, message);
  }

  static NotFound(message: string) {
    return new ApiError(404, message);
  }
}
