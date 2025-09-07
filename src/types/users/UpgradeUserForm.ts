import { LocalUserBoycott } from "./LocalUserBoycott";
import { LocalUserCause } from "./LocalUserCause";

export interface UpgradeUserForm {
    user_boycotts: LocalUserBoycott[];
    user_causes: LocalUserCause[];
}
