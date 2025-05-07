'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import getJWTClient from "@/lib/getJWTClient";

export default function NewCategoryPage() {
  const [form, setForm] = useState({ name: "", type: "", monthly_target: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.type) return setError("All fields required");

    try {
      const token = await getJWTClient();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          monthly_target: parseFloat(form.monthly_target),
        }),
      });

      if (!res.ok) throw new Error("Failed");

      router.push("/"); // Redirect after success
    } catch (err) {
      setError("Error creating category");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2" />
      <select name="type" onChange={handleChange} className="w-full border p-2">
        <option value="">Select Type</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input name="monthly_target" placeholder="Monthly Target" type="number" onChange={handleChange} className="w-full border p-2" />
      {error && <p className="text-red-600">{error}</p>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Category</button>
    </form>
  );
}
