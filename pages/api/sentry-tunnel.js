export default async function handler(req, res) {
  const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (!sentryDsn) {
    res.status(500).json({ error: "Sentry DSN is not configured" });
    return;
  }

  const sentryUrl = new URL(sentryDsn);
  const envelope = req.body;

  try {
    const response = await fetch(
      `${sentryUrl.origin}/api/${sentryUrl.pathname.split("/")[2]}/envelope/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-sentry-envelope",
        },
        body: envelope,
      }
    );

    res.status(response.status).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to forward Sentry event" });
  }
}
