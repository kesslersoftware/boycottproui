import {Reason} from "./Reason";

export interface AddUserBoycottForm {
    user_id: string;
    company_id: string;
    company_name: string;
    reasons: Reason[];
    personal_reason: string | null;
}
