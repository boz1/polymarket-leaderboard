import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { addresses } = await req.json();

  if (!addresses || !Array.isArray(addresses)) {
    return NextResponse.json({ error: "Provide addresses array" }, { status: 400 });
  }

  try {
    const results = await Promise.all(
      addresses.map(async (addr: string) => {
        const res = await fetch(`https://data-api.polymarket.com/value?user=${addr}`);
        const json = await res.json();
        return { address: addr, value: json[0]?.value || 0 };
      })
    );

    results.sort((a, b) => b.value - a.value);

    return NextResponse.json(results);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
