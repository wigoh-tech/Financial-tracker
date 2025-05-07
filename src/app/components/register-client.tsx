'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterClient() {
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const res = await fetch('/api/client', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, email }), 
        });
    
        if (res.ok) {
            alert('Client registered!');
            router.push('/');
        } else {
            const data = await res.json();
            alert('Error: ' + data.error);
        }
    };
    

    return (
        <div className="max-w-md mx-auto p-4 shadow rounded">
            <h1 className="text-xl mb-4 font-bold">Register Client</h1>
            <form onSubmit={handleSubmit}>

               
                <label className="block mb-2">
                    User Name:
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </label>
                <label className="block mb-2">
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded mt-1"
                        required
                    />
                </label>
                <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-4">
                    Register
                </button>
            </form>
        </div>
    );
}
