import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
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
    // Handle custom application errors(e.g., 404, 503)
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Handle generic errors
  console.error(err);
  return res.status(500).json({ error: 'Internal Server Error' });
};
