import path from 'path';
import app from './app.js';

const PORT = Number(process.env.PORT) || 3000;

// Production: serve the Vite-built static files
if (process.env.NODE_ENV === 'production') {
  const { default: express } = await import('express');
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
