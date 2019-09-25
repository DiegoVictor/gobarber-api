class HttpError extends Error {
  constructor(message, code) {
    super();
    this.message = message;
    this.code = code;
  }
}

export default HttpError;
