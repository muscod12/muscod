"use client";

import { useEffect, useState } from "react";
type BagItem = {
  name: string;
  color: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

export default function BagPage() {
  const [bag, setBag] = useState<BagItem[]>([]);

  useEffect(() => {
    const savedBag = JSON.parse(
      localStorage.getItem("muscodBag") || "[]"
    );

    setBag(savedBag);
  }, []);
  const removeItem = (indexToRemove: number) => {
  const updatedBag = bag.filter(
    (_, index) => index !== indexToRemove
  );

  setBag(updatedBag);

  localStorage.setItem(
    "muscodBag",
    JSON.stringify(updatedBag)
  );
};
const increaseQuantity = (index: number) => {
  const updatedBag = [...bag];
  updatedBag[index].quantity += 1;

  setBag(updatedBag);
  localStorage.setItem("muscodBag", JSON.stringify(updatedBag));
};

const decreaseQuantity = (index: number) => {
  const updatedBag = [...bag];

  if (updatedBag[index].quantity > 1) {
    updatedBag[index].quantity -= 1;

    setBag(updatedBag);
    localStorage.setItem("muscodBag", JSON.stringify(updatedBag));
  }
};
  return (
    <main className="min-h-screen bg-white text-black">
      {/* HEADER */}
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
          <a href="/" className="text-2xl font-black tracking-tight">
            MUSCOD
          </a>

          <a
            href="/"
            className="text-xs font-bold uppercase tracking-[0.2em] hover:opacity-60"
          >
            Continue Shopping
          </a>
        </div>
      </header>

      {/* BAG */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <div className="flex items-end justify-between border-b border-black pb-6">
          <h1 className="text-5xl font-black uppercase md:text-7xl">
            Your Bag
          </h1>

          <p className="text-sm font-bold uppercase">
  {bag.length} {bag.length === 1 ? "Item" : "Items"}
</p>
        </div>

        {/* BAG CONTENT */}
{bag.length === 0 ? (
  <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
    <p className="text-2xl font-black uppercase">
      Your bag is empty.
    </p>

    <p className="mt-3 max-w-md text-sm leading-6 text-neutral-500">
      Your selected MUSCOD pieces will appear here.
    </p>

    <a
      href="/#new"
      className="mt-8 bg-black px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
    >
      Shop New Drop
    </a>
  </div>
) : (
  <div className="py-10">
    {bag.map((item, index) => (
      <div
        key={`${item.name}-${item.size}-${index}`}
        className="grid grid-cols-[120px_1fr] gap-6 border-b border-black/20 py-8 md:grid-cols-[180px_1fr_auto]"
      >
        <div className="bg-[#f3f3f3]">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h2 className="text-xl font-black uppercase">
            {item.name}
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Color: {item.color}
          </p>

          <p className="mt-1 text-sm text-neutral-500">
            Size: {item.size}
          </p>
          <button
  onClick={() => removeItem(index)}
  className="mt-4 text-xs font-bold uppercase tracking-[0.15em] underline hover:opacity-60"
>
  Remove
</button>

          <div className="mt-4 flex items-center gap-4">
  <button
  onClick={() => decreaseQuantity(index)}
  className="flex h-8 w-8 items-center justify-center border border-black text-lg font-bold hover:bg-black hover:text-white"
>
  −
</button>

<span className="text-sm font-bold">
  {item.quantity}
</span>
  <button
    onClick={() => increaseQuantity(index)}
    className="flex h-8 w-8 items-center justify-center border border-black text-lg font-bold hover:bg-black hover:text-white"
  >
    +
  </button>
</div>
        </div>

        <p className="mt-4 font-bold md:mt-0">
          {(item.price * item.quantity).toLocaleString()} RWF
        </p>
      </div>
    ))}
  </div>
)}
{bag.length > 0 && (
  <div className="mt-12 ml-auto max-w-md border-t border-black pt-8">
    <h2 className="text-2xl font-black uppercase">
      Order Summary
    </h2>

    <div className="mt-6 flex justify-between text-sm">
      <span>Subtotal</span>
      <span className="font-bold">
        {bag
          .reduce(
            (total, item) => total + item.price * item.quantity,
            0
          )
          .toLocaleString()}{" "}
        RWF
      </span>
    </div>

    <div className="mt-4 flex justify-between border-t border-black/20 pt-4 text-lg font-black">
      <span>Total</span>
      <span>
        {bag
          .reduce(
            (total, item) => total + item.price * item.quantity,
            0
          )
          .toLocaleString()}{" "}
        RWF
      </span>
    </div>

   <a
  href="/checkout"
  className="mt-8 block w-full bg-black py-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
>
  Checkout
</a>
  </div>
)}
      </section>
    </main>
  );
}