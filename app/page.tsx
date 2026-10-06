"use client";

import { useState } from "react";
const products = [
  {
    name: "Classic Hefting Vest",
    color: "Red",
    image: "/vest-red.jpg",
    price: "25,000 RWF",
  },
  {
    name: "MUSCOD Heavy Tee",
    color: "Coral",
    image: "/tee-coral.jpg",
    price: "25,000 RWF",
  },
  {
    name: "Classic Hefting Tee",
    color: "Washed Blue",
    image: "/tee-blue.jpg",
    price: "25,000 RWF",
  },
  {
    name: "How Bad Do You Want It Tee",
    color: "White",
    image: "/tee-white.jpg",
    price: "25,000 RWF",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <main className="bg-white text-black">

      {/* ANNOUNCEMENT */}
      <div className="bg-black text-white text-center py-3 text-xs tracking-[0.25em] font-semibold">
        MUSCOD — CLASSIC HEFTING · EST. 2022
      </div>

      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          <div className="text-3xl font-black tracking-[-0.08em]">
            MUSCOD
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold">
            <a href="#shop">NEW DROP</a>
            <a href="#shop">SHOP</a>
            <a href="#collection">COLLECTION</a>
            <a href="#story">OUR STORY</a>
          </div>

          <div className="flex items-center gap-3 md:gap-5 text-xs md:text-sm font-bold">
            <button
  className="md:hidden"
  onClick={() => setMenuOpen(!menuOpen)}
>
  {menuOpen ? "CLOSE" : "MENU"}
</button>
            <button className="hidden md:block">SEARCH</button>
<button className="hidden md:block">ACCOUNT</button>
            <button>BAG (0)</button>
          </div>

        </div>
      </nav>
{menuOpen && (
  <div className="md:hidden bg-white border-b border-black px-6 py-6">
    <div className="flex flex-col gap-5 text-sm font-bold">
  <a href="#shop" onClick={() => setMenuOpen(false)}>NEW DROP</a>
  <a href="#shop" onClick={() => setMenuOpen(false)}>SHOP</a>
  <a href="#collection" onClick={() => setMenuOpen(false)}>COLLECTION</a>
  <a href="#story" onClick={() => setMenuOpen(false)}>OUR STORY</a>
  <a href="#search" onClick={() => setMenuOpen(false)}>SEARCH</a>
  <a href="/account" onClick={() => setMenuOpen(false)}>ACCOUNT</a>
</div>
  </div>
)}
      {/* HERO */}
      <section className="relative min-h-[85vh] bg-black text-white overflow-hidden">

        <img
          src="/vest-red.jpg"
          alt="MUSCOD Classic Hefting Vest"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 min-h-[85vh] flex items-end">
          <div className="max-w-7xl mx-auto w-full px-6 pb-16 md:pb-24">

            <p className="text-sm tracking-[0.3em] font-bold mb-5">
              EST. 2022 · CLASSIC HEFTING
            </p>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-[-0.07em] leading-[0.85] max-w-5xl">
              MOVE
              <br />
              DIFFERENT.
            </h1>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#new"
                className="bg-white text-black px-8 py-4 font-bold text-sm tracking-wider hover:bg-gray-200 transition"
              >
                SHOP NEW DROP
              </a>

              <a
                href="#collection"
                className="border border-white text-white px-8 py-4 font-bold text-sm tracking-wider hover:bg-white hover:text-black transition"
              >
                EXPLORE COLLECTION
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* NEW DROP */}
      <section id="shop" className="py-20 md:py-28">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] mb-3">
                MUSCOD
              </p>

              <h2 className="text-5xl md:text-7xl font-black tracking-[-0.06em]">
                NEW DROP
              </h2>
            </div>

            <a
              href="#shop"
              className="hidden md:block text-sm font-bold underline underline-offset-4"
            >
              VIEW ALL
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">

            {products.map((product) => (
              <a
  key={product.name}
 href={
  product.name === "Classic Hefting Vest"
    ? "/product/classic-hefting-vest"
    : product.name === "MUSCOD Heavy Tee"
    ? "/product/muscod-heavy-tee"
    : product.name === "Classic Hefting Tee"
    ? "/product/classic-hefting-tee"
    : product.name === "How Bad Do You Want It Tee"
    ? "/product/how-bad-do-you-want-it-tee"
    : "#"
}

  className="group cursor-pointer block"
>

                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="pt-4">
                  <h3 className="font-bold text-sm md:text-base">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {product.color}
                  </p>

                  <p className="font-bold text-sm mt-2">
                    {product.price}
                  </p>
                </div>

             </a> 
            ))}

          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section
        id="collection"
        className="bg-black text-white py-24 md:py-36"
      >

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div>
              <p className="text-xs tracking-[0.3em] font-bold mb-5">
                THE COLLECTION
              </p>

              <h2 className="text-6xl md:text-8xl font-black tracking-[-0.07em] leading-[0.85]">
                CLASSIC
                <br />
                HEFTING.
              </h2>

              <p className="mt-8 text-gray-300 max-w-md leading-relaxed">
                Built around discipline, strength and the work nobody sees.
                MUSCOD is made for those who keep showing up.
              </p>

              <button className="mt-8 bg-white text-black px-8 py-4 font-bold text-sm tracking-wider hover:bg-gray-200 transition">
                SHOP THE COLLECTION
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <img
                src="/tee-blue.jpg"
                alt="MUSCOD Washed Blue Tee"
                className="w-full aspect-[3/4] object-cover"
              />

              <img
                src="/tee-white.jpg"
                alt="MUSCOD White Tee"
                className="w-full aspect-[3/4] object-cover mt-12"
              />
            </div>

          </div>

        </div>
      </section>

      {/* SHOP */}
      <section id="story" className="py-20 md:py-28">

        <div className="max-w-7xl mx-auto px-6 text-center">

          <p className="text-xs tracking-[0.3em] font-bold mb-4">
            BUILT FOR THE GRIND
          </p>

          <h2 className="text-5xl md:text-7xl font-black tracking-[-0.06em]">
            NOT JUST WHAT
            <br />
            YOU WEAR.
          </h2>

          <p className="max-w-xl mx-auto mt-7 text-gray-600 leading-relaxed">
            It's how you move. It's how you train. It's how you show up when
            nobody is watching.
          </p>

        </div>
      </section>

      {/* NEWSLETTER */}
