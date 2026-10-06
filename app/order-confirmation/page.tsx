"use client";

export default function OrderConfirmationPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white text-black">
      {/* HEADER */}
      <header className="border-b border-black/10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
          <a href="/" className="text-2xl font-black tracking-tight">
            MUSCOD
          </a>

          <a
            href="/"
            className="text-xs font-bold uppercase tracking-[0.2em]"
          >
            Continue Shopping
          </a>
        </div>
      </header>

      {/* CONFIRMATION */}
      <section className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="w-full max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em]">
            MUSCOD / Order Confirmed
          </p>

          <h1 className="mt-6 text-5xl font-black uppercase leading-none md:text-7xl">
            Thank You
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-neutral-600">
            Your order has been received. We will contact you using the
            information provided during checkout to confirm your order and
            delivery details.
          </p>

          <div className="mx-auto mt-10 max-w-md border-y border-black/20 py-6">
            <p className="text-sm font-bold uppercase">
              Order Status
            </p>

            <p className="mt-2 text-sm text-neutral-600">
              Confirmation pending
            </p>
          </div>

          <a
            href="/"
            className="mt-10 inline-block bg-black px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
          >
            Continue Shopping
          </a>
        </div>
      </section>
    </main>
  );
}