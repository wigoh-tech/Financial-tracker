'use client';

import { useEffect, useState } from 'react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any>(null);
  const [tab, setTab] = useState<'due' | 'budget' | 'revenue'>('due');

  useEffect(() => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(setAlerts)
      .catch(console.error);
  }, []);

  if (!alerts) return <p className="p-6">Loading alerts...</p>;

  const renderContent = () => {
    switch (tab) {
      case 'due':
        return alerts.upcomingDue.length ? (
          <ul className="space-y-4">
            {alerts.upcomingDue.map((tx: any) => (
              <li key={tx.id} className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                <p className="font-semibold">${tx.amount.toFixed(2)} - {tx.description}</p>
                <p className="text-sm text-gray-700">Due: {new Date(tx.dueDate).toLocaleDateString()} | {tx.category?.name}</p>
              </li>
            ))}
          </ul>
        ) : <p>No upcoming due transactions 🎉</p>;

        case 'budget':
            return alerts.budgetExceeded.length ? (
              <ul className="space-y-4">
                {alerts.budgetExceeded.map((cat: any) => (
                  <li key={cat.id} className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
                    <p className="font-semibold">{cat.name}</p>
                    <p className="text-sm text-gray-700">Target: ₹{cat.budget.toFixed(2)} | Spent: ₹{cat.spent.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            ) : <p>All categories within budget ✅</p>;
          
      case 'revenue':
        return alerts.revenueShortfall ? (
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold">Revenue Shortfall</p>
            <p className="text-sm text-gray-700">Collected: ${alerts.income.toFixed(2)} — Goal not met</p>
          </div>
        ) : <p>Revenue on track 💰</p>;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Alert Center</h1>

      <div className="flex space-x-4 mb-6">
        <button onClick={() => setTab('due')} className={`px-4 py-2 rounded ${tab === 'due' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}>Upcoming Due</button>
        <button onClick={() => setTab('budget')} className={`px-4 py-2 rounded ${tab === 'budget' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>Budget Exceeded</button>
        <button onClick={() => setTab('revenue')} className={`px-4 py-2 rounded ${tab === 'revenue' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Revenue Shortfall</button>
      </div>

      <div>{renderContent()}</div>
    </div>
  );
}
