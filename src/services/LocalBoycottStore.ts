import * as FileSystem from 'expo-file-system';


const FILE_URI = `${FileSystem.documentDirectory}boycott_data.json`;

export interface BoycottData {
    user_boycotts: LocalUserBoycott[];
    user_causes: LocalUserCause[];
}

const emptyData: BoycottData = {
    user_boycotts: [],
    user_causes: [],
};

export const LocalBoycottStore = {
    async load(): Promise<BoycottData> {
        try {
            const fileContents = await FileSystem.readAsStringAsync(FILE_URI);
            console.log("data being retrieved = ", fileContents);
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

    async removeBoycott(company_cause_id: string): Promise<void> {
        const data = await this.load();
        data.user_boycotts = data.user_boycotts.filter(b => b.company_cause_id !== company_cause_id);
        await this.save(data);
    },

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
};
