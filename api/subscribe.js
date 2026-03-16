import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const FROM = 'LiveWire <go@sparkmode.com>';

const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>You're on the list.</title></head>
<body style="margin:0;padding:0;background:#0D0D14;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D14;padding:32px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background:#13131e;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">

  <!-- Top accent bar -->
  <tr><td style="height:4px;background:linear-gradient(to right,#4F3FFF,#7B2FFF,#00D2FF);font-size:0;">&nbsp;</td></tr>

  <!-- Header -->
  <tr><td style="padding:28px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.07);">
    <img src="https://livewire.sparkmode.com/livewire-wordmark-solo.png" alt="LiveWire" height="32" style="display:block;" />
    <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:0.02em;">by SparkMode</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:32px 40px 28px;">
    <h1 style="font-size:24px;font-weight:700;color:#FAFAF7;margin:0 0 16px;line-height:1.25;letter-spacing:-0.01em;">You're on the list.</h1>
    <p style="font-size:16px;color:rgba(250,250,247,0.75);line-height:1.75;margin:0 0 28px;">LiveWire is for parents who are past the obvious stuff. No frameworks. No signature methods. Just what's actually working, what isn't, and why.</p>

    <p style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(250,250,247,0.35);margin:0 0 16px;">What we cover</p>

    <!-- 11pm Search -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
    <tr><td style="padding:16px 20px;border-radius:6px;border-left:3px solid #7B2FFF;background:rgba(123,47,255,0.08);">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#7B2FFF;letter-spacing:0.08em;text-transform:uppercase;">The 11pm Search</p>
      <p style="margin:0 0 10px;font-size:14px;color:rgba(250,250,247,0.7);line-height:1.6;">Researched answers to what parents actually Google at night. Specific, cited, no filler.</p>
      <a href="https://livewire.sparkmode.com/11pm-search" style="font-size:13px;font-weight:700;color:#7B2FFF;text-decoration:none;">Browse posts</a>
    </td></tr></table>

    <!-- They Get It Too -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
    <tr><td style="padding:16px 20px;border-radius:6px;border-left:3px solid #00D2FF;background:rgba(0,210,255,0.06);">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#00D2FF;letter-spacing:0.08em;text-transform:uppercase;">They Get It Too</p>
      <p style="margin:0 0 10px;font-size:14px;color:rgba(250,250,247,0.7);line-height:1.6;">How well-known people describe learning differently, in their own words. No labels.</p>
      <a href="https://livewire.sparkmode.com/they-get-it-too" style="font-size:13px;font-weight:700;color:#00D2FF;text-decoration:none;">Browse posts</a>
    </td></tr></table>

    <!-- No Commission -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
    <tr><td style="padding:16px 20px;border-radius:6px;border-left:3px solid #F5A623;background:rgba(245,166,35,0.06);">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#F5A623;letter-spacing:0.08em;text-transform:uppercase;">No Commission</p>
      <p style="margin:0 0 10px;font-size:14px;color:rgba(250,250,247,0.7);line-height:1.6;">Product recs with zero affiliate codes. We make $0.00 from any link on this site. The disclaimer is the whole point.</p>
      <a href="https://livewire.sparkmode.com/no-commission" style="font-size:13px;font-weight:700;color:#F5A623;text-decoration:none;">Browse posts</a>
    </td></tr></table>

    <!-- Set the Room -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
    <tr><td style="padding:16px 20px;border-radius:6px;border-left:3px solid #00A896;background:rgba(0,168,150,0.06);">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#00A896;letter-spacing:0.08em;text-transform:uppercase;">Set the Room</p>
      <p style="margin:0 0 10px;font-size:14px;color:rgba(250,250,247,0.7);line-height:1.6;">Playlists and ambient audio mapped to specific parenting moments. Not just "focus music."</p>
      <a href="https://livewire.sparkmode.com/set-the-room" style="font-size:13px;font-weight:700;color:#00A896;text-decoration:none;">Browse posts</a>
    </td></tr></table>

    <!-- Add These -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:0;">
    <tr><td style="padding:16px 20px;border-radius:6px;border-left:3px solid #4F3FFF;background:rgba(79,63,255,0.06);">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#8070FF;letter-spacing:0.08em;text-transform:uppercase;">Add These</p>
      <p style="margin:0 0 10px;font-size:14px;color:rgba(250,250,247,0.7);line-height:1.6;">Five people worth your feed this week. Short, opinionated, no fluff.</p>
      <a href="https://livewire.sparkmode.com/add-these" style="font-size:13px;font-weight:700;color:#8070FF;text-decoration:none;">Browse posts</a>
    </td></tr></table>
  </td></tr>

  <!-- SparkMode -->
  <tr><td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02);">
    <p style="font-size:13px;color:rgba(250,250,247,0.45);line-height:1.7;margin:0 0 10px;">LiveWire is published by <strong style="color:rgba(250,250,247,0.7);">SparkMode</strong>, a personalized story generator for kids who learn differently. Your child's obsession becomes the content. The learning is real; it just doesn't look like school.</p>
    <a href="https://sparkmode.com" style="font-size:13px;font-weight:700;color:#F5A623;text-decoration:none;">Try SparkMode free</a>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:18px 40px;border-top:1px solid rgba(255,255,255,0.05);">
    <p style="font-size:12px;color:rgba(250,250,247,0.25);margin:0;line-height:1.7;">
      You signed up at livewire.sparkmode.com.&nbsp;
      <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:rgba(250,250,247,0.35);text-decoration:underline;">Unsubscribe</a>
    </p>
  </td></tr>

  <!-- Bottom accent bar -->
  <tr><td style="height:3px;background:linear-gradient(to right,#F5A623,#c87d10);font-size:0;">&nbsp;</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://livewire.sparkmode.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    // Add to Resend audience
    await resend.contacts.create({
      email,
      audienceId: AUDIENCE_ID,
      unsubscribed: false,
    });

    // Send confirmation email
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "You're on the list.",
      html: emailHtml,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
