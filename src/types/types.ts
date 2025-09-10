

export type RootStackParamList = {
    Login
    Registration
    RegistrationEmail: { username: string, email: string, msg: string };
    ForgotPassword
    ResetEmailSent: { email: string };
    ResetLinkExpired
    PasswordReset: { back_navigation : string };
    PasswordResetSuccess: { prompt: string, back_navigation : string };
    Home
    MyTrends
    TopTrends
    ProfileSettings
    CompanyDetails: { company_id: string , back_navigation : string };
    CauseDetails: { cause_id: string , back_navigation : string };
    Search
}

export type ListItem = {
    id: string;
    description: string
    numPeople?: number
}
