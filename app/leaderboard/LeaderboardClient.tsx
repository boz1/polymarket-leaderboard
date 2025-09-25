"use client";

import { useEffect, useState } from "react";

type Entry = { address: string; value: number };
type Props = { initialAddresses: string[] };

export default function LeaderboardClient({ initialAddresses }: Props) {
  const [data, setData] = useState<Entry[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!initialAddresses.length) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    fetch("/api/polymarket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addresses: initialAddresses }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j?.error || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((json: Entry[]) => {
        setData(json);
        setLoading(false);
      })
      .catch((err: any) => {
        setErrorMsg(String(err?.message || err));
        setLoading(false);
      });
  }, [initialAddresses]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-center text-lg">Loading leaderboard…</p>
      </div>
    );
  }

  if (errorMsg)
    return (
      <div className="p-6 text-red-600">
        <p className="font-semibold">Error loading leaderboard:</p>
        <p className="mt-1">{errorMsg}</p>
      </div>
    );

  if (!data?.length)
    return (
      <div className="p-6">
        <p>No addresses provided.</p>
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Leaderboard</h1>
      <table className="min-w-full border border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left">Rank</th>
            <th className="border px-4 py-2 text-left">Address</th>
            <th className="border px-4 py-2 text-right">Positions Value</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={entry.address}>
              <td className="border px-4 py-2">{idx + 1}</td>
              <td className="border px-4 py-2">
                <a
                  href={`https://polymarket.com/${entry.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {entry.address}
                </a>
              </td>
              <td className="border px-4 py-2 text-right">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 2,
                }).format(entry.value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
