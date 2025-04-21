// File: src/pages/school-entry.tsx
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SchoolEntry() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    router.push(`/school-data?code=${code.trim().toUpperCase()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 space-y-4">
        <h2 className="text-2xl font-bold text-center">Enter School Code</h2>
        <input
          type="text"
          placeholder="Enter School Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
