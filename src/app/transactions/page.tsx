// 'use client';

// import { useEffect, useState } from 'react';

// export default function TransactionsPage() {
//   const [amount, setAmount] = useState('');
//   const [note, setNote] = useState('');
//   const [categoryId, setCategoryId] = useState('');
//   const [categories, setCategories] = useState([]);
//   const [transactions, setTransactions] = useState([]);

//   const fetchCategories = async () => {
//     const res = await fetch('/api/categories');
//     const data = await res.json();
//     setCategories(data);
//   };

//   const fetchTransactions = async () => {
//     const res = await fetch('/api/transactions');
//     const data = await res.json();
//     setTransactions(data);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await fetch('/api/transactions', {
//       method: 'POST',
//       body: JSON.stringify({ amount: parseFloat(amount), note, categoryId: parseInt(categoryId) }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//     setAmount('');
//     setNote('');
//     setCategoryId('');
//     fetchTransactions();
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchTransactions();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Add Transaction</h1>
//       <form onSubmit={handleSubmit} className="mb-6">
//         <input
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           placeholder="Amount"
//           className="border px-4 py-2 mr-2"
//           type="number"
//           step="0.01"
//         />
//         <input
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//           placeholder="Note"
//           className="border px-4 py-2 mr-2"
//         />
//         <select
//           value={categoryId}
//           onChange={(e) => setCategoryId(e.target.value)}
//           className="border px-4 py-2 mr-2"
//         >
//           <option value="">Select category</option>
//           {categories.map((cat: any) => (
//             <option key={cat.id} value={cat.id}>{cat.name}</option>
//           ))}
//         </select>
//         <button className="bg-green-500 text-white px-4 py-2">Add</button>
//       </form>

//       <ul>
//         {transactions.map((tx: any) => (
//           <li key={tx.id} className="mb-2">
//             <strong>${tx.amount.toFixed(2)}</strong> - {tx.note} ({tx.category.name})
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
// 'use client';

// import { useEffect, useState } from 'react';

// export default function TransactionsPage() {
//   const [form, setForm] = useState({
//     amount: '',
//     description: '',
//     dueDate: '',
//     type: 'expense',
//     categoryId: '',
//   });
//   const [categories, setCategories] = useState([]);
//   const [transactions, setTransactions] = useState([]);

//   const fetchCategories = async () => {
//     const res = await fetch('/api/categories');
//     const data = await res.json();
//     setCategories(data);
//   };

//   const fetchTransactions = async () => {
//     const res = await fetch('/api/transactions');
//     const data = await res.json();
//     setTransactions(data);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await fetch('/api/transactions', {
//       method: 'POST',
//       body: JSON.stringify(form),
//       headers: { 'Content-Type': 'application/json' },
//     });
//     setForm({ amount: '', description: '', dueDate: '', type: 'expense', categoryId: '' });
//     fetchTransactions();
//   };

//   useEffect(() => {
//     fetchCategories();
//     fetchTransactions();
//   }, []);

//   return (
//     <div className="min-h-screen bg-white text-white p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">Add Transaction</h1>

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white text-black max-w-xl mx-auto p-6 rounded-lg shadow-lg space-y-4 border border-gray-300"
//       >
//         <div>
//           <label className="block text-sm font-medium mb-1">Amount ($)</label>
//           <input
//             type="number"
//             step="0.01"
//             value={form.amount}
//             onChange={(e) => setForm({ ...form, amount: e.target.value })}
//             className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
//             placeholder="e.g., 100.00"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Description</label>
//           <input
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
//             placeholder="e.g., Grocery shopping"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Due Date</label>
//           <input
//             type="date"
//             value={form.dueDate}
//             onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
//             className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Type</label>
//           <select
//             value={form.type}
//             onChange={(e) => setForm({ ...form, type: e.target.value })}
//             className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
//           >
//             <option value="expense">Expense</option>
//             <option value="income">Income</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Category</label>
//           <select
//             value={form.categoryId}
//             onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
//             className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat: any) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
//         >
//           Add Transaction
//         </button>
//       </form>

//       <div className="mt-10 max-w-xl mx-auto">
//         <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
//         {transactions.length === 0 ? (
//           <p className="text-gray-400 italic">No transactions yet.</p>
//         ) : (
//           <ul className="space-y-4">
//             {transactions.map((tx: any) => (
//               <li
//                 key={tx.id}
//                 className="border border-gray-700 rounded-md p-4 bg-gray-900 flex justify-between items-center"
//               >
//                 <div>
//                   <p className="font-semibold text-lg text-white">
//                     ${parseFloat(tx.amount).toFixed(2)}
//                   </p>
//                   <p className="text-gray-300">{tx.description}</p>
//                   <p className="text-gray-400 text-sm">
//                     {tx.type} • Due: {new Date(tx.dueDate).toLocaleDateString()}
//                     {tx.category && ` • ${tx.category.name}`}
//                   </p>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';
import TransactionsForm from '@/components/TransactionsForm';

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* <h1 className="text-2xl  font-bold mb-4">Transactions</h1> */}
      <h1 className="text-2xl font-bold mb-4 text-blue-600 text-center">Transactions</h1>

      <TransactionsForm />
    </div>
  );
}
