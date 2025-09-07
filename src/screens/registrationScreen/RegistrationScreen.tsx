import {View, Text} from "react-native";
import {styles} from "./RegistrationScreenStyles";
import HeaderBar from "../../components/headerBar/HeaderBar";
import CustomCheckbox from "../../components/customCheckbox/CustomCheckbox"
import React, { useState } from 'react'
import ErrorSection from "../../components/errorSection/ErrorSection";
import {sharedStyles} from "../../../styles/sharedStyles";
import {
    RG_EMAIL_TOP_MARGIN,
    RG_PASSWORD_TOP_MARGIN,
    RG_REDO_EMAIL_TOP_MARGIN,
    RG_REDO_PASSWORD_TOP_MARGIN, RG_REGISTER_BTN_HEIGHT, RG_REGISTER_BTN_TOP_MARGIN,
    RG_REGISTER_BTN_WIDTH,
    RG_USERNAME_TOP_MARGIN,
    SUCCESS_GREEN,
    BRIGHT_BLUE
} from "../../../styles/constants";
import CenteredButton from "../../components/button/CenteredButton";
import FormTextField from "../../components/labelAndField/FormTextField";
import FormPasswordField from "../../components/labelAndField/FormPasswordField";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";
import { useUser } from '../../context/UserContext';
import {resendSignUpCode, signUp} from 'aws-amplify/auth';
import LoadingOverlay from "../../components/common/LoadingOverlay";
import AsyncStorage from '@react-native-async-storage/async-storage';

type RegistrationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Registration'>
type RegistrationScreenRouteProp = RouteProp<RootStackParamList, 'Registration'>

export default function RegistrationScreen() {
    // navigation constants
    const navigation = useNavigation<RegistrationScreenNavigationProp>();
    const route = useRoute<RegistrationScreenRouteProp>();
    const { user } = useUser();
    const [visibleErrors, setVisibleErrors] = useState<number[]>([]); // 7,8,9
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [redoEmail, setRedoEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redoPassword, setRedoPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const isValidEmailFormat = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const doEmailsMatch = email && redoEmail && email === redoEmail;
    const doPasswordsMatch = password && redoPassword && password === redoPassword;

    const isValidPassword = (pwd: string) =>

        pwd.length >= 8;

    const isFormValid =
        isValidEmailFormat(email) &&
        doEmailsMatch &&
        password.length >= 8 &&
        doPasswordsMatch &&
        isValidPassword(password) &&
        checked;

    const register = async () => {
        const errors: number[] = [];

        if (!email || !redoEmail) errors.push(6); // empty field
        else if (!isValidEmailFormat(email)) errors.push(10); // bad format
        else if (!doEmailsMatch) errors.push(6); // mismatched emails

        if (!password || !redoPassword) errors.push(6);
        else {
            if (!isValidPassword(password)) errors.push(8);
            if (!doPasswordsMatch) errors.push(9);
        }

        if (!checked) errors.push(6);

        if (errors.length > 0) {
            setVisibleErrors(errors);
            return;
        }
        let usernameForCognito = '';
        try {
            setLoading(true);
            const emailNorm = email.trim();
            const preferred = (username || '').trim();
            console.log("preferred = ",preferred);
            const userAttributes: Record<string, string> = { email: emailNorm };
            if (preferred && !preferred.includes('@')) {
                userAttributes.preferred_username = preferred;
            }
            console.log('🚀 SignUp requestXXXXXXXXXXXXXX:', {
                username: emailNorm,
                password: '[REDACTED]',
                options: { userAttributes },
            });
            const result = await signUp({
                username: emailNorm,         // ✅ email is the username now
                password,
                options: { userAttributes }, // includes email, and optional preferred_username
            });
            console.log('✅ SignUp success:', result);
            navigation.navigate('RegistrationEmail', { username: emailNorm, email: emailNorm });
        } catch (err: any) {
            const name = err?.name ?? '';
            const msg  = err?.message ?? '';
            console.error('❌ SignUp error:', { name, msg });
            if (name === 'UsernameExistsException' || name === 'AliasExistsException') {
                try {
                    const emailNorm = email.trim();
                    // If user is UNCONFIRMED, this succeeds and we go straight to the code screen
                    await resendSignUpCode({ username: emailNorm });
                    navigation.navigate('RegistrationEmail', { username: emailNorm, email: emailNorm });
                    return;
                } catch (resendErr: any) {
                    const rmsg = resendErr?.message ?? '';
                    // Confirmed users typically trigger: InvalidParameterException: User is already confirmed
                    if (/already confirmed/i.test(rmsg)) {
                        setVisibleErrors([13]); // show the confirmed-account message
                        return;
                    }
                    // Any other resend failure -> generic
                    setVisibleErrors([5]);
                    return;
                }
            }
            setVisibleErrors([5]); // Generic AWS signup error
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={sharedStyles.containerSettings}>
          <HeaderBar/>
            { loading && <LoadingOverlay />}
            { !loading &&
                <>
                  <Text style={styles.createAccount}>Create your account</Text>
                  <ErrorSection
                        errorIndexes={visibleErrors}
                        onLinkPress={() => {}}
                  />
                  <FormTextField
                      labelText="username(optional)"
                      labelMarginTop={RG_USERNAME_TOP_MARGIN}
                      value={username}
                      onChangeText={setUsername}
                      placeholder=""
                  />
                    <FormTextField
                        labelText="email"
                        labelMarginTop={RG_EMAIL_TOP_MARGIN}
                        value={email}
                        onChangeText={setEmail}
                        placeholder=""
                    />
                    <FormTextField
                        labelText="repeat email"
                        labelMarginTop={RG_REDO_EMAIL_TOP_MARGIN}
                        value={redoEmail}
                        onChangeText={setRedoEmail}
                        placeholder=""
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
                      <CustomCheckbox
                          checked = {checked}
                          setCheck = {() => setChecked(!checked)}
                      />
                  <CenteredButton
                     text="Register"
                     color = {SUCCESS_GREEN}
                     widthPercent={RG_REGISTER_BTN_WIDTH}
                     heightPercent={RG_REGISTER_BTN_HEIGHT}
                     marginTopPercent={RG_REGISTER_BTN_TOP_MARGIN}
                     onPress={register}
                     disabled={!isFormValid}
                  />
                  <CenteredButton
                     text="go back to login"
                     color = {BRIGHT_BLUE}
                     widthPercent={RG_REGISTER_BTN_WIDTH}
                     heightPercent={RG_REGISTER_BTN_HEIGHT}
                     marginTopPercent={RG_REGISTER_BTN_TOP_MARGIN}
                     onPress={() => navigation.goBack()}
                  />
                </>
          }
      </View>
    );
}
