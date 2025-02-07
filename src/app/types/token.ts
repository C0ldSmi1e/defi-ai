type TokenInfo = {
  name: string;
  symbol: string;
  price: string;
  marketCap: string;
  liquidity: string;
  volume24h: string;
  priceChange24h: string;
  holders: string;
  website: string;
  twitter: string;
  telegram: string;
  narrative: string;
  additional_info: Record<string, string>;
};

export type { TokenInfo };
