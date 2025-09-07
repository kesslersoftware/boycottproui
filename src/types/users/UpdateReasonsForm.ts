import {NewReason} from "./NewReason";
import{CurrentReason} from "./CurrentReason";

export interface UpdateReasonsForm {
    user_id: string;
    company_id: string;
    company_name: string;
    currentReasons: CurrentReason[];
    newReasons: NewReason[];
    personal_reason: string | null;
}
