const { Redis } = require('@upstash/redis');

function findEnvKey(mustInclude, mustExclude) {
  mustExclude = mustExclude || [];
  return Object.keys(process.env).find(function (k) {
    return mustInclude.every(function (p) { return k.indexOf(p) !== -1; }) &&
           mustExclude.every(function (p) { return k.indexOf(p) === -1; });
  });
}

var urlKey = findEnvKey(['REST_API_URL']);
var tokenKey = findEnvKey(['REST_API_TOKEN'], ['READ_ONLY']);

var redis = new Redis({
  url: process.env[urlKey],
  token: process.env[tokenKey]
});

const KEY = 'romy-workout-log';

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await redis.get(KEY);
      res.status(200).json({ loggedDates: data || {} });
    } catch (err) {
      res.status(500).json({ error: 'Failed to load log', detail: String(err) });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      await redis.set(KEY, body.loggedDates || {});
      res.status(200).json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save log', detail: String(err) });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
