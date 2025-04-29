import React, { useState, useEffect } from 'react';

const TokenInput: React.FC = () => {
  const [input, setInput] = useState('');

  // Load token from localStorage on first render
  useEffect(() => {
    const storedToken = localStorage.getItem('botToken');
    if (storedToken) {
      setInput(storedToken);
    }
  }, []);

  // Update localStorage whenever input changes
  useEffect(() => {
    localStorage.setItem('botToken', input);
  }, [input]);

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/run_bot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: input }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  return (
    <div className="flex items-center border border-zinc-800 dark:border-gray-300 rounded p-2 max-w-md">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter token..."
        className="flex-grow p-2 outline-none dark:text-white"
      />
      <button
        onClick={handleSubmit}
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Run Bot
      </button>
    </div>
  );
};

export default TokenInput;
