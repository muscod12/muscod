"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
export default function AdminOrdersPage() {
  const router = useRouter();


  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("All");

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
  const loadOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading orders:", error);
      return;
    }

    setOrders(data || []);
  };

  loadOrders();
}, []);
const updateOrderStatus = async (
  orderId: string,
  newStatus: string
) => {
  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("order_id", orderId);

  if (error) {
    console.error("Error updating order status:", error);
    alert("Could not update the order status.");
    return;
  }

  setOrders((currentOrders) =>
    currentOrders.map((order) =>
      order.order_id === orderId
        ? { ...order, status: newStatus }
        : order
    )
  );
};

const deleteOrder = async (orderId: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this order?"
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("order_id", orderId);

  if (error) {
    console.error("Error deleting order:", error);
    alert("Could not delete the order.");
    return;
  }

  setOrders((currentOrders) =>
    currentOrders.filter((order) => order.order_id !== orderId)
  );
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push("/admin/login");
  router.refresh();
};

const filteredOrders = orders.filter((order) => {
  const search = searchTerm.toLowerCase();

  const matchesSearch =
    order.order_id?.toLowerCase().includes(search) ||
    order.customer_name?.toLowerCase().includes(search) ||
    order.customer_email?.toLowerCase().includes(search) ||
    order.customer_phone?.toLowerCase().includes(search);

  const matchesStatus =
    statusFilter === "All" ||
    order.status === statusFilter;

  return matchesSearch && matchesStatus;
});
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <div className="flex items-end justify-between border-b border-black pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em]">
              MUSCOD / ADMIN
            </p>

            <h1 className="mt-3 text-4xl font-black uppercase md:text-6xl">
              Orders
            </h1>
          </div>

          <p className="text-sm font-bold uppercase">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </p>
          <button
  onClick={handleLogout}
  className="mt-3 text-xs font-bold uppercase underline"
>
  Log Out
</button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_240px]">
  <input
    type="text"
    placeholder="Search by name, email, phone or order ID..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border border-black/30 px-4 py-3 text-sm outline-none focus:border-black"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border border-black/30 bg-white px-4 py-3 text-sm font-bold uppercase outline-none focus:border-black"
  >
    <option value="All">All Statuses</option>
    <option value="Pending">Pending</option>
    <option value="Confirmed">Confirmed</option>
    <option value="Ready">Ready</option>
    <option value="Shipped">Shipped</option>
    <option value="Completed">Completed</option>
    <option value="Cancelled">Cancelled</option>
  </select>
</div>

        {orders.length === 0 ? (
          <div className="py-24 text-center">
            <h2 className="text-2xl font-black uppercase">
              No orders yet
            </h2>

            <p className="mt-3 text-sm text-neutral-500">
              Customer orders will appear here.
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
  <div className="py-24 text-center">
    <h2 className="text-2xl font-black uppercase">
      No matching orders found
    </h2>

    <p className="mt-3 text-sm text-neutral-500">
      Try changing your search or status filter.
    </p>
  </div>
) : (
  <div className="mt-10 space-y-8">
          {filteredOrders
              .slice()
              .reverse()
              .map((order) => (
                <div
                  key={order.order_id}
                  className="border border-black/20 p-6 md:p-8"
                >
                  <div className="flex flex-col gap-4 border-b border-black/20 pb-6 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em]">
                        Order ID
                      </p>

                      <h2 className="mt-2 text-xl font-black">
                        {order.order_id}
                      </h2>
                    </div>

                    <div className="md:text-right">
                      <p className="text-xs font-bold uppercase">
                        Status
                      </p>

                      <select
  value={order.status}
  onChange={(e) =>
   updateOrderStatus(order.order_id, e.target.value)
  }
  className="mt-2 border border-black px-3 py-2 text-sm font-bold uppercase outline-none"
>
  <option value="Pending">Pending</option>
  <option value="Confirmed">Confirmed</option>
  <option value="Ready">Ready</option>
  <option value="Shipped">Shipped</option>
  <option value="Completed">Completed</option>
  <option value="Cancelled">Cancelled</option>
</select>
                    </div>
                  </div>

                  <div className="grid gap-8 py-6 md:grid-cols-2">
                    <div>
                      <h3 className="font-black uppercase">
                        Customer
                      </h3>

                      <div className="mt-4 space-y-2 text-sm">
                        <p>{order.customer_name}</p>
<p>{order.customer_email}</p>
<p>{order.customer_phone}</p>
                       <p>
  {order.customer_address},{" "}
  {order.customer_district},{" "}
  {order.customer_city}
</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-black uppercase">
                        Payment
                      </h3>

                      <div className="mt-4 space-y-2 text-sm">
                        <p>
                          Method:{" "}
                          <span className="font-bold">
                            {order.payment_method}
                          </span>
                        </p>

                        <p>
                          Date:{" "}
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-black/20 pt-6">
                    <h3 className="font-black uppercase">
                      Items
                    </h3>

                    <div className="mt-4 space-y-4">
                      {order.items.map((item: any, index: number) => (
                        <div
                          key={`${item.name}-${item.size}-${index}`}
                          className="flex justify-between gap-6 border-b border-black/10 pb-4 text-sm"
                        >
                          <div>
                            <p className="font-bold uppercase">
                              {item.name}
                            </p>

                            <p className="mt-1 text-neutral-500">
                              {item.color} / Size {item.size} / Qty{" "}
                              {item.quantity}
                            </p>
                          </div>

                          <p className="font-bold">
                            {(
                              item.price * item.quantity
                            ).toLocaleString()}{" "}
                            RWF
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-between text-xl font-black uppercase">
                      <span>Total</span>
                      <span>
                        {order.total.toLocaleString()} RWF
                      </span>
                    </div>
                    <button
  onClick={() => deleteOrder(order.order_id)}
  className="mt-6 border border-black px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] transition hover:bg-black hover:text-white"
>
  Delete Order
</button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </main>
  );
}