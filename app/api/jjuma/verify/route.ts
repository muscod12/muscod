import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { transaction_id } = await request.json();

    if (
      typeof transaction_id !== "string" ||
      !/^TXN-[A-Za-z0-9-]+$/.test(transaction_id)
    ) {
      return NextResponse.json(
        { error: "Invalid transaction ID" },
        { status: 400 }
      );
    }

    const secretKey = process.env.JJUMA_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Payment verification not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.jjuma.com/api/v1/payments/verify/${encodeURIComponent(transaction_id)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 502 }
      );
    }

    const result = await response.json();

    // Temporary: do not expose payment details or update orders.
    console.log("Jjuma verification response structure:", {
      topLevelKeys: Object.keys(result),
      dataKeys:
        result.data && typeof result.data === "object"
          ? Object.keys(result.data)
          : [],
    });

    return NextResponse.json({
      verified_response_received: true,
transaction_status: result.data?.status ?? null,
payment_status: result.data?.payment_status ?? null,
    });
  } catch (error) {
    console.error("Payment verification request failed:", error);

    return NextResponse.json(
      { error: "Unable to verify payment" },
      { status: 500 }
    );
  }
}