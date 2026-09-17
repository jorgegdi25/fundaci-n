import { validateDonation } from "@/lib/donations";
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }
  const checked = validateDonation(body);
  if (!checked.ok)
    return Response.json({ error: checked.error }, { status: 400 });
  return Response.json(
    {
      error: "payments_unavailable",
      message: "Online payments are not enabled.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
