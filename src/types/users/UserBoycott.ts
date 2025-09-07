export interface UserBoycott {
    user_id: string;
    company_id: string;
    company_name: string;
    cause_id?: string;
    cause_desc: string;
    company_cause_id: string;
    personal_reason?: string;
    timestamp?: string;
}
