import {View, Text, Pressable, TextInput} from "react-native";
import {styles} from "./ForgotPasswordScreenStyles";
import HeaderBar from "../../components/headerBar/HeaderBar";
import React, {useState} from "react";
import {sharedStyles} from "../../../styles/sharedStyles";
import {
    FP_EMAIL_TOP_MARGIN,
    FP_RESET_BTN_HEIGHT,
    FP_RESET_BTN_TOP_MARGIN,
    FP_RESET_BTN_WIDTH, RESET_RETURN_BTN_HEIGHT, RESET_RETURN_BTN_TOP_MARGIN, RESET_RETURN_BTN_WIDTH
} from "../../../styles/constants";
import CenteredButton from "../../components/button/CenteredButton";
import FormTextField from "../../components/labelAndField/FormTextField";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from "../../types/types";
import {useUser} from "../../context/UserContext";
import {resendSignUpCode, resetPassword} from 'aws-amplify/auth';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
type ForgotPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
    // navigation constants
    const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
    const { user } = useUser();
    const [visibleError, setVisibleError] = useState<string>('');
    const [email, setEmail] = useState('');
    const[ error, setError ] = useState<boolean>(false);
    const sendEmail = async () => {
        const username = email.trim();
        try {
            const out = await resetPassword({ username });
            // Success: a code was sent (or Cognito acted as if it was sent)
            // out.nextStep?.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE'
            console.log('[resetPassword] nextStep:', out?.nextStep);
            navigation.navigate('ResetEmailSent', { email: username});
        } catch (e: any) {
            const name = e?.name || e?.code;
            // Unconfirmed user → direct to registration confirmation flow
            if (name === 'UserNotConfirmedException' || name === 'InvalidParameterException') {
                const msg  =
                    'you need to finish registering before logging in, please enter the code sent to your email below:';
                console.log("need to confirm the user");
                try {
                    await resendSignUpCode({ username });
                    navigation.navigate('RegistrationEmail', {
                        username: username,
                        email: username,
                        msg: msg
                        // optional extras if your screen supports them:
                        // msg: 'We resent your registration confirmation code. Please check your email.',
                        // mode: 'confirmSignUp',
                    });
                } catch (e2: any) {
                    console.log('[resendSignUpCode] ERROR', e2?.name, e2?.message);
                    setVisibleError(e2?.message || 'Could not resend the confirmation code. Please try again.');
                }
                return;
            }
            // Optional: gentle handling for user-not-found (don’t leak existence)
            if (name === 'UserNotFoundException') {
                setVisibleError('If the user exists, an email was sent to: ' + username);
                setError(true);
                return;
            }
            // Throttling or other errors — show a friendly message, or surface e.message
            if (name === 'LimitExceededException') {
                setVisibleError('Too many requests. Please wait a moment and try again.');
                return;
            }
            console.log('[resetPassword] ERROR', name, e?.message);
            setVisibleError('Something went wrong. Please try again.');
        }
    };
    return(
        <View style={sharedStyles.containerSettings}>
            <HeaderBar/>
            <Text style={styles.resetPassword}>Reset your password</Text>
            <Text style={styles.enterEmail}>Enter your email address and we'll send you </Text>
            <Text style={styles.sendInstructions}>instructions to reset your password.</Text>
            {
                visibleError.length > 0 &&
                <>
                    <Text style={sharedStyles.errorText}>
                        {visibleError}
                    </Text>
                </>
            }
            {
                !error &&
                <>
                    <FormTextField
                        labelText="email"
                        labelMarginTop={FP_EMAIL_TOP_MARGIN}
                        value={email}
                        onChangeText={setEmail}
                        placeholder=""
                    />
                    <CenteredButton
                        text="reset password"
                        widthPercent={FP_RESET_BTN_WIDTH}
                        heightPercent={FP_RESET_BTN_HEIGHT}
                        marginTopPercent={FP_RESET_BTN_TOP_MARGIN}
                        onPress={sendEmail}
                    />
                </>
            }
            <CenteredButton
                text="return to login"
                widthPercent={RESET_RETURN_BTN_WIDTH}
                heightPercent={RESET_RETURN_BTN_HEIGHT}
                marginTopPercent={RESET_RETURN_BTN_TOP_MARGIN}
                onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
            />
        </View>
    );
}
