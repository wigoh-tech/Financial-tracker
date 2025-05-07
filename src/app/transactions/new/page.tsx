'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import  getJWTClient  from "@/lib/getJWTClient";

export default function NewTransactionPage() {
  const [form, setForm] = useState({ amount: "", description: "", due_date: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.due_date) return setError("Amount and due date are required");

    try {
      const token = await getJWTClient();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(form.amount),
          description: form.description,
          due_date: form.due_date,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      router.push("/");
    } catch (err) {
      setError("Error creating transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <input name="amount" type="number" placeholder="Amount" onChange={handleChange} className="w-full border p-2" />
      <input name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2" />
      <input name="due_date" type="date" onChange={handleChange} className="w-full border p-2" />
      {error && <p className="text-red-600">{error}</p>}
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create Transaction</button>
    </form>
  );
}
