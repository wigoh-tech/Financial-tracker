'use client';

import { useState, useEffect } from 'react';

export default function CategoriesPage() {
  const [form, setForm] = useState({ name: '', type: 'expense', monthlyTarget: '' });
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({
        ...form,
        monthlyTarget: parseFloat(form.monthlyTarget),
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    setForm({ name: '', type: 'expense', monthlyTarget: '' });
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Category</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-xl mx-auto p-6 rounded-lg shadow-lg space-y-4 border border-gray-300"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Category Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Rent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Monthly Target ($)</label>
          <input
            value={form.monthlyTarget}
            onChange={(e) => setForm({ ...form, monthlyTarget: e.target.value })}
            type="number"
            step="0.01"
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 200.00"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Add Category
        </button>
      </form>

      <div className="mt-10 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Existing Categories</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500 italic">No categories added yet.</p>
        ) : (
          <ul className="space-y-3">
            {categories.map((cat: any) => (
              <li
                key={cat.id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-md bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-800">{cat.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{cat.type}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  ${Number(cat.monthlyTarget || 0).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
