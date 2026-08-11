const { kv } = require('@vercel/kv');

const KEY = 'romy-workout-log';

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await kv.get(KEY);
      res.status(200).json({ loggedDates: data || {} });
    } catch (err) {
      res.status(500).json({ error: 'Failed to load log', detail: String(err) });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      await kv.set(KEY, body.loggedDates || {});
      res.status(200).json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save log', detail: String(err) });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
