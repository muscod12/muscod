import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  const secret = process.env.JJUMA_WEBHOOK_SECRET;

  if (!secret) {
    console.error("Missing JJUMA_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const timestamp = request.headers.get("X-Jjuma-Timestamp") || "";
  const signature = request.headers.get("X-Jjuma-Signature") || "";
  console.log("Jjuma webhook header diagnostics:", {
  timestampPresent: Boolean(timestamp),
  timestampLength: timestamp.length,
  signaturePresent: Boolean(signature),
  signatureLength: signature.length,
  headerNames: Array.from(request.headers.keys()),
});

  const rawBody = await request.text();
  const timestampNumber = Number(timestamp);

if (
  !/^\d{10,13}$/.test(timestamp) ||
  !Number.isSafeInteger(timestampNumber)
) {
  return NextResponse.json(
    { error: "Invalid webhook timestamp" },
    { status: 401 }
  );
}

const timestampMs =
  timestamp.length === 10
    ? timestampNumber * 1000
    : timestampNumber;

const fiveMinutes = 5 * 60 * 1000;

if (Math.abs(Date.now() - timestampMs) > fiveMinutes) {
  return NextResponse.json(
    { error: "Expired webhook timestamp" },
    { status: 401 }
  );
}

  const expected = createHmac("sha256", secret)
    .update(timestamp + "." + rawBody)
    .digest("hex");

  const supplied = signature.replace(/^sha256=/i, "");

  const validFormat = /^[a-f0-9]{64}$/i.test(supplied);

  const validSignature =
    validFormat &&
    timingSafeEqual(
      Buffer.from(supplied, "hex"),
      Buffer.from(expected, "hex")
    );

  if (!validSignature) {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 401 }
    );
  }

  let event;

try {
  event = JSON.parse(rawBody);
} catch {
  return NextResponse.json(
    { error: "Invalid webhook JSON" },
    { status: 400 }
  );
}

console.log("Jjuma webhook event:", {
  event: event.event,
  reference: event.reference,
  status: event.status,
});
if (event.event !== "payment.completed") {
  return NextResponse.json({
    received: true,
    message: "Event acknowledged",
  });
}
if (
  typeof event.reference !== "string" ||
  event.reference.trim() === ""
) {
  return NextResponse.json(
    { error: "Missing payment reference" },
    { status: 400 }
  );
}
 if (
  typeof event.amount !== "number" ||
  !Number.isFinite(event.amount) ||
  event.amount <= 0 ||
  event.currency !== "RWF" ||
  event.status !== "successful"
) {
  return NextResponse.json(
    { error: "Invalid payment details" },
    { status: 400 }
  );
} 
const { data: order, error: lookupError } = await supabaseAdmin
  .from("orders")
  .select("order_id, total, status, payment_reference")
  .eq("payment_reference", event.reference)
  .maybeSingle();

if (lookupError) {
  console.error("Order lookup failed:", lookupError);
  return NextResponse.json(
    { error: "Unable to find order" },
    { status: 500 }
  );
}


if (!order) {
  return NextResponse.json(
    { error: "No matching MUSCOD order" },
    { status: 404 }
  );
}

if (Number(order.total) !== event.amount) {
  console.error("Payment amount mismatch");

  return NextResponse.json(
    { error: "Payment amount does not match order" },
    { status: 400 }
  );
}
if (order.status === "Confirmed") {
  return NextResponse.json({
    received: true,
    message: "Payment already confirmed",
  });
}
const { data: updatedOrders, error: updateError } = await supabaseAdmin
  .from("orders")
  .update({ status: "Confirmed" })
  .eq("order_id", order.order_id)
.eq("payment_reference", event.reference)
.eq("status", "Pending")
.select("order_id");

if (updateError || !updatedOrders || updatedOrders.length !== 1) {
  console.error("Failed to confirm paid order:", updateError);

  return NextResponse.json(
    { error: "Could not confirm payment" },
    { status: 500 }
  );
}
return NextResponse.json({
    received: true,
  });
}