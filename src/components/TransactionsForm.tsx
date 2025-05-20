'use client';

import { useEffect, useState } from 'react';

export default function TransactionsForm() {
  const [form, setForm] = useState({
    amount: '',
    description: '',
    dueDate: '',
    type: 'expense',
    categoryId: '',
    isRecurring: false,
    recurrence: ''
  });

  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });
      setForm({
        amount: '',
        description: '',
        dueDate: '',
        type: 'expense',
        categoryId: '',
        isRecurring: false,
        recurrence: ''
      });
      fetchTransactions();
    } catch (err) {
      console.error('Failed to submit transaction:', err);
    }
  };

  const handleTogglePaid = async (id: number, isPaid: boolean) => {
    try {
      const res = await fetch(`/api/transactions/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isPaid }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        fetchTransactions(); // Refresh the list
      } else {
        console.error('Failed to update isPaid status');
      }
    } catch (err) {
      console.error('Error updating isPaid:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-white text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Add Transaction</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white text-black max-w-xl mx-auto p-6 rounded-lg shadow-lg space-y-4 border border-gray-300"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., 100.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Grocery shopping"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="expense">Expense</option>
            <option value="income">Revenue</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Recurring</label>
          <input
            type="checkbox"
            checked={form.isRecurring}
            onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })}
            className="w-5 h-5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Recurrence</label>
          <select
            value={form.recurrence || ''}
            onChange={(e) => setForm({ ...form, recurrence: e.target.value })}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">None</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Add Transaction
        </button>
      </form>

      <div className="mt-10 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-black">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-600 italic">No transactions yet.</p>
        ) : (
          <ul className="space-y-4">
            {transactions.map((tx: any) => (
              <li
                key={tx.id}
                className="border border-gray-300 rounded-md p-4 bg-gray-100 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-lg text-black">
                    ${parseFloat(tx.amount).toFixed(2)}
                  </p>
                  <p className="text-gray-700">{tx.description}</p>
                  <p className="text-gray-500 text-sm">
                    {tx.type} • Due: {new Date(tx.dueDate).toLocaleDateString()}
                    {tx.category && ` • ${tx.category.name}`}
                  </p>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <button
                    onClick={() => handleTogglePaid(tx.id, !tx.isPaid)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                      tx.isPaid
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-black'
                    }`}
                  >
                    {tx.type === 'income'
                      ? tx.isPaid
                        ? 'Received'
                        : 'Mark as Received'
                      : tx.isPaid
                      ? 'Paid'
                      : 'Mark as Paid'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
