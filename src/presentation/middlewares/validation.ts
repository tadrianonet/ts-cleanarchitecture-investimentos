import { Request, Response, NextFunction } from 'express';

export const validateContentType = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!req.is('application/json')) {
      res.status(400).json({
        error: 'Content-Type deve ser application/json'
      });
      return;
    }
  }
  next();
};

export const validateRequestSize = (maxSize: string = '10mb') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = req.get('content-length');

    if (contentLength) {
      const sizeInMB = parseInt(contentLength, 10) / (1024 * 1024);
      const maxSizeInMB = parseInt(maxSize, 10);

      if (sizeInMB > maxSizeInMB) {
        res.status(413).json({
          error: `Request muito grande. Máximo permitido: ${maxSize}`
        });
        return;
      }
    }

    next();
  };
};
