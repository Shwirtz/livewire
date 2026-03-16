import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const SITE = 'https://livewire.sparkmode.com';

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send('Missing email parameter.');
  }

  const decoded = decodeURIComponent(email);

  if (req.method === 'POST') {
    // One-click unsubscribe (RFC 8058) — called by email clients
    try {
      await resend.contacts.update({
        email: decoded,
        audienceId: AUDIENCE_ID,
        unsubscribed: true,
      });
      return res.status(200).send('OK');
    } catch (err) {
      console.error('One-click unsubscribe error:', err);
      return res.status(500).send('Error');
    }
  }

  if (req.method === 'GET') {
    // Clicked unsubscribe link — unsubscribe and show confirmation page
    try {
      await resend.contacts.update({
        email: decoded,
        audienceId: AUDIENCE_ID,
        unsubscribed: true,
      });
    } catch (err) {
      console.error('Unsubscribe error:', err);
    }

    // Return a clean confirmation page
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed | LiveWire</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0D0D14; color: #FAFAF7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; }
    .card { max-width: 480px; text-align: center; }
    .logo { font-size: 22px; font-weight: 900; letter-spacing: 0.06em; color: #FAFAF7; margin-bottom: 8px; }
    .byline { font-size: 12px; color: rgba(255,255,255,0.35); margin-bottom: 40px; }
    h1 { font-size: 28px; font-weight: 700; margin-bottom: 16px; }
    p { font-size: 16px; color: rgba(250,250,247,0.65); line-height: 1.7; margin-bottom: 32px; }
    a { display: inline-block; color: #0D0D14; background: #F5A623; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 6px; }
    a:hover { opacity: 0.85; }
  </style>
</head>
<body>
  <div class="card">
    <p class="logo">LIVEWIRE</p>
    <p class="byline">by SparkMode</p>
    <h1>You're unsubscribed.</h1>
    <p>We've removed ${decoded} from the LiveWire list. You won't hear from us again.</p>
    <a href="${SITE}">Back to LiveWire</a>
  </div>
</body>
</html>`);
  }

  return res.status(405).send('Method not allowed');
}
