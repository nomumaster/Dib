export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, services = [], details = '' } = req.body || {};

  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const url = process.env.LOGIC_APP_URL;
  const token = process.env.LOGIC_APP_TOKEN; // optional shared secret header

  if (!url) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  try {
    const payload = {
      name,
      phone,
      email,
      services,
      details,
      source: 'datalsbacon-website',
      timestamp: new Date().toISOString(),
    };

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['X-Auth-Token'] = token;

    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      return res.status(502).json({ error: 'Upstream error', status: resp.status, body: text });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', message: err?.message || String(err) });
  }
}
