'use client';

import { collection, query, where } from "firebase/firestore";
import { db, auth } from "../../firebase/client";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "../../firebase/firestore/use-collection";

export default function OrderPage() {
  const [user, authLoading] = useAuthState(auth);

  const ordersQuery =
    !authLoading && user
      ? query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        )
      : null;

  const { data: orders, isLoading, error } = useCollection(ordersQuery);

  if (authLoading || isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!orders || orders.length === 0) return <p>No orders found</p>;

  return (
    <div>
      <h2>My Orders</h2>
      {orders.map(order => (
        <div key={order.id}>
          <p>Order ID: {order.id}</p>
          <p>Status: {(order as any).status}</p>
        </div>
      ))}
    </div>
  );
}
