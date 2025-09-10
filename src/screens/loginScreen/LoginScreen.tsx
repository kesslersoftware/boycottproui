import {View, Text} from 'react-native'
import {styles} from "./LoginScreenStyles";
import HeaderBar from "../../components/headerBar/HeaderBar";
import React, { useState } from 'react'
import {sharedStyles} from "../../../styles/sharedStyles";
import CenteredButton from "../../components/button/CenteredButton";
import {
    LS_LOGIN_EMAIL_TOP_MARGIN,
    LS_LOGIN_BTN_HEIGHT,
    LS_LOGIN_BTN_TOP_MARGIN,
    LS_LOGIN_BTN_WIDTH,
    LS_REGISTER_BTN_HEIGHT,
    LS_REGISTER_BTN_TOP_MARGIN,
    LS_REGISTER_BTN_WIDTH,
    SUCCESS_GREEN, LS_LOGIN_PASSWORD_TOP_MARGIN
} from "../../../styles/constants";
import FormTextField from "../../components/labelAndField/FormTextField";
import FormPasswordField from "../../components/labelAndField/FormPasswordField";
import { RouteProp, useNavigation } from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {SignInResult, useAuthHelpers, useUser} from '../../context/UserContext';
import LottieView from 'lottie-react-native';
import {
    resendSignUpCode
} from 'aws-amplify/auth';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>

export default function LoginScreen() {
    // navigation constants
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const sleep = (ms: number) =>
        new Promise(resolve => setTimeout(resolve, ms));
    const [visibleError, setVisibleError] = useState<string>('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signInAndLoadUser } = useAuthHelpers();
    const handleLogin = async () => {
        try {
            setLoading(true); // show spinner
            setVisibleError('');
            const res: SignInResult = await signInAndLoadUser(email.trim(), password); // then navigate to app
            console.log(res.status);
            if (res.status === 'DONE') {
                // Logged in — tokens are available
                return;
            } else if (res.status === 'NEEDS_CONFIRM') {
                // User not confirmed yet → send them to confirmation screen
                navigation.navigate('RegistrationEmail', { username: email.trim(), email: email.trim(),
                msg: 'you need to finish registering before logging in, please enter the code sent to your email below:'});
                return;
            } else {
                setVisibleError('Incorrect email or password. Please try again.');
            }
        } catch (err: any) {
            // Map common errors to friendly messages
            switch (err?.name) {
                case 'UserNotFoundException':
                case 'NotAuthorizedException':
                    setVisibleError('Incorrect username or password.');
                    break;
                case 'UserNotConfirmedException':
                    console.log('🔁 ResendSignUpCode request:', { username: email });
                    const result = await resendSignUpCode({ username: email });
                    console.log('✅ ResendSignUpCode success:', result);
                    navigation.navigate('RegistrationEmail', { username: email, email: email,
                    msg: 'you need to finish registering before logging in, please enter the code sent to your email below:'});
                    break;
                case 'PasswordResetRequiredException':
                    // prompt to reset password
                    break;
                case 'TooManyFailedAttemptsException':
                case 'LimitExceededException':
                    // tell user to wait a bit
                    break;
                default:
                    console.error('Login error:', err);
            }
        } finally {
            setLoading(false); // hide spinner
        }
    };
    return (
        <View style={sharedStyles.containerSettings}>
            <HeaderBar />
            {
                loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <LottieView
                            source={require('../../../assets/animation/loading.json')}
                            autoPlay
                            loop
                            style={{ width: 500, height: 500 }}
                        />

                    </View>
                ) :
            (
            <>
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={styles.toText}>to</Text>
                <Text style={styles.boycottText}>BoycottPro!</Text>
                <Text style={styles.slogan}>“Vote with your wallet. Track with your phone.”</Text>
                {
                    visibleError.length > 0 &&
                    <>
                        <Text style={sharedStyles.errorText}>
                            {visibleError}
                        </Text>
                    </>
                }
                <Text style={styles.signInTxt}>please sign in:</Text>
                <FormTextField
                    labelText="email"
                    labelMarginTop={LS_LOGIN_EMAIL_TOP_MARGIN}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="email address"
                />
                <FormPasswordField
                    labelText="password"
                    labelMarginTop={LS_LOGIN_PASSWORD_TOP_MARGIN}
                    value={password}
                    onChangeText={setPassword}
                />
                <Text style={styles.forgotPassword} onPress={() =>
                    navigation.navigate('ForgotPassword')}>forgot password?</Text>
                <CenteredButton
                    text="Login"
                    widthPercent={LS_LOGIN_BTN_WIDTH}
                    heightPercent={LS_LOGIN_BTN_HEIGHT}
                    marginTopPercent={LS_LOGIN_BTN_TOP_MARGIN}
                    onPress={handleLogin}
                />
                <Text style={styles.noAccountText}>Don’t have an account?</Text>
                <CenteredButton
                    text="Register"
                    color = {SUCCESS_GREEN}
                    widthPercent={LS_REGISTER_BTN_WIDTH}
                    heightPercent={LS_REGISTER_BTN_HEIGHT}
                    marginTopPercent={LS_REGISTER_BTN_TOP_MARGIN}
                    onPress={() => navigation.navigate('Registration')}
                />
            </>
          )
          }
        </View>
    );
}



