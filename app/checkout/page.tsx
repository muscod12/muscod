"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
type BagItem = {
  name: string;
  color: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

export default function CheckoutPage() {
  const [bag, setBag] = useState<BagItem[]>([]);
  const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  phone: "",
  city: "",
  district: "",
  address: "",
  paymentMethod: "",
});

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const { name, value } = e.target;

  setFormData((previous) => ({
    ...previous,
    [name]: value,
  }));
};
const handlePlaceOrder = async () => {
  if (
    !formData.fullName ||
    !formData.email ||
    !formData.phone ||
    !formData.city ||
    !formData.district ||
    !formData.address ||
    !formData.paymentMethod
  ) {
    alert("Please complete all required fields before placing your order.");
    return;
  }

  if (bag.length === 0) {
    alert("Your bag is empty.");
    return;
  }
const order = {
  id: `MUSCOD-${Date.now()}`,
  customer: {
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    city: formData.city,
    district: formData.district,
    address: formData.address,
  },
  paymentMethod: formData.paymentMethod,
  items: bag,
  total: bag.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ),
  status: "Pending",
  createdAt: new Date().toISOString(), 
};

const { error } = await supabase
  .from("orders")
  .insert({
    order_id: order.id,
    created_at: order.createdAt,
    customer_name: order.customer.fullName,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone,
    customer_address: order.customer.address,
    customer_city: order.customer.city,
    customer_district: order.customer.district,
    payment_method: order.paymentMethod,
    items: order.items,
    total: order.total,
    status: order.status,
  });

if (error) {
console.error("Supabase order error:", JSON.stringify(error, null, 2));
  alert("There was a problem placing your order. Please try again.");
  return;
}
  localStorage.removeItem("muscodBag");
window.location.href = "/order-confirmation";
};

  useEffect(() => {
    const savedBag = JSON.parse(
      localStorage.getItem("muscodBag") || "[]"
    );

    setBag(savedBag);
  }, []);

  const subtotal = bag.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-white text-black">
      {/* HEADER */}
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
          <a href="/" className="text-2xl font-black tracking-tight">
            MUSCOD
          </a>

          <a
            href="/bag"
            className="text-xs font-bold uppercase tracking-[0.2em]"
          >
            Back to Bag
          </a>
        </div>
      </header>

      {/* CHECKOUT */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <h1 className="text-5xl font-black uppercase md:text-7xl">
          Checkout
        </h1>

        <div className="mt-12 grid gap-16 lg:grid-cols-[1fr_420px]">
          {/* CUSTOMER DETAILS */}
          <div>
            <h2 className="text-xl font-black uppercase">
              Contact Information
            </h2>

            <div className="mt-6 grid gap-4">
  <input
  type="text"
  name="fullName"
  placeholder="Full Name"
  value={formData.fullName}
  onChange={handleChange}
  required
  className="border border-black/30 px-4 py-4 outline-none focus:border-black"
/>

<input
  type="email"
  name="email"
  placeholder="Email Address"
  value={formData.email}
  onChange={handleChange}
  required
  className="border border-black/30 px-4 py-4 outline-none focus:border-black"
/>

<input
  type="tel"
  name="phone"
  placeholder="Phone Number"
  value={formData.phone}
  onChange={handleChange}
  required
  className="border border-black/30 px-4 py-4 outline-none focus:border-black"
/>
            </div>

            <h2 className="mt-12 text-xl font-black uppercase">
              Delivery Details
            </h2>

            <div className="mt-6 grid gap-4">
              <input
  type="text"
  name="city"
  placeholder="Province / City"
  value={formData.city}
  onChange={handleChange}
  required
  className="border border-black/30 px-4 py-4 outline-none focus:border-black"
/>

<input
  type="text"
  name="district"
  placeholder="District"
  value={formData.district}
  onChange={handleChange}
  required
  className="border border-black/30 px-4 py-4 outline-none focus:border-black"
/>

<input
  type="text"
  name="address"
  placeholder="Delivery Address"
  value={formData.address}
  onChange={handleChange}
  required
  className="border border-black/30 px-4 py-4 outline-none focus:border-black"
/>
            </div>

            <h2 className="mt-12 text-xl font-black uppercase">
              Payment Method
            </h2>

            <div className="mt-6 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 border border-black/20 p-4">
                <input
  type="radio"
  name="paymentMethod"
  value="mobile-money"
  checked={formData.paymentMethod === "mobile-money"}
  onChange={handleChange}
  required
/>
                <span className="font-bold">Mobile Money</span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 border border-black/20 p-4">
                <input
  type="radio"
  name="paymentMethod"
  value="card"
  checked={formData.paymentMethod === "card"}
  onChange={handleChange}
/>
                <span className="font-bold">Card Payment</span>
              </label>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div>
            <div className="border-t border-black pt-8">
              <h2 className="text-2xl font-black uppercase">
                Your Order
              </h2>

              <div className="mt-6 space-y-6">
                {bag.map((item, index) => (
                  <div
                    key={`${item.name}-${item.size}-${index}`}
                    className="flex gap-4 border-b border-black/10 pb-6"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-20 object-cover"
                    />

                    <div className="flex flex-1 justify-between gap-4">
                      <div>
                        <p className="font-bold uppercase">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          Size: {item.size}
                        </p>

                        <p className="text-xs text-neutral-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-bold">
                        {(item.price * item.quantity).toLocaleString()} RWF
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-bold">
                  {subtotal.toLocaleString()} RWF
                </span>
              </div>

              <div className="mt-5 flex justify-between border-t border-black/20 pt-5 text-xl font-black">
                <span>Total</span>
                <span>{subtotal.toLocaleString()} RWF</span>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="mt-8 w-full bg-black py-5 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
              >
                Place Order
              </button>

              <p className="mt-4 text-xs leading-5 text-neutral-500">
                Payment will not be processed until your order details are
                confirmed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}