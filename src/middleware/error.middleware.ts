import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction): void => {
  if (process.env.NODE_ENV !== 'production') console.error('❌', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
};

export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({ error: 'Route not found' });
};
