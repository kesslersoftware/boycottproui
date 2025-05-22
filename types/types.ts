import {User} from "./DataModels";

export type RootStackParamList = {
    Login: { user: User }
    Registration: { user: User }
    RegistrationEmail: { user: User }
    ForgotPassword: { user: User }
    ResetEmailSent: { user: User }
    ResetLinkExpired: { user: User }
    PasswordReset: { user: User }
    PasswordResetSuccess: { user: User }
    Home: { user: User }
    MyTrends: { user: User }
    TopTrends: { user: User }
    ProfileSettings: { user: User }
    CompanyDetails: { user: User }
    CauseDetails: { user: User }
    Search: { user: User }
}
