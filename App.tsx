import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto'; // helpful for URL/WHATWG needs
import '@aws-amplify/react-native';
import { installFetchLogger } from './src/debug/fetchLogger';
import { installXHRLogger } from './src/debug/xhrLogger';
//installFetchLogger(); // <— make sure this runs BEFORE Amplify config/imports
//installXHRLogger();
// Run your Amplify configuration (see next section)
require('./src/amplify');
//console.log('[polyfill] crypto.getRandomValues:', !!(global as any)?.crypto?.getRandomValues);
//import { ConsoleLogger } from 'aws-amplify/utils';


// Make Amplify & your own logs verbose during debugging
//ConsoleLogger.LOG_LEVEL = 'DEBUG';
//(global as any).LOG_LEVEL = 'DEBUG'; // optional global override




import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "./src/screens/loginScreen/LoginScreen";
import RegistrationScreen from "./src/screens/registrationScreen/RegistrationScreen";
import RegistrationEmailSentScreen from "./src/screens/registrationEmailSentScreen/RegistrationEmailSentScreen";
import ForgotPasswordScreen from "./src/screens/forgotPasswordScreen/forgotPasswordScreen";
import ResetEmailSentScreen from "./src/screens/resetEmailSentScreen/ResetEmailSentScreen";
import PasswordResetScreen from "./src/screens/passwordResetScreen/PasswordResetScreen";
import HomeScreen from "./src/screens/homeScreen/HomeScreen";
import MyTrendsScreen from "./src/screens/myTrendsScreen/MyTrendsScreen";
import TopTrendsScreen from "./src/screens/topTrendsScreen/TopTrendsScreen";
import ProfileSettingsScreen from "./src/screens/profileSettingsScreen/ProfileSettingsScreen";
import CompanyDetailsScreen from "./src/screens/companyDetailsScreen/CompanyDetailsScreen";
import CauseDetailsScreen from "./src/screens/causeDetailsScreen/CauseDetailsScreen";
import SearchScreen from "./src/screens/searchScreen/SearchScreen";
import {useAuthHelpers, UserProvider, useUser} from './src/context/UserContext';
import {fetchAuthSession} from "aws-amplify/auth";
const Stack = createNativeStackNavigator();

function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
            <Stack.Screen name="RegistrationEmail" component={RegistrationEmailSentScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetEmailSent" component={ResetEmailSentScreen} />
        </Stack.Navigator>
    );
}

function AppStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="MyTrends" component={MyTrendsScreen} />
            <Stack.Screen name="TopTrends" component={TopTrendsScreen} />
            <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
            <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
            <Stack.Screen name="CompanyDetails" component={CompanyDetailsScreen} />
            <Stack.Screen name="CauseDetails" component={CauseDetailsScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
        </Stack.Navigator>
    );
}

function RootNavigator() {
    const { bootstrapIfSignedIn } = useAuthHelpers();
    const { user, loading } = useUser();

    useEffect(() => { bootstrapIfSignedIn(); }, []);

    if (loading) {
        return null; // or a Splash component
    }

    return user ? <AppStack /> : <AuthStack />;
}

export default function App() {
    /*useEffect(() => {
        (async () => {
            try {
                await fetchAuthSession();
                console.log('[session check] OK (plugin configured)');
            } catch (e: any) {
                console.log('[session check] ERROR', e?.name, e?.message);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const r = await fetch('https://httpbin.org/post', { method: 'POST', body: '{}' });
            console.log('[test fetch] status', r.status);
        })();
    }, []);*/

    return (
        <UserProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </UserProvider>
    );
}

