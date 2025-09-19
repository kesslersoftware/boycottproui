export interface Source {
  title: string;
  url: string;
}

export interface Controversy {
  title: string;
  desc: string;
  date: string;
  source_url: string;
}

export interface CompanyData {
  company: string;
  slug: string;
  as_of_utc: string;
  summary: string;
  sector: string;
  hq_city: string;
  founded_year: number;
  employees_est: number;
  key_products: string[];
  stock_ticker: string;
  website: string;
  notable_news_window: string;
  controversies_or_issues: Controversy[];
  sources: Source[];
}