'use client';

import { useState, useEffect } from 'react';

type Category = {
  id: string;
  name: string;
  type: 'income' | 'expense';
  monthlyTarget: number | null;
};

export default function CategoriesPage() {
  const [form, setForm] = useState({
    name: '',
    type: 'expense',
    monthlyTarget: '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');

  const predefinedCategories = {
    'Monthly Expenses': ['Rent', 'Grocery Shopping', 'Internet', 'Travel Charge'],
    'Employee Expenses': ['Training', 'Client Meetings', 'Team Lunch', 'Travel Reimbursement'],
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch {
      setError('Failed to load categories');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          monthlyTarget: parseFloat(form.monthlyTarget),
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || 'Failed to add category');
        return;
      }

      setForm({ name: '', type: 'expense', monthlyTarget: '' });
      fetchCategories();
    } catch {
      setError('Failed to add category');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const usedCategoryNames = categories.map((cat) => cat.name);

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Category</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-xl mx-auto p-6 rounded-lg shadow-lg space-y-4 border border-gray-300"
      >
        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Category Name</label>
          <select
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {Object.entries(predefinedCategories).map(([group, items]) => {
              const filteredItems = items.filter((item) => !usedCategoryNames.includes(item));
              if (filteredItems.length === 0) return null;
              return (
                <optgroup key={group} label={group}>
                  {filteredItems.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="expense">Expense</option>
            <option value="income">Revenue</option>
          </select>
        </div>

        {/* Monthly Target */}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#d4db6a] hover:bg-blue-700 text-black font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Add Category
        </button>
      </form>

      {/* Error */}
      {error && (
        <p className="max-w-xl mx-auto mt-4 text-red-600 text-center font-medium">{error}</p>
      )}

      {/* Existing Categories */}
      <div className="mt-10 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Existing Categories</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500 italic">No categories added yet.</p>
        ) : (
          <ul className="space-y-3">
            {categories.map((cat) => (
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
