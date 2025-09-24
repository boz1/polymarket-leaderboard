// app/leaderboard/page.tsx
"use client"; // ⚠️ This makes the entire page a client component

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Entry = { address: string; value: number };

export default function LeaderboardPage() {
  const searchParams = useSearchParams();
  const addressesParam = searchParams?.get("addresses");
  const [data, setData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!addressesParam) return;

    const addrArray = addressesParam.split(",");

    fetch("/api/polymarket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addresses: addrArray }),
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, [addressesParam]);

  if (loading) return <p>Loading leaderboard...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Leaderboard</h1>
      <table className="min-w-full border border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Rank</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={entry.address}>
              <td className="border px-4 py-2">{idx + 1}</td>
              <td className="border px-4 py-2">{entry.address}</td>
              <td className="border px-4 py-2">{entry.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
