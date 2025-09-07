import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/users';

// Amplify
import {
    signIn,
    signOut as amplifySignOut,
    getCurrentUser,
    fetchAuthSession,
    resendSignUpCode,
} from 'aws-amplify/auth';
import {getUserById} from "../api/users";

// ---- API placeholders ----
// Implement this endpoint on your API: GET /users/me (JWT only)
async function getUserProfileFromApiUsingJwt(idToken: string): Promise<User> {
    try {
        return getUserById();
    } catch (err: any) {
        console.log("that was a failure! ", err);
        throw new Error('getUserProfileFromApiUsingJwt not implemented: create /users/s (JWT-auth) and call it here');
    }
}

// --------------------------

type UserContextType = {
    user: User | undefined;
    loading: boolean;
    setUser: (user: User | undefined) => Promise<void>;
};

const UserContext = createContext<UserContextType>({
    user: undefined,
    loading: true,
    setUser: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUserState] = useState<User | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);

    const setUser = async (u: User | undefined) => {
        setUserState(u);
        if (u) {
            await AsyncStorage.setItem('user', JSON.stringify(u));
        } else {
            await AsyncStorage.removeItem('user');
        }
    };

    // Restore cached user on first mount to avoid flicker
    useEffect(() => {
        (async () => {
            try {
                const json = await AsyncStorage.getItem('user');
                if (json) setUserState(JSON.parse(json));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const value = useMemo(() => ({ user, loading, setUser }), [user, loading]);

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);

// ===== Auth helpers =====

const getAuth = async () => {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();
    const payload = session.tokens?.idToken?.payload as Record<string, any> | undefined;
    return {
        idToken,
        sub: payload?.sub as string | undefined,
        email: payload?.email as string | undefined,
    };
};

export type SignInResult =
    | { status: 'DONE' }
    | { status: 'NEEDS_CONFIRM' }
    | { status: 'ERROR'; error: any };

export const useAuthHelpers = () => {
    const { setUser } = useUser();

    // Call from LoginScreen
    const signInAndLoadUser = async (
        email: string,
        password: string
    ): Promise<SignInResult> => {
        try {
            //console.log("attempting to sign in, ",email," ",password);
            //console.log('[doSignIn] typeof signIn', typeof signIn); // should be 'function'
            const res = await signIn({ username: email.trim(), password });
            //console.log("res = ",res);
            const step = res.nextStep?.signInStep;
            //console.log("step = ",step);
            if (step === 'CONFIRM_SIGN_UP') {
                // don’t navigate here—just signal the screen
                try {
                    await resendSignUpCode({ username: email.trim() });
                } catch {}
                return { status: 'NEEDS_CONFIRM' };
            }

            if (!step || step === 'DONE') {
                //console.log("calling getAuth");
                const { idToken } = await getAuth();
                //console.log("token returned = ",idToken);
                // PREFERRED: once you have /users/me implemented, use it:
                const user = await getUserProfileFromApiUsingJwt(idToken!);
                //console.log("user returned = ",user);
                // TEMP BACK-COMPAT: use your current login API so the rest of your app works now.
                // (This still keeps Cognito as the identity provider; you can swap this out later.)
                //const user = await loginUser({ username_or_email: email, password });

                await setUser(user);
                //console.log("user set");
                return { status: 'DONE' };
            }

            return { status: 'ERROR', error: new Error(`Unhandled step: ${step}`) };
        } catch (error: any) {
            console.log('[SignIn] ERROR name:', error?.name);
            console.log('[SignIn] ERROR message:', error?.message);
            console.log('[SignIn] ERROR suggestion:', error?.recoverySuggestion);
            console.log('[SignIn] ERROR code:', error?.code);
            console.log('[SignIn] ERROR cause:', error?.cause?.message || error?.cause);
            console.log('[SignIn] ERROR meta:', error?.$metadata);
            return { status: 'ERROR', error };
        }
    };

    // Call once on app start from RootNavigator (no navigation here)
    const bootstrapIfSignedIn = async () => {
        try {
            await getCurrentUser(); // throws if not signed in
            await fetchAuthSession();

            const fresh = await getUserById();   // your existing API helper
            await setUser(fresh);

        } catch {
            // not signed in -> clear any stale cached user
            await setUser(undefined);
        }
    };

    const signOutAll = async () => {
        await amplifySignOut();
        await setUser(undefined);
    };

    return { signInAndLoadUser, bootstrapIfSignedIn, signOutAll };
};
