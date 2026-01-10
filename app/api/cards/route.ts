import { NextResponse } from 'next/server';
import cardsData from '@/data/royaleapi/cards.json';

type Card = {
  key: string;
  name: string;
  type: string;
  rarity?: string;
  elixir: number;
};

export async function GET() {
  const cards = (cardsData as unknown as Card[])
    .filter((c) => c && c.key && c.name)
    .map((c) => ({
      key: c.key,
      name: c.name,
      type: c.type,
      rarity: c.rarity,
      elixir: c.elixir,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json({ success: true, cards });
}

