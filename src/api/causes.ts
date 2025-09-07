import { apiGet, apiPost } from './api';
import { Cause } from '../types/causes/Cause';
import {TopCause} from "../types/causes/TopCause";
import {CauseCompanyStats} from "../types/causecompanystats/CauseCompanyStats";
import {ResponseMessage} from "../types/misc";
export const getTopCauses =
    async (limit: number): Promise<TopCause[]> =>
        apiGet(`/causes/top/${limit}`);
export const getAllCauses =
    async (): Promise<Cause[]> =>
        apiGet(`/causes`);
export const addCause =
    async (data: Cause): Promise<ResponseMessage> =>
        apiPost(`/causes`, data);
export const getCauseCompanies =
    async (cause_id: string): Promise<CauseCompanyStats[]> =>
        apiGet(`/causes/${cause_id}/companies`);
export const getCauseDetails =
    async (cause_id: string): Promise<Cause> =>
        apiGet(`/causes/${cause_id}`);
