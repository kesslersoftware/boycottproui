import {View, Text} from 'react-native'
import {styles} from "../loginScreen/LoginScreenStyles";
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import React, { useState } from 'react'
import ErrorSectionLarge from "../../helpers/errorSection/LoginPageErrorSection";
import {sharedStyles} from "../../../styles/sharedStyles";
import CenteredButton from "../../helpers/button/CenteredButton";
import {
    LS_LOGIN_USERNAME_TOP_MARGIN,
    LS_LOGIN_BTN_HEIGHT,
    LS_LOGIN_BTN_TOP_MARGIN,
    LS_LOGIN_BTN_WIDTH,
    LS_REGISTER_BTN_HEIGHT,
    LS_REGISTER_BTN_TOP_MARGIN,
    LS_REGISTER_BTN_WIDTH,
    SUCCESS_GREEN, LS_LOGIN_PASSWORD_TOP_MARGIN
} from "../../../styles/constants";
import FormTextField from "../../helpers/labelAndField/FormTextField";
import FormPasswordField from "../../helpers/labelAndField/FormPasswordField";
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../../types/types";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>

const handleErrorLink = (target: string) => {
    if (target === 'resendEmail') {
        console.log('Resending email…')
        // trigger resend logic here
    }
}
export default function LoginScreen() {
    // navigation constants
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const route = useRoute<LoginScreenRouteProp>();
    const user = route.params.user;

    const [visibleErrors, setVisibleErrors] = useState<number[]>([2,3,4]) // 2,3,4,5,0
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    return (
        <View style={sharedStyles.containerSettings}>
            <HeaderBar/>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.toText}>to</Text>
            <Text style={styles.boycottText}>BoycottPro!</Text>
            <Text style={styles.slogan}>“Vote with your wallet. Track with your phone.”</Text>
            <ErrorSectionLarge
                errorIndexes={visibleErrors}
                onLinkPress={handleErrorLink}
            />
            <Text style={styles.signInTxt}>please sign in:</Text>
            <FormTextField
                labelText="username"
                labelMarginTop={LS_LOGIN_USERNAME_TOP_MARGIN}
                value=""
                onChangeText={setUsername}
                placeholder=""
            />
            <FormPasswordField
                labelText="password"
                labelMarginTop={LS_LOGIN_PASSWORD_TOP_MARGIN}
                value=""
                onChangeText={setPassword}
            />
            <Text style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>forgot password?</Text>
            <CenteredButton
                text="Login"
                widthPercent={LS_LOGIN_BTN_WIDTH}
                heightPercent={LS_LOGIN_BTN_HEIGHT}
                marginTopPercent={LS_LOGIN_BTN_TOP_MARGIN}
                onPress={() => navigation.navigate('Home')}
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
        </View>
    )
}



