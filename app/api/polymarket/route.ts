import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let payload: { addresses?: string[] };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const addresses = payload.addresses?.filter(Boolean) ?? [];
  if (!addresses.length) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const results = await Promise.all(
      addresses.map(async (addr) => {
        const url = `https://data-api.polymarket.com/value?user=${encodeURIComponent(
          addr
        )}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Polymarket API error: ${res.status}`);
        const json = (await res.json()) as Array<{ user: string; value: number }>;
        return { address: addr, value: json?.[0]?.value ?? 0 };
      })
    );

    results.sort((a, b) => b.value - a.value);

    return NextResponse.json(results, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch values" },
      { status: 502 }
    );
  }
}
