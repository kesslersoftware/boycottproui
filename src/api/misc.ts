import { apiGet, apiPost, apiDelete } from './api';
import {ResponseMessage} from "../types/misc";
import {UpdateReasonsForm} from "../types/users";

export const submitBoycottUpdate =
    async (data: UpdateReasonsForm): Promise<ResponseMessage> =>
    apiPost(`/users/companies/causes`, data);
