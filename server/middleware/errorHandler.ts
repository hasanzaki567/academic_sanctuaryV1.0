import { Request, Response, NextFunction } from 'express';

/**
 * Global error-handling middleware.
 * Must be registered last with app.use() in app.ts.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error('[ERROR]', err.stack ?? err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
}

/**
 * 404 handler — catches any unmatched routes.
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
}
