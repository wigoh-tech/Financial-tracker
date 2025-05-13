// 'use client';

// import { useEffect, useState } from 'react';

// export default function CategoriesPage() {
//   const [name, setName] = useState('');
//   const [categories, setCategories] = useState([]);

//   const fetchCategories = async () => {
//     const res = await fetch('/api/categories');
//     const data = await res.json();
//     setCategories(data);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await fetch('/api/categories', {
//       method: 'POST',
//       body: JSON.stringify({ name }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//     setName('');
//     fetchCategories();
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Add Category</h1>
//       <form onSubmit={handleSubmit} className="mb-6">
//         <input
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="border px-4 py-2 mr-2"
//           placeholder="Category name"
//         />
//         <button className="bg-blue-500 text-white px-4 py-2">Add</button>
//       </form>
//       <ul>
//         {categories.map((cat: any) => (
//           <li key={cat.id} className="mb-1">{cat.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }
// 'use client';

'use client';
import CategoriesForm from '@/components/CategoriesForm';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <CategoriesForm />
    </div>
  );
}
