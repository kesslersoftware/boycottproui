import {View, Text, TextInput } from "react-native";
import {styles} from "./RegistrationEmailSentStyles";
import HeaderBar from "../../components/headerBar/HeaderBar";
import React, {useEffect, useState} from 'react';
import {sharedStyles} from "../../../styles/sharedStyles";
import CenteredButton from "../../components/button/CenteredButton";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import {
    FP_EMAIL_TOP_MARGIN,
    RG_REGISTER_BTN_HEIGHT,
    RG_REGISTER_BTN_TOP_MARGIN,
    RG_REGISTER_BTN_WIDTH
} from "../../../styles/constants";
import FormTextField from "../../components/labelAndField/FormTextField";
type RegistrationEmailSentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RegistrationEmail'>
type RegistrationEmailSentScreenRouteProp = RouteProp<RootStackParamList, 'RegistrationEmail'>

const RESEND_COOLDOWN_SECONDS = 60;

export default function RegistrationEmailSentScreen() {
    const navigation = useNavigation<RegistrationEmailSentScreenNavigationProp>();
    const route = useRoute<RegistrationEmailSentScreenRouteProp>();

    const username = route.params?.username ?? '';
    const email = route.params?.email ?? '';
    const message = route.params?.msg ?? '';
    const [confirmationCode, setConfirmationCode] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // For resend UX
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState<number>(0);
    const [resendMessage, setResendMessage] = useState<string | null>(null);

    // Error indices for ErrorSection (index 12 = “User is already confirmed”)
    const [visibleError, setVisibleError] = useState<string>('');

    // Tick down the cooldown
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setInterval(() => setCooldown((s) => s - 1), 1000);
        return () => clearInterval(t);
    }, [cooldown]);
    useEffect(() => {
        if(message.length>0) {
            setVisibleError(message);
        }
    }, []);
    const handleConfirm = async () => {
        setLoading(true);
        setVisibleError('');
        try {
            console.log('🚀 ConfirmSignUp request:', {
                username: username,
                confirmationCode,
            });
            const result = await confirmSignUp({
                username: username,
                confirmationCode: String(confirmationCode),
            });
            console.log('✅ ConfirmSignUp success:', result);
            setIsSuccess(true);
        } catch (err: any) {
            console.error('❌ ConfirmSignUp error:', err);
            // Known Cognito behavior: NotAuthorizedException or InvalidParameterException with message
            const msg: string = err?.message ?? '';
            // Specifically catch already-confirmed user
            if (/already confirmed/i.test(msg)) {
                setVisibleError('User is already confirmed'); // Your index for "User is already confirmed"
            } else {
                // Generic error bucket (pick whatever index fits your ErrorSection)
                // If you want to show the raw message, you can keep local text instead.
                setVisibleError('Something went wrong. Please try again.'); // “Incorrect email or password. Please try again.” (generic)
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (cooldown > 0 || resending) return;
        setResending(true);
        setResendMessage(null);
        setVisibleError(''); // clear old errors
        try {
            console.log('🔁 ResendSignUpCode request:', { username: username });
            const result = await resendSignUpCode({ username: username });
            console.log('✅ ResendSignUpCode success:', result);
            setResendMessage('📧 A new confirmation code has been sent.');
            setCooldown(RESEND_COOLDOWN_SECONDS);
        } catch (err: any) {
            console.error('❌ ResendSignUpCode error:', {
                name: err?.name,
                message: err?.message,
                $metadata: err?.$metadata,
            });
            const msg: string = err?.message ?? '';
            if (/already confirmed/i.test(msg)) {
                setVisibleError('User is already confirmed');
            } else {
                setResendMessage('Failed to resend confirmation code.');
            }
        } finally {
            setResending(false);
        }
    };

    return (
        <View style={sharedStyles.containerSettings}>
            <HeaderBar />
            {
                !isSuccess ? (
                <>
                    <Text style={styles.verifyEmail}>Verify your email</Text>
                    <Text style={styles.verificationLink}>
                        We’ve sent a verification code to {email || 'your email'}.
                    </Text>
                    <Text style={styles.checkInbox}>Enter it below to complete registration.</Text>
                    {
                        visibleError.length > 0 &&
                        <>
                            <Text style={sharedStyles.errorText}>
                                {visibleError}
                            </Text>
                        </>
                    }
                    <FormTextField
                        labelText="Confirmation code"
                        labelMarginTop={FP_EMAIL_TOP_MARGIN}
                        value={confirmationCode}
                        onChangeText={setConfirmationCode}
                        placeholder=""
                        isNumber={true}
                    />
                    <CenteredButton
                        text={loading ? 'Confirming...' : 'Confirm'}
                        widthPercent={RG_REGISTER_BTN_WIDTH}
                        heightPercent={RG_REGISTER_BTN_HEIGHT}
                        marginTopPercent={RG_REGISTER_BTN_TOP_MARGIN}
                        onPress={handleConfirm}
                        disabled={loading || !confirmationCode}
                    />

                    <CenteredButton
                        text={
                            resending
                                ? 'Resending...'
                                : cooldown > 0
                                    ? `Resend Code (${cooldown}s)`
                                    : 'Resend Code'
                        }
                        widthPercent={RG_REGISTER_BTN_WIDTH}
                        heightPercent={RG_REGISTER_BTN_HEIGHT}
                        marginTopPercent={RG_REGISTER_BTN_TOP_MARGIN}
                        onPress={handleResendCode}
                        disabled={resending || cooldown > 0}
                    />

                    {resendMessage && <Text style={styles.resendMessage}>{resendMessage}</Text>}
                </>
            ) : (
                <>
                    <Text style={styles.successMessage}>✅ Your email has been successfully confirmed!</Text>
                    <CenteredButton
                        text="Back to Login"
                        widthPercent={RG_REGISTER_BTN_WIDTH}
                        heightPercent={RG_REGISTER_BTN_HEIGHT}
                        marginTopPercent={RG_REGISTER_BTN_TOP_MARGIN}
                        onPress={() => navigation.navigate('Login')}
                    />
                </>
            )}
        </View>
    );
}
