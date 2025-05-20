import express from 'express';
import fetch from 'node-fetch';

const app = express();

app.get('/image', async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) return res.status(400).send('Missing url');

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Image fetch failed');

    const contentType = response.headers.get('content-type');
    if (!contentType.startsWith('image/')) throw new Error('Not an image');

    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=3600');
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send('Proxy failed: ' + err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy running on port ${port}`);
});
