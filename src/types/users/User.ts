export interface User {
    user_id?: string;
    email_addr: string;
    username?: string;
    passwordHash?: string;
    paying_user: boolean;
}
