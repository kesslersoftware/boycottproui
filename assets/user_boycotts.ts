export type UserBoycott = {
    user_id: string,
    company_id: string,
    cause_id: string | null,
    personal_reason: string | null,
    timestamp: string
}
export const user_boycotts: UserBoycott[] = [{"user_id":"300000001","company_id":"100000001","cause_id":"200000001","personal_reason":null,"timestamp":"2024-12-10T10:00:00Z"},
    {"user_id":"300000001","company_id":"100000002","cause_id":null,"personal_reason":"I dislike the CEO","timestamp":"2024-12-11T11:00:00Z"},
    {"user_id":"300000002","company_id":"100000003","cause_id":"200000002","personal_reason":null,"timestamp":"2024-12-12T09:30:00Z"}];
