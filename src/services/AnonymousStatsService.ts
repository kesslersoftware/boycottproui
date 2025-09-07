import { apiPost, apiPut } from '../api/api';
import { ResponseMessage } from '../types';

type StatType = "company" | "cause" | "cause_company";

interface StatPayload {
    cause_id?: string;
    company_id?: string;
    increment: boolean;
    cause_desc?: string;     // only needed for cause_company
    company_name?: string;   // only needed for cause_company
}

export const postAnonymousStat = async (
    type: StatType,
    payload: StatPayload
): Promise<ResponseMessage> => {
    try {
        switch (type) {
            case "company":
                return await apiPut(`/companies/${payload.company_id}/${payload.increment}`);
            case "cause":
                return await apiPut(`/causes/${payload.cause_id}/${payload.increment}`);
            case "cause_company":
                return await apiPost(
                    `/causes/${payload.cause_id}/companies/${payload.company_id}`,
                    {
                        cause_desc: payload.cause_desc,
                        company_name: payload.company_name,
                        increment: payload.increment
                    }
                );
            default:
                throw new Error("Unknown stat type");
        }
    } catch (err: any) {
        console.error(`Failed to post anonymous stat (${type}):`, err);
        throw {
            status: 500,
            message: 'Failed to post anonymous stat',
            devMsg: err?.message || 'Unknown error'
        };
    }
};
