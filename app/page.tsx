"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [addresses, setAddresses] = useState([""]);
  const router = useRouter();

  const handleChange = (idx: number, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[idx] = value;
    setAddresses(newAddresses);
  };

  const addField = () => setAddresses([...addresses, ""]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/leaderboard?addresses=${addresses.join(",")}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Polymarket Leaderboard Maker</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {addresses.map((addr, idx) => (
          <input
            key={idx}
            type="text"
            placeholder="0x..."
            value={addr}
            onChange={(e) => handleChange(idx, e.target.value)}
            className="border p-2 rounded"
          />
        ))}
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={addField}
            className="p-2 bg-green-500 text-white rounded"
          >
            Add Address
          </button>
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Show Leaderboard
          </button>
        </div>
      </form>
    </div>
  );
}
