import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_URL = 'https://api.resend.com/emails';

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  record: {
    id: string;
    email: string;
    source: string;
    created_at: string;
    welcome_sent: boolean;
  };
  old_record: null | Record<string, unknown>;
}

Deno.serve(async (req: Request) => {
  const webhookSecret = Deno.env.get('SEND_WELCOME_WEBHOOK_SECRET');
  if (webhookSecret) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${webhookSecret}`) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response('Bad Request: invalid JSON', { status: 400 });
  }

  if (payload.type !== 'INSERT' || payload.table !== 'waitlist_subscribers') {
    return new Response('Ignored', { status: 200 });
  }

  const { id, email, welcome_sent } = payload.record;

  if (!email) {
    return new Response('Bad Request: missing email', { status: 400 });
  }

  // Idempotency guard — prevents duplicate sends on webhook retries
  if (welcome_sent === true) {
    console.log(`Skipping ${email} — welcome already sent`);
    return new Response('Already sent', { status: 200 });
  }

  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!resendKey) {
    console.error('RESEND_API_KEY secret is not set');
    return new Response('Server misconfiguration', { status: 500 });
  }

  let resendResponse: Response;
  try {
    resendResponse = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Advuman <hello@advuman.com>',
        to: [email],
        reply_to: 'advumaninc@gmail.com',
        subject: "You're on the Advuman waitlist — here's what's next",
        html: buildHtml(),
        text: buildText(),
      }),
    });
  } catch (err) {
    console.error('Network error calling Resend:', err);
    return new Response('Email delivery failed (network)', { status: 502 });
  }

  if (!resendResponse.ok) {
    const errBody = await resendResponse.text();
    console.error(`Resend API error ${resendResponse.status}:`, errBody);
    // Non-2xx causes Supabase to retry the webhook (up to 3 attempts)
    return new Response('Email delivery failed', { status: 500 });
  }

  // Mark welcome_sent = true so retries are no-ops
  const db = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { error: dbError } = await db
    .from('waitlist_subscribers')
    .update({ welcome_sent: true })
    .eq('id', id);

  if (dbError) {
    // Email was sent — return 200 so webhook doesn't retry and send again
    console.error('DB update failed after successful send:', dbError.message);
  }

  console.log(`Welcome email sent to ${email}`);
  return new Response(JSON.stringify({ success: true, email }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});

function buildHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Advuman</title>
  <style>
    body { margin: 0; padding: 0; background: #070d0a; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .wrapper { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
    .logo { font-size: 22px; font-weight: 700; color: #ffd700; letter-spacing: 0.12em; margin-bottom: 32px; }
    .logo span { color: #e8e4dc; }
    .badge {
      display: inline-block; background: rgba(255,215,0,0.12); border: 1px solid rgba(255,215,0,0.3);
      color: #ffd700; font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
      padding: 4px 10px; border-radius: 4px; text-transform: uppercase; margin-bottom: 24px;
    }
    h1 { color: #e8e4dc; font-size: 24px; font-weight: 600; margin: 0 0 16px; line-height: 1.35; }
    p { color: #b8b4ac; font-size: 15px; line-height: 1.75; margin: 0 0 16px; }
    .em { color: #e8e4dc; }
    hr { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 28px 0; }
    .card { background: rgba(255,255,255,0.04); border-radius: 8px; padding: 20px 24px; margin-bottom: 24px; }
    .card h2 { color: #e8e4dc; font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 12px; }
    .card ul { margin: 0; padding-left: 18px; }
    .card li { color: #b8b4ac; font-size: 14px; line-height: 1.9; }
    .btn {
      display: inline-block; background: #ffd700; color: #070d0a;
      font-size: 13px; font-weight: 700; letter-spacing: 0.06em;
      padding: 12px 24px; border-radius: 6px; text-decoration: none;
    }
    .footer { margin-top: 40px; font-size: 12px; color: rgba(184,180,172,0.45); line-height: 1.7; }
    .footer a { color: rgba(184,180,172,0.55); text-decoration: underline; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="logo">ADVU<span>MAN</span></div>
    <div class="badge">Waitlist Confirmed</div>
    <h1>You're in. The UK–India Corridor Pulse starts Monday.</h1>
    <p>
      Thanks for joining the Advuman waitlist. Every Monday you'll receive the
      <span class="em">UK–India Corridor Pulse</span> — a concise brief covering
      corridor health state, top OSINT signals, and any material alerts from the past week.
    </p>
    <p>No login. No noise. Just the intelligence that matters for your trade corridor.</p>
    <hr>
    <div class="card">
      <h2>What to expect</h2>
      <ul>
        <li>Weekly corridor health score — ACTIVE / WATCH / STABLE / RECOVERY</li>
        <li>Top signals across Regulatory, Logistics &amp; Cost pressure layers</li>
        <li>Key alerts: tariff changes, port disruptions, policy shifts</li>
        <li>Early access invitation when Advuman opens for beta subscribers</li>
      </ul>
    </div>
    <p>Want to talk through your corridor risk exposure? Book a quick 15-minute call:</p>
    <a href="https://calendly.com/advumaninc" class="btn">Book a 15-min call &rarr;</a>
    <hr>
    <p style="font-size:13px; color: rgba(184,180,172,0.65);">
      Questions? Just reply to this email — it goes straight to the founder.
    </p>
    <div class="footer">
      You signed up at <a href="https://advuman.com">advuman.com</a>.<br>
      Advuman &mdash; Trade Risk Intelligence for UK SMEs
    </div>
  </div>
</body>
</html>`;
}

function buildText(): string {
  return `ADVUMAN — Waitlist Confirmed
=============================

You're in. The UK–India Corridor Pulse starts Monday.

Thanks for joining the Advuman waitlist. Every Monday you'll receive the UK–India Corridor Pulse — a concise brief covering corridor health state, top OSINT signals, and any material alerts from the past week.

No login. No noise. Just the intelligence that matters for your trade corridor.

WHAT TO EXPECT
--------------
- Weekly corridor health score: ACTIVE / WATCH / STABLE / RECOVERY
- Top signals across Regulatory, Logistics & Cost pressure layers
- Key alerts: tariff changes, port disruptions, policy shifts
- Early access invitation when Advuman opens for beta subscribers

Book a 15-minute call: https://calendly.com/advumaninc

Questions? Just reply to this email — it goes straight to the founder.

---
You signed up at advuman.com.
Advuman — Trade Risk Intelligence for UK SMEs
`;
}
