"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminReviewsPage() {
  const router = useRouter();

  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const checkAdmin = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    router.push("/admin/login");
    return;
  }
};

checkAdmin();  
    const loadReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading reviews:", error);
      } else {
        setReviews(data || []);
      }

      setLoading(false);
    };

    loadReviews();
  }, []);
const deleteReview = async (id: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this review?"
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting review:", error);
    alert("Could not delete the review.");
    return;
  }

  setReviews((prevReviews) =>
    prevReviews.filter((review) => review.id !== id)
  );
};
  return (
    <main className="min-h-screen bg-white text-black px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-bold tracking-[0.3em] mb-3">
          MUSCOD ADMIN
        </p>

        <h1 className="text-4xl font-black mb-10">
          CUSTOMER REVIEWS
        </h1>

        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No customer reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((item) => (
              <div
                key={item.id}
                className="border border-black p-6"
              >
                <div className="flex justify-between gap-4 mb-3">
                  <div>
                    <p className="font-black">{item.name}</p>
                    <p className="text-sm text-neutral-500">
                      {item.product}
                    </p>
                  </div>

                  <p className="text-lg">
                    {"★".repeat(item.rating)}
                    {"☆".repeat(5 - item.rating)}
                  </p>
                </div>

                <p className="mb-3">{item.review}</p>

                <p className="text-xs text-neutral-500">
                  {new Date(item.created_at).toLocaleString()}
                </p>

             <button
  onClick={() => deleteReview(item.id)}
  className="mt-4 bg-black text-white px-5 py-2 text-xs font-bold uppercase tracking-wider"
>
  Delete Review
</button>   
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}