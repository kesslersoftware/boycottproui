import {View, Text, Pressable, TextInput} from "react-native";
import {styles} from "./ForgotPasswordScreenStyles";
import HeaderBar from "../../components/headerBar/HeaderBar";
import ErrorSection from "../../components/errorSection/ErrorSection";
import React, {useState} from "react";
import {sharedStyles} from "../../../styles/sharedStyles";
import {
    FP_EMAIL_TOP_MARGIN,
    FP_RESET_BTN_HEIGHT,
    FP_RESET_BTN_TOP_MARGIN,
    FP_RESET_BTN_WIDTH
} from "../../../styles/constants";
import CenteredButton from "../../components/button/CenteredButton";
import FormTextField from "../../components/labelAndField/FormTextField";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";
import {useUser} from "../../context/UserContext";

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>
type ForgotPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ForgotPassword'>
const handleErrorLink = (target: string) => {
    if (target === 'resendEmail') {
        console.log('Resending email…')
        // trigger resend logic here
    }
}
export default function ForgotPasswordScreen() {
    // navigation constants
    const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
    const route = useRoute<ForgotPasswordScreenRouteProp>();
    const { user } = useUser();

    const [visibleErrors, setVisibleErrors] = useState<number[]>([10]) // 2,3,4,5,0
    const [email, setEmail] = useState('')
    return(
        <View style={sharedStyles.containerSettings}>
            <HeaderBar/>
            <Text style={styles.resetPassword}>Reset your password</Text>
            <Text style={styles.enterEmail}>Enter your email address and we'll send you </Text>
            <Text style={styles.sendInstructions}>instructions to reset your password.</Text>
            <ErrorSection
                errorIndexes={visibleErrors}
                onLinkPress={handleErrorLink}
            />
            <FormTextField
                labelText="email"
                labelMarginTop={FP_EMAIL_TOP_MARGIN}
                value=""
                onChangeText={setEmail}
                placeholder=""
            />
            <CenteredButton
                text="reset password"
                widthPercent={FP_RESET_BTN_WIDTH}
                heightPercent={FP_RESET_BTN_HEIGHT}
                marginTopPercent={FP_RESET_BTN_TOP_MARGIN}
                onPress={() => navigation.navigate('ResetEmailSent')}
            />
        </View>
    );
}
