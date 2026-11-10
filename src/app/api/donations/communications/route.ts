import { secureEqual } from "@/lib/wompi-security";
import {
  flushDonationNotices,
  queueAbandonedMonthlyNotices,
} from "@/lib/server/donation-communications";

export const maxDuration = 300;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (
    !secret ||
    !secureEqual(request.headers.get("authorization") ?? "", `Bearer ${secret}`)
  )
    return new Response("Unauthorized", { status: 401 });
  try {
    await queueAbandonedMonthlyNotices();
    return Response.json(await flushDonationNotices(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    console.error("donation_communications_failed");
    return Response.json(
      { error: "communications_unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
