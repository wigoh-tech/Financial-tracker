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

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card title="Total Revenue" value={`₹${data.totalRevenue}`} bgColor="#F43610" textColor="#ffffff" />
        <Card title="Total Expenses" value={`₹${data.totalExpenses}`} bgColor="#5C005C" textColor="#ffffff" />
        <Card title="Net Profit" value={`₹${data.netProfit}`} bgColor="	#D97706" textColor="#1e293b" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Monthly Revenue vs Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthlyTrends}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#F43610" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="#5C005C" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Category-wise Breakdown</h2>
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
      className="p-4 rounded-xl shadow"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <p className="text-md text-gray-200">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
