import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public details?: string;

  constructor(statusCode: number, message: string, details?: string) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    // If the error has details, use the specific format
    if (err.details) {
      return res.status(err.statusCode).json({
        error: err.message,
        details: err.details,
      });
    }
    // Otherwise Handle custom application errors(e.g., 404, 503)
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Handle generic errors
  console.error('UNEXPECTED ERROR:', err);
  return res.status(500).json({ error: 'Internal Server Error' });
};
