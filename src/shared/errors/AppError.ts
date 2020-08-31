class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  constructor(message: string, status_code = 400) {
    this.message = message;
    this.statusCode = status_code;
  }
}

export default AppError;
