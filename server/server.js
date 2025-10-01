import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// Example Ko-fi supporters proxy (requires KO_FI_TOKEN in .env)
// Docs: https://ko-fi.com/developers
app.get('/api/supporters', async (_req, res) => {
  try {
    const token = process.env.KO_FI_TOKEN;
    if (!token) return res.status(500).json({ error: 'Missing KO_FI_TOKEN' });

    const resp = await fetch('https://ko-fi.com/api/v1/supporters?limit=10', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({ error: text || 'Failed to fetch supporters' });
    }

    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error' });
  }
});

// You can also receive Ko-fi webhooks here
// app.post('/api/kofi-webhook', (req, res) => { /* verify & process */ });

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Ko-fi backend running on :${port}`));
