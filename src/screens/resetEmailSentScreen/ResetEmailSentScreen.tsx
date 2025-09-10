import {View, Text, Pressable, TextInput} from "react-native";
import {styles} from "./ResetEmailSentScreenStyles";
import HeaderBar from "../../components/headerBar/HeaderBar";
import React, {useEffect, useState} from "react";
import {sharedStyles} from "../../../styles/sharedStyles";
import {
    FP_EMAIL_TOP_MARGIN,
    RESET_RETURN_BTN_HEIGHT, RESET_RETURN_BTN_TOP_MARGIN,
    RESET_RETURN_BTN_WIDTH, RG_PASSWORD_TOP_MARGIN, RG_REDO_PASSWORD_TOP_MARGIN, SUCCESS_GREEN
} from "../../../styles/constants";
import CenteredButton from "../../components/button/CenteredButton";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";
import { useUser } from "src/context/UserContext";
import {confirmResetPassword, resetPassword} from "aws-amplify/auth";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import FormTextField from "../../components/labelAndField/FormTextField";
import FormPasswordField from "../../components/labelAndField/FormPasswordField";

type ResetEmailSentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetEmailSent'>
type ResetEmailSentScreenRouteProp = RouteProp<RootStackParamList, 'ResetEmailSent'>

export default function ResetEmailSentScreen() {
    // navigation constants
    const navigation = useNavigation<ResetEmailSentScreenNavigationProp>();
    const route = useRoute<ResetEmailSentScreenRouteProp>();
    const username = route.params?.email ?? '';
    const { user } = useUser();
    const [password, setPassword] = useState('');
    const [redoPassword, setRedoPassword] = useState('');
    const doPasswordsMatch = password && redoPassword && password === redoPassword;
    const isFormValid = password.length >= 8;
    const [resendButton , setResendButton] = useState<boolean>(false);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [visibleError, setVisibleError] = useState<string>('');
    const reset = () => {
        setPassword('');
        setRedoPassword('');
        setConfirmationCode('');
    }
    const handleConfirm = async () => {
        setLoading(true);
        setVisibleError('');
        try {
            if(!doPasswordsMatch) {
                setVisibleError("passwords do not match");
            } else {
                console.log('🚀 confirm new password request:', {
                    username: username,
                    confirmationCode,
                });
                const result = await confirmResetPassword({
                    username: username.trim(),
                    confirmationCode: confirmationCode.trim(),
                    password: password,
                });
                console.log('✅ confirm new password:', result);
                setIsSuccess(true);
            }
        } catch (err: any) {
            const name = err?.name || err?.code;
            console.error('❌ ConfirmSignUp error:', err);
            reset();
            switch (name) {
                case 'CodeMismatchException':
                    setVisibleError('The verification code is incorrect. Please check the code and try again.');
                    setResendButton(true);
                    break;

                case 'ExpiredCodeException':
                    setVisibleError('That code has expired. Request a new reset code and try again.');
                    setResendButton(true);
                    break;

                case 'LimitExceededException':
                    setVisibleError('Too many attempts. Please wait a moment and try again.');
                    break;

                default:
                    setVisibleError(err?.message || 'Something went wrong. Please try again.');
                    break;
            }
        } finally {
            setLoading(false);
        }
    };
    const resend = async () => {
        setLoading(true);
        try {
            await resetPassword({ username: username.trim() });
            console.log("resetPassword call successful");
            setVisibleError('');
            setIsSuccess(false);
            setResendButton(false);
        } catch (err: any) {
            setVisibleError(err?.message || 'Something went wrong. Please try again.');
            // what do we do here? the thought is that if this call fails, they can't finish
        } finally {
            setLoading(false);
        }
    }
    return(
        <View style={sharedStyles.containerSettings}>
            <HeaderBar/>
            { loading && <LoadingOverlay />}
            {
                !loading && !isSuccess &&
                <>
                    <View style={styles.resetEmailContent}>
                        <Text style={styles.checkEmail}>Check Your Email</Text>
                        <Text style={styles.ifAccount}>If an account exists for that email,</Text>
                        <Text style={styles.sentInstructions}>we have sent reset instructions. </Text>
                        {
                            visibleError.length > 0 &&
                            <>
                                <Text style={sharedStyles.errorText}>
                                    {visibleError}
                                </Text>
                            </>
                        }
                        <FormTextField
                            labelText="confirm code"
                            labelMarginTop={FP_EMAIL_TOP_MARGIN}
                            value={confirmationCode}
                            onChangeText={setConfirmationCode}
                            placeholder=""
                            isNumber={true}
                        />
                        <FormPasswordField
                            labelText="password"
                            labelMarginTop={RG_PASSWORD_TOP_MARGIN}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <FormPasswordField
                            labelText="repeat password"
                            labelMarginTop={RG_REDO_PASSWORD_TOP_MARGIN}
                            value={redoPassword}
                            onChangeText={setRedoPassword}
                        />
                        <CenteredButton
                            text="submit"
                            widthPercent={RESET_RETURN_BTN_WIDTH}
                            heightPercent={RESET_RETURN_BTN_HEIGHT}
                            marginTopPercent={RESET_RETURN_BTN_TOP_MARGIN}
                            onPress={handleConfirm}
                            disabled={!isFormValid}
                        />
                        {
                            resendButton &&
                            <CenteredButton
                                text="resend email"
                                widthPercent={RESET_RETURN_BTN_WIDTH}
                                heightPercent={RESET_RETURN_BTN_HEIGHT}
                                marginTopPercent={RESET_RETURN_BTN_TOP_MARGIN}
                                onPress={resend}
                            />
                        }
                    </View>
                </>
            }
            {
                !loading && isSuccess &&
                <>
                    <View style={styles.resetEmailContent}>
                        <Text style={styles.sentInstructions}>Password changed successfully!</Text>
                        <CenteredButton
                            text="return to login"
                            widthPercent={RESET_RETURN_BTN_WIDTH}
                            heightPercent={RESET_RETURN_BTN_HEIGHT}
                            marginTopPercent={RESET_RETURN_BTN_TOP_MARGIN}
                            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
                        />
                    </View>
                </>
            }
        </View>
    );
}
