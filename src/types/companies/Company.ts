export interface Company {
    company_id: string;
    company_name: string;
    description?: string;
    industry: string;
    city: string;
    state: string;
    zip: string;
    employees: number;
    revenue: number;
    valuation: number;
    profits: number;
    stock_symbol?: string;
    ceo: string;
    boycott_count: number;
}
