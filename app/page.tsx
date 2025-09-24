"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [addresses, setAddresses] = useState<string[]>([""]);
  const router = useRouter();

  const handleChange = (idx: number, value: string) => {
    setAddresses((prev) => {
      const next = [...prev];
      next[idx] = value.trim();
      return next;
    });
  };

  const addField = () => setAddresses((prev) => [...prev, ""]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qs = addresses.filter(Boolean).join(",");
    router.push(`/leaderboard?addresses=${encodeURIComponent(qs)}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Polymarket Leaderboard</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addField}
            className="px-3 py-2 rounded border"
          >
            Add address
          </button>
          <button
            type="submit"
            className="px-3 py-2 rounded text-white bg-blue-600"
          >
            Show leaderboard
          </button>
        </div>
      </form>
    </div>
  );
}
