// src/amplify.ts
import { Amplify } from 'aws-amplify';
import {
    API_URL,
    ENVIRONMENT,
    COGNITO_REGION,
    COGNITO_USER_POOL_ID,
    COGNITO_APP_CLIENT_ID,
    COGNITO_AUTH_FLOW
} from '@env';

console.log('[Amplify.Init] env', {
    ENVIRONMENT,
    COGNITO_REGION,
    COGNITO_USER_POOL_ID,
    COGNITO_APP_CLIENT_ID: COGNITO_APP_CLIENT_ID,
    API_URL,
    COGNITO_AUTH_FLOW
});

//console.log('[Amplify.Init] configuring…');

Amplify.configure({
    Auth: {
        Cognito: {
            region: COGNITO_REGION,
            userPoolId: COGNITO_USER_POOL_ID,
            userPoolClientId: COGNITO_APP_CLIENT_ID,
            loginWith: { username: false, email: true, phone: false },
            authenticationFlowType: 'USER_PASSWORD_AUTH',
        },
    },
});


/*Hub.listen('auth', ({ payload }) => {
    console.log('[Hub:auth]', payload?.event, payload?.data);
});*/

let __configured = true;
export const isAmplifyConfigured = () => __configured;
export const amplifyConfigured = true;
