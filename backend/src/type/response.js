export class SuccessResponse {
  constructor(msg, data = null) {
    this.success = true;
    this.msg = msg;
    this.data = data;
  }
}

export class ErrorResponse extends Error {
  constructor(msg, statusCode = 500) {
    super(msg);
    this.success = false;
    this.error = msg;
    this.statusCode = statusCode;
  }
}
