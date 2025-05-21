'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

type DashboardData = {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  monthlyTrends: { month: string; revenue: number; expense: number }[];
  categoryBreakdown: { category: string; amount: number }[];
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    axios
      .get('/api/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error('Failed to fetch dashboard data:', err);
        alert('Failed to load dashboard data. Please try again later.');
      });
  }, []);

  if (!data)
    return (
      <div className="flex items-center justify-center h-64 text-gray-600 text-lg">
        Loading dashboard...
      </div>
    );

  return (
    <div className="p-6 space-y-10">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Total Revenue" value={`₹${data.totalRevenue}`} bgColor="#F97316" textColor="#ffffff" />
        <Card title="Total Expenses" value={`₹${data.totalExpenses}`} bgColor="#6B21A8" textColor="#ffffff" />
        <Card title="Net Profit" value={`₹${data.netProfit}`} bgColor="#FACC15" textColor="#1e293b" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Monthly Revenue vs Expenses
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthlyTrends}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="#6B21A8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Category-wise Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.categoryBreakdown}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  bgColor,
  textColor,
}: {
  title: string;
  value: string;
  bgColor: string;
  textColor: string;
}) {
  return (
    <div
      className="p-5 rounded-2xl shadow hover:shadow-lg transition duration-300"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <p className="text-sm font-medium opacity-90">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
