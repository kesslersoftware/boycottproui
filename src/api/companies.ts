import { apiGet, apiPost, apiDelete } from './api';
import { Company } from '../types/companies/Company';
import {TopCompany} from "../types/companies/TopCompany";
import {CompanyCause} from "../types/companies/CompanyCause";
import {ResponseMessage} from "../types/misc";

export const getTopCompanies =
    async (limit: number): Promise<TopCompany[]> =>
        apiGet(`/companies/top/${limit}`);
export const getCompanyById =
    async (company_id: string): Promise<Company> =>
        apiGet(`/companies/${company_id}`);
export const getCompanyCauses =
    async (company_id: string): Promise<CompanyCause[]> =>
        apiGet(`/companies/${company_id}/causes`);
export const getAllCompanies =
    async (): Promise<Company[]> =>
        apiGet(`/companies`);
export const addCompany =
    async (data: Company): Promise<ResponseMessage> =>
        apiPost(`/companies`, data);
export const deleteCompany =
    async (company_id: string) =>
        apiDelete(`/companies/${company_id}`);
