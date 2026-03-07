export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ApiError extends AppError {
  constructor(
    message: string,
    public readonly status: number,
    public readonly endpoint: string,
  ) {
    super(message, 'API_ERROR')
    this.name = 'ApiError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(endpoint: string) {
    super(`Not found: ${endpoint}`, 404, endpoint)
    this.name = 'NotFoundError'
  }
}
