// Server-side Cloudflare Turnstile verification. The secret key never reaches the browser.
export async function POST(request) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not set");
    return Response.json({ success: false }, { status: 500 });
  }

  let token;
  try {
    ({ token } = await request.json());
  } catch {
    return Response.json({ success: false }, { status: 400 });
  }
  if (!token || typeof token !== "string") {
    return Response.json({ success: false }, { status: 400 });
  }

  const body = new URLSearchParams({ secret, response: token });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body }
    );
    const result = await res.json();
    return Response.json({ success: result.success === true });
  } catch (error) {
    console.error("Turnstile verification failed:", error);
    return Response.json({ success: false }, { status: 502 });
  }
}
