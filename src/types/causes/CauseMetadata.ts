import {CompanySummary} from '../companies/CompanySummary';

export interface CauseMetadata {
    cause_id?: string;
    cause_desc?: string;
    companies?: CompanySummary[];
}
