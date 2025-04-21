import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function SchoolEntry() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = code.trim().toUpperCase();

    if (!trimmedCode) {
      setError('Please enter a valid school code.');
      return;
    }

    setError('');
    navigate(`/school-data?code=${trimmedCode}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Enter School Code
        </h2>

        <div className="flex flex-col space-y-2">
          <label htmlFor="schoolCode" className="text-sm font-medium text-gray-600">
            School Code
          </label>
          <input
            id="schoolCode"
            type="text"
            placeholder="e.g. JPS123"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}
        </div>

        <Button type="submit" className="w-full text-white text-base py-2">
          Submit
        </Button>
      </form>
    </div>
  );
}

