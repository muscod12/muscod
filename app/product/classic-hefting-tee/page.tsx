"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
export default function ClassicHeftingTee() {
  const [selectedSize, setSelectedSize] = useState("");
  const [reviewName, setReviewName] = useState("");
const [rating, setRating] = useState(5);
const [reviewText, setReviewText] = useState("");
const [reviews, setReviews] = useState<any[]>([]);
useEffect(() => {
  const loadReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product", "Classic Hefting Tee")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading reviews:", error);
      return;
    }

    setReviews(data || []);
  };

  loadReviews();
}, []);
const submitReview = async () => {
  if (!reviewName.trim() || !reviewText.trim()) {
    alert("Please enter your name and review.");
    return;
  }

  const { error } = await supabase
    .from("reviews")
    .insert([
      {
        product: "Classic Hefting Tee",
        name: reviewName,
        rating: rating,
        review: reviewText,
      },
    ]);

  if (error) {
    console.error(error);
    alert("Could not submit review. Please try again.");
    return;
  }

  setReviews((prevReviews) => [
    {
      name: reviewName,
      rating: rating,
      review: reviewText,
      created_at: new Date().toISOString(),
    },
    ...prevReviews,
  ]);

  alert("Thank you! Your review has been submitted.");

  setReviewName("");
  setRating(5);
  setReviewText("");
};
  const addToBag = () => {
  if (!selectedSize) {
    alert("Please select a size.");
    return;
  }

  const product = {
    name: "Classic Hefting Tee",
    color: "Washed Blue",
    price: 25000,
    image: "/tee-blue.jpg",
    size: selectedSize,
    quantity: 1,
  };

  const currentBag = JSON.parse(
    localStorage.getItem("muscodBag") || "[]"
  );

const existingProduct = currentBag.find(
  (item: any) =>
    item.name === product.name &&
    item.size === product.size
);

if (existingProduct) {
  existingProduct.quantity += 1;
} else {
  currentBag.push(product);
}

  localStorage.setItem(
    "muscodBag",
    JSON.stringify(currentBag)
  );

  window.location.href = "/bag";
};
  return (
    <main className="min-h-screen bg-white text-black">
      {/* PRODUCT PAGE */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-2 md:px-10 md:py-16">
        
        {/* PRODUCT IMAGE */}
        <div className="bg-[#f3f3f3]">
          <img
            src="/tee-blue.jpg"
            alt="MUSCOD Classic Hefting Tee - Washed Blue"
            className="h-full w-full object-cover"
          />
        </div>

        {/* PRODUCT INFORMATION */}
        <div className="flex flex-col justify-center md:px-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em]">
            MUSCOD / Classic Hefting
          </p>

          <h1 className="text-4xl font-black uppercase leading-none md:text-6xl">
            Classic Hefting Tee
          </h1>

          <p className="mt-6 text-xl font-bold">
            25,000 RWF
          </p>

          <div className="mt-10 border-t border-black/20 pt-6">
            <p className="text-sm font-bold uppercase">
              Color
            </p>

            <div className="mt-3 flex items-center gap-3">
              <span className="h-5 w-5 rounded-full bg-[#6F8193] ring-1 ring-black" />
              <span className="text-sm">Washed Blue</span>
            </div>
          </div>

          {/* SIZE SELECTION */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold uppercase">
                Select Size
              </p>

              <button className="text-xs font-bold uppercase underline">
                Size Guide
              </button>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {["S", "M", "L", "XL"].map((size) => (
             <button
  key={size}
  type="button"
  onClick={() => setSelectedSize(size)}
  className={`border border-black py-4 text-sm font-bold transition ${
    selectedSize === size
      ? "bg-black text-white"
      : "bg-white text-black hover:bg-black hover:text-white"
  }`}
>
  {size}
</button>
              ))}
            </div>
          </div>

          {/* ADD TO BAG */}
          <button
          onClick={addToBag}
           className="mt-8 w-full bg-black py-5 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800">
            Add to Bag
          </button>

          <div className="mt-8 border-t border-black/20 pt-6">
            <p className="text-sm font-bold uppercase">
              Classic Hefting
            </p>

            <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-600">
              Built for movement. Designed with the MUSCOD Classic Hefting
              identity and made for those who keep showing up.
            </p>
          </div>

          <div className="mt-6 border-t border-black/20 pt-6 text-sm">
            <p className="font-bold uppercase">Shipping & Returns</p>
            <p className="mt-2 text-neutral-600">
              Shipping and return information will be available at checkout.
            </p>
          </div>
        </div>
      </section>

     {/* CUSTOMER REVIEWS */}
<section className="bg-white text-black px-6 py-12 border-t">
  <div className="max-w-7xl mx-auto">
    <p className="text-xs font-bold tracking-[0.3em] mb-3">
      CUSTOMER FEEDBACK
    </p>

    <h2 className="text-3xl font-black mb-6">
      REVIEWS
    </h2>

    {reviews.length > 0 ? (
      reviews.map((item) => (
        <div
          key={item.id || `${item.name}-${item.created_at}`}
          className="border-t border-black py-6"
        >
          <div className="flex justify-between items-center mb-3">
            <p className="font-bold">{item.name}</p>
            <p className="text-lg">
              {"★".repeat(item.rating)}
              {"☆".repeat(5 - item.rating)}
            </p>
          </div>

          <p className="text-neutral-600 leading-6">
            {item.review}
          </p>
        </div>
      ))
    ) : (
      <p className="text-neutral-600 mb-8">
        No reviews yet. Be the first to leave a review.
      </p>
    )}

    <div className="mt-10 border-t border-black pt-8">
      <h3 className="text-xl font-black mb-6">
        LEAVE A REVIEW
      </h3>

      <input
        type="text"
        placeholder="Your name"
        value={reviewName}
        onChange={(e) => setReviewName(e.target.value)}
        className="w-full border border-black p-4 mb-4 outline-none"
      />

      <div className="mb-4">
        <p className="font-bold mb-2">RATING</p>

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border border-black p-4"
        >
          <option value={5}>★★★★★ - 5</option>
          <option value={4}>★★★★☆ - 4</option>
          <option value={3}>★★★☆☆ - 3</option>
          <option value={2}>★★☆☆☆ - 2</option>
          <option value={1}>★☆☆☆☆ - 1</option>
        </select>
      </div>

      <textarea
        placeholder="Write your review"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        rows={5}
        className="w-full border border-black p-4 mb-4 outline-none"
      />

      <button
        onClick={submitReview}
        className="w-full bg-black text-white py-4 font-bold uppercase tracking-[0.2em]"
      >
        Submit Review
      </button>
    </div>
  </div>
</section> 
    </main>
  );
}