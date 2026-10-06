export async function paypalRequest(body: Record<string, unknown>) {
  const response = await fetch("/api/paypal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "paypal_unavailable");
  return data;
}
