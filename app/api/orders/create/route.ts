
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { productCatalog } from "@/lib/productCatalog";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, paymentMethod, items } = body;

    if (
      !customer ||
      !["fullName", "email", "phone", "city", "district", "address"]
        .every(
          (field) =>
            typeof customer[field] === "string" &&
            customer[field].trim().length > 0
        ) ||
      !["mobile-money", "card"].includes(paymentMethod) ||
      !Array.isArray(items) ||
      items.length === 0 ||
      items.length > 50
    ) {
      return NextResponse.json(
        { error: "Invalid order information." },
        { status: 400 }
      );
    }

    let total = 0;

    const verifiedItems = [];

    for (const item of items) {
      if (
        !item ||
        typeof item.name !== "string" ||
        !Object.prototype.hasOwnProperty.call(
          productCatalog,
          item.name
        ) ||
        typeof item.quantity !== "number" ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 20 ||
        typeof item.size !== "string" ||
        !["XS", "S", "M", "L", "XL", "XXL"].includes(item.size)
      ) {
        return NextResponse.json(
          { error: "Invalid product, size or quantity." },
          { status: 400 }
        );
      }

      const price = productCatalog[item.name];
      total += price * item.quantity;

      verifiedItems.push({
        name: item.name,
        color: typeof item.color === "string" ? item.color : "",
        image: typeof item.image === "string" ? item.image : "",
        size: item.size,
        quantity: item.quantity,
        price,
      });
    }

    if (!Number.isSafeInteger(total) || total <= 0) {
      return NextResponse.json(
        { error: "Invalid order total." },
        { status: 400 }
      );
    }

    const orderId = `MUSCOD-${crypto.randomUUID()}`;

    const { error } = await supabaseAdmin
      .from("orders")
      .insert({
        order_id: orderId,
        created_at: new Date().toISOString(),
        customer_name: customer.fullName.trim(),
        customer_email: customer.email.trim(),
        customer_phone: customer.phone.trim(),
        customer_address: customer.address.trim(),
        customer_city: customer.city.trim(),
        customer_district: customer.district.trim(),
        payment_method: paymentMethod,
        items: verifiedItems,
        total,
        status: "Pending",
      });

    if (error) {
      console.error("Order creation failed:", error.message);
      return NextResponse.json(
        { error: "Could not create order." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      order_id: orderId,
      total,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not process order." },
      { status: 500 }
    );
  }
}
