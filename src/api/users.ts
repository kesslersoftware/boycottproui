import { apiGet, apiPost, apiDelete, apiPut } from './api';
import {
    User,
    UserStats,
    LoginForm,
    RegisterForm,
    ResetPasswordForm,
    ChangeUsernameForm,
    UserBoycott,
    CompanyMetadata,
    UserCause,
} from "../types/users";
import { ResponseMessage } from "../types/misc";
import {CauseMetadata} from "../types/causes/CauseMetadata";
import {AddUserBoycottForm} from "../types/users/AddUserBoycottForm";
import {AddCausesForm} from "../types/users/AddCausesForm";
import {UpgradeUserForm} from "../types/users/UpgradeUserForm";

// REGISTER & LOGIN
export const registerUser =
    async (data: RegisterForm): Promise<User> =>
    apiPost(`/users/register`, data);

export const loginUser =
    async (data: LoginForm): Promise<User> =>
    apiPost(`/users/login`, data);

// PASSWORD RESET
export const sendResetEmail =
    async (data: { email_addr: string }): Promise<ResponseMessage> =>
    apiPost(`/users/resetemail/`, data);

export const resetPassword =
    async (data: ResetPasswordForm): Promise<ResponseMessage> =>
    apiPost(`/users/reset/`, data);

// STATS & DETAILS
export const getUserStats =
    async (): Promise<UserStats> =>
    apiGet(`/users/stats`);

export const getUserById =
    async (): Promise<User> =>
    apiGet(`/users`);

// USERNAME CHANGE
export const changeUsername =
    async (data: ChangeUsernameForm): Promise<ResponseMessage> =>
    apiPost(`/users/username`, data);

// DELETION
export const deleteUser =
    async (): Promise<ResponseMessage> =>
    apiDelete(`/users`);

export const upgradeUser =
    async (data: UpgradeUserForm): Promise<ResponseMessage> =>
        apiPut(`/users`, data);

// BOYCOTTS & CAUSES
export const getUserBoycotts =
    async (): Promise<UserBoycott[]> =>
    apiGet(`/users/boycotts`);

export const getUserCauses =
    async (): Promise<UserCause[]> =>
    apiGet(`/users/causes`);

export const getUserBoycott =
    async (company_id: string): Promise<CompanyMetadata> =>
    apiGet(`/users/companies/${company_id}`);

export const deleteUserBoycott =
    async (company_id: string): Promise<ResponseMessage> =>
    apiDelete(`/users/companies/${company_id}`);
export const deleteUserCause =
    async (cause_id: string): Promise<ResponseMessage> =>
        apiDelete(`/users/causes/${cause_id}`);

export const getUserCauseById =
    async (cause_id: string): Promise<UserCause> =>
    apiGet(`/users/causes/${cause_id}`);

export const getUserBoycottsByCause =
    async (cause_id: string): Promise<CauseMetadata> =>
    apiGet(`/users/boycotts/causes/${cause_id}`);

export const addUserBoycott =
    async (data: AddUserBoycottForm): Promise<ResponseMessage> =>
    apiPost(`/users/boycotts`, data);

export const addUserCause =
    async (data: AddCausesForm): Promise<ResponseMessage> =>
    apiPost(`/users/causes`, data);
