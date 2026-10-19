import app from '../server';

export default function handler(req: any, res: any) {
  // If Vercel rewrote the URL to /api, recover the original path
  if (req.url === '/api' || req.url === '/api/') {
    const rawUrl =
      (req.headers['x-matched-path'] as string) ||
      (req.headers['x-forwarded-uri'] as string) ||
      (req.headers['x-rewrite-url'] as string);
    if (rawUrl) {
      req.url = rawUrl;
    }
  }
  return app(req, res);
}
