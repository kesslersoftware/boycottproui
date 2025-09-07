import {CauseSummary} from "../causes/CauseSummary";

export interface CompanyMetadata {
    company_id?: string;
    company_name?: string;
    boycottingSince?: string;
    reasons?: CauseSummary[];
    boycotting: boolean
}
