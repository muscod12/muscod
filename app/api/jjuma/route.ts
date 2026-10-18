
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { productCatalog } from "@/lib/productCatalog";

type OrderItem = {
  name: string;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { customer_name, customer_email, order_id } = body;

    if (
      typeof order_id !== "string" ||
      !order_id.trim() ||
      typeof customer_name !== "string" ||
      !customer_name.trim() ||
      typeof customer_email !== "string" ||
      !customer_email.trim()
    ) {
      return NextResponse.json(
        { error: "Invalid payment information." },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("order_id, total, status, items")
      .eq("order_id", order_id)
      .maybeSingle();

    if (orderError) {
      return NextResponse.json(
        { error: "Could not retrieve order." },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    if (
      typeof order.status !== "string" ||
      order.status.toLowerCase() !== "pending"
    ) {
      return NextResponse.json(
        { error: "This order cannot start a new payment." },
        { status: 409 }
      );
    }

    if (!Array.isArray(order.items) || order.items.length === 0) {
      return NextResponse.json(
        { error: "Order has no valid items." },
        { status: 400 }
      );
    }

    let expectedTotal = 0;

    for (const item of order.items as OrderItem[]) {
      if (
        !item ||
        typeof item.name !== "string" ||
        !Object.prototype.hasOwnProperty.call(
          productCatalog,
          item.name
        ) ||
        typeof item.quantity !== "number" ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return NextResponse.json(
          { error: "Invalid product or quantity." },
          { status: 400 }
        );
      }

      expectedTotal += productCatalog[item.name] * item.quantity;

      if (!Number.isSafeInteger(expectedTotal)) {
        return NextResponse.json(
          { error: "Invalid order amount." },
          { status: 400 }
        );
      }
    }

    if (expectedTotal !== Number(order.total)) {
      return NextResponse.json(
        { error: "Order total does not match product prices." },
        { status: 400 }
      );
    }

    const secretKey = process.env.JJUMA_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Jjuma API key is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.jjuma.com/api/v1/payments/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: expectedTotal,
          currency: "RWF",
          description: "MUSCOD Clothing Order",
          customer_name,
          customer_email,
          redirect_url:
            "https://muscod.vercel.app/order-confirmation",
          cancel_redirect_url:
            "https://muscod.vercel.app/checkout",
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Could not create payment." },
        { status: 502 }
      );
    }

    const payment = await response.json();

    if (
      payment.status !== "success" ||
      !payment.data?.payment_url ||
      typeof payment.data.payment_url !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid response from payment provider." },
        { status: 502 }
      );
    }

    
    const transactionId = payment.data.transaction_id;
    const reference = payment.data.reference;

    if (
      !transactionId ||
      !reference
    ) {
      return NextResponse.json(
        { error: "Payment reference is missing." },
        { status: 502 }
      );
    }

    const { data: savedOrder, error: saveError } =
      await supabaseAdmin
        .from("orders")
        .update({
          transaction_id: String(transactionId),
          payment_reference: String(reference),
        })
        .eq("order_id", order_id)
        .eq("status", "Pending")
        .select("order_id")
        .maybeSingle();

    if (saveError || !savedOrder) {
      return NextResponse.json(
        { error: "Could not link payment to order." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      payment_url: payment.data.payment_url,
      transaction_id: transactionId,
      reference,
    });

  } catch {
    return NextResponse.json(
      { error: "Could not process payment request." },
      { status: 500 }
    );
  }
}
