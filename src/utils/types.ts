export interface CountryApiResponse {
  name: string;
  capital?: string;
  region?: string;
  population: number;
  flag?: string;
  currencies?: Array<{
    code?: string;
    name?: string;
    symbol?: string;
  }>;
}

export interface ExchangeRateApiResponse {
  rates: {
    [key: string]: number;
  };
}
