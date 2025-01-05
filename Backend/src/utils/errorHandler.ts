class CustomError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;

    // Устанавливаем прототип для совместимости с Error
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default CustomError;
