import * as FileSystem from 'expo-file-system';
import { Company } from '../types/companies/Company';
import { Cause } from '../types/causes/Cause';
import { LocalUserBoycott } from '../types/users/LocalUserBoycott';
import { LocalUserCause } from '../types/users/LocalUserCause';
import { getAllCompanies } from '../api/companies';
import { getAllCauses } from '../api/causes';


const FILE_URI = `${FileSystem.documentDirectory}boycott_data.json`;

export interface BoycottData {
    user_boycotts: LocalUserBoycott[];
    user_causes: LocalUserCause[];
    all_companies: Company[];
    all_causes: Cause[];
    lastLoaded: number | null;
}

const emptyData: BoycottData = {
    user_boycotts: [],
    user_causes: [],
    all_companies: [],
    all_causes: [],
    lastLoaded: null,
};

export const LocalBoycottStore = {
    async load(): Promise<BoycottData> {
        try {
            const fileContents = await FileSystem.readAsStringAsync(FILE_URI);
            return JSON.parse(fileContents);
        } catch (err) {
            console.warn('Boycott store load failed. Returning empty dataset.');
            return emptyData;
        }
    },

    async save(data: BoycottData): Promise<void> {
        console.log("data being saved = ", data);
        await FileSystem.writeAsStringAsync(FILE_URI, JSON.stringify(data));
    },

    async addBoycott(boycott: LocalUserBoycott): Promise<void> {
        const data = await this.load();
        data.user_boycotts.push(boycott);
        await this.save(data);
    },

    async clearData(): Promise<void> {
        await this.save(emptyData);
    },

    /*async removeBoycott(company_cause_id: string): Promise<void> {
        const data = await this.load();
        data.user_boycotts = data.user_boycotts.filter(b => b.company_cause_id !== company_cause_id);
        await this.save(data);
    },*/

    async getBoycotts(): Promise<LocalUserBoycott[]> {
        const data = await this.load();
        return data.user_boycotts;
    },

    async addCause(cause: LocalUserCause): Promise<void> {
        const data = await this.load();
        data.user_causes.push(cause);
        await this.save(data);
    },

    async getCauses(): Promise<LocalUserCause[]> {
        const data = await this.load();
        return data.user_causes;
    },

    async clear(): Promise<void> {
        await this.save(emptyData);
    },

    async shouldRefreshData(): Promise<boolean> {
        const data = await this.load();
        if (!data.lastLoaded) {
            return true;
        }
        const oneHourInMs = 60 * 60 * 1000;
        const timeSinceLastLoad = Date.now() - data.lastLoaded;
        return timeSinceLastLoad > oneHourInMs;
    },

    async refreshCompaniesAndCauses(): Promise<void> {
        try {
            const [companies, causes] = await Promise.all([
                getAllCompanies(),
                getAllCauses()
            ]);
            
            const data = await this.load();
            data.all_companies = companies;
            data.all_causes = causes;
            data.lastLoaded = Date.now();
            
            await this.save(data);
        } catch (error) {
            console.warn('Failed to refresh companies and causes:', error);
        }
    },

    async checkAndRefreshIfNeeded(): Promise<void> {
        const shouldRefresh = await this.shouldRefreshData();
        if (shouldRefresh) {
            await this.refreshCompaniesAndCauses();
        }
    },

    async getAllCompanies(): Promise<Company[]> {
        const data = await this.load();
        return data.all_companies;
    },

    async getAllCauses(): Promise<Cause[]> {
        const data = await this.load();
        return data.all_causes;
    },
};
