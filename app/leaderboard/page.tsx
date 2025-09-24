import { Suspense } from "react";
// app/leaderboard/page.tsx
import LeaderboardClient from "./LeaderboardClient"; // ✅ same folder, relative path

// Prevent static generation so we don't trip prerendering errors:
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: { addresses?: string };
};

export default function LeaderboardPage({ searchParams }: PageProps) {
  // Parse addresses on the SERVER (no client hook needed here)
  const addressesParam = searchParams.addresses ?? "";
  const initialAddresses = addressesParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <Suspense fallback={<p className="p-6">Loading leaderboard…</p>}>
      <LeaderboardClient initialAddresses={initialAddresses} />
    </Suspense>
  );
}