<section className="bg-[#f3f3f3] py-28">
  <div className="mx-auto max-w-4xl px-6 text-center">
    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-neutral-500">
      Newsletter
    </p>

    <h2 className="text-5xl font-black uppercase leading-none md:text-7xl">
      STAY IN THE
      <br />
      MOVEMENT.
    </h2>

    <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-600">
      Be first to access new drops, limited collections and exclusive MUSCOD releases.
    </p>

    <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-3 md:flex-row">
      <input
        type="email"
        placeholder="Enter your email"
        className="h-14 flex-1 border border-black bg-white px-5 text-sm uppercase tracking-wide outline-none focus:ring-2 focus:ring-black"
      />

      <button className="h-14 bg-black px-10 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800">
        Join
      </button>
    </div>

    <p className="mt-5 text-xs uppercase tracking-[0.15em] text-neutral-500">
      No spam • Early access only
    </p>
  </div>
</section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-16">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

            <div className="col-span-2">
              <h2 className="text-4xl font-black tracking-[-0.06em]">
                MUSCOD
              </h2>

              <p className="text-gray-400 mt-4 max-w-sm">
                CLASSIC HEFTING. EST. 2022.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-5">SHOP</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <p>New Drop</p>
                <p>Men</p>
                <p>Women</p>
                <p>Collections</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-5">HELP</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <p>Contact</p>
                <p>Shipping</p>
                <p>Returns</p>
                <p>Size Guide</p>
              </div>
            </div>

          </div>

          <div className="border-t border-white/20 mt-14 pt-6 text-xs text-gray-500">
            © 2026 MUSCOD. ALL RIGHTS RESERVED.
          </div>

        </div>
      </footer>

      {/* SEARCH */}
<section id="search" className="py-20 px-6 bg-white text-black">
  <div className="max-w-3xl mx-auto">
    <p className="text-xs font-bold tracking-[0.3em] mb-4">
      MUSCOD
    </p>

    <h2 className="text-5xl md:text-7xl font-black tracking-[-0.06em] mb-8">
      SEARCH
    </h2>

    <input
  type="text"
  placeholder="SEARCH PRODUCTS"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full border-b-2 border-black py-4 text-lg outline-none"
/>
    {searchTerm && (
  <div className="mt-8 grid grid-cols-2 gap-4">
    {filteredProducts.length > 0 ? (
      filteredProducts.map((product) => (
       <a
  key={product.name}
  href={
    product.name === "Classic Hefting Vest"
      ? "/product/classic-hefting-vest"
      : product.name === "MUSCOD Heavy Tee"
      ? "/product/muscod-heavy-tee"
      : product.name === "Classic Hefting Tee"
      ? "/product/classic-hefting-tee"
      : product.name === "How Bad Do You Want It Tee"
      ? "/product/how-bad-do-you-want-it-tee"
      : "#"
  }
  className="block"
>
  <img
    src={product.image}
    alt={product.name}
    className="w-full aspect-[3/4] object-cover"
  />

  <h3 className="font-bold mt-3">{product.name}</h3>
  <p className="text-sm text-gray-500">{product.color}</p>
  <p className="font-bold mt-2">{product.price}</p>
</a>
      ))
    ) : (
      <p className="col-span-2 text-sm">
        NO PRODUCTS FOUND.
      </p>
    )}
  </div>
)}

  </div>
</section>

    </main>
  );
}