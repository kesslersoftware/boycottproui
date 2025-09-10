import {View, Text, TextInput, Pressable} from "react-native";
import {styles} from "./PasswordResetScreenStyles";
import HeaderBar from "../../components/headerBar/HeaderBar";
import React, {useState} from "react";
import {sharedStyles} from "../../../styles/sharedStyles";
import FormPasswordField from "../../components/labelAndField/FormPasswordField";
import {
    PR_RESET_BTN_WIDTH,
    PR_PASSWORD_TOP_MARGIN,
    PR_REDO_PASSWORD_TOP_MARGIN,
    PR_RESET_BTN_HEIGHT, PR_RESET_BTN_TOP_MARGIN, DELETE_RED, SUCCESS_GREEN
} from "../../../styles/constants";
import CenteredButton from "../../components/button/CenteredButton";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";
import { useUser } from '../../context/UserContext';
import {updatePassword} from "@aws-amplify/auth";

type PasswordResetScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PasswordReset'>
type PasswordResetScreenRouteProp = RouteProp<RootStackParamList, 'PasswordReset'>

const handleErrorLink = (target: string) => {
    if (target === 'resendEmail') {
        console.log('Resending email…')
        // trigger resend logic here
    }
}
export default function PasswordResetScreen() {
    // navigation constants
    const navigation = useNavigation<PasswordResetScreenNavigationProp>();
    const route = useRoute<PasswordResetScreenRouteProp>();
    const { user } = useUser();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [redoPassword, setRedoPassword] = useState('');
    const doPasswordsMatch = newPassword && redoPassword && newPassword === redoPassword;
    const isFormValid = newPassword.length >= 8 && oldPassword.length >= 8 && redoPassword.length >= 8;
    const [visibleError, setVisibleError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const resetPassword = async () => {
        setVisibleError('');
        try {
            if(doPasswordsMatch) {
                await updatePassword({ oldPassword, newPassword });
                setSuccess(true);
            } else {
                setVisibleError("passwords do not match");
            }
        } catch (e: any) {
            const name = e?.name || e?.code;
            switch (name) {
                case 'NotAuthorizedException':
                    setVisibleError?.('Your new password is incorrect.');
                    break;
                case 'InvalidPasswordException':
                    setVisibleError?.(
                        e?.message ||
                        'your new password does not meet our policy. Use at least 8 characters.'
                    );
                    break;
                case 'LimitExceededException':
                    setVisibleError?.('Too many attempts. Please wait a moment and try again.');
                    break;
                case 'PasswordResetRequiredException':
                    setVisibleError?.('Your account requires a password reset. Please sign out and use “Forgot password”.');
                    break;
                default:
                    setVisibleError?.(e?.message || 'Something went wrong. Please try again.');
                    break;
            }
        }
    }
    const returnToProfileSettings = () => {
        navigation.goBack();
    }
    const returnToHome = () => {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
    return(
        <View style={sharedStyles.containerSettings}>
            <HeaderBar/>
            {
                !success &&
                <>
                    <View style={styles.passwordRestContent}>
                        <Text style={styles.resetPassword}>Password reset</Text>
                        <Text style={styles.pleaseReset}>please reset your password below:</Text>
                    </View>
                    {
                        visibleError.length > 0 &&
                        <>
                            <Text style={sharedStyles.errorText}>
                                {visibleError}
                            </Text>
                        </>
                    }
                    <FormPasswordField
                        labelText="old password"
                        labelMarginTop={PR_PASSWORD_TOP_MARGIN}
                        value={oldPassword}
                        onChangeText={setOldPassword}
                    />
                    <FormPasswordField
                        labelText="new password"
                        labelMarginTop={PR_REDO_PASSWORD_TOP_MARGIN}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <FormPasswordField
                        labelText="repeat new password"
                        labelMarginTop={PR_REDO_PASSWORD_TOP_MARGIN}
                        value={redoPassword}
                        onChangeText={setRedoPassword}
                    />
                    <CenteredButton
                        text="reset password"
                        widthPercent={PR_RESET_BTN_WIDTH}
                        heightPercent={PR_RESET_BTN_HEIGHT}
                        marginTopPercent={PR_RESET_BTN_TOP_MARGIN}
                        onPress={resetPassword}
                        disabled={!isFormValid}
                    />
                    <CenteredButton
                        text="cancel"
                        color={DELETE_RED}
                        widthPercent={PR_RESET_BTN_WIDTH}
                        heightPercent={PR_RESET_BTN_HEIGHT}
                        marginTopPercent={PR_RESET_BTN_TOP_MARGIN}
                        onPress={returnToProfileSettings}
                    />
                </>
            }
            {
                success &&
                <>
                    <View style={styles.passwordRestContent}>
                        <Text style={styles.resetPassword}>password changed successfully!</Text>
                    </View>
                    <CenteredButton
                        text="return to settings"
                        //color={SUCCESS_GREEN}
                        widthPercent={PR_RESET_BTN_WIDTH}
                        heightPercent={PR_RESET_BTN_HEIGHT}
                        marginTopPercent={PR_RESET_BTN_TOP_MARGIN}
                        onPress={returnToProfileSettings}
                    />
                    <CenteredButton
                        text="return to home"
                        //color={DELETE_RED}
                        widthPercent={PR_RESET_BTN_WIDTH}
                        heightPercent={PR_RESET_BTN_HEIGHT}
                        marginTopPercent={PR_RESET_BTN_TOP_MARGIN}
                        onPress={returnToHome}
                    />
                </>
            }
        </View>
    );
}
