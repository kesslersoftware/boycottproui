import {View, Text, Pressable, TextInput} from "react-native";
import {styles} from "../forgotPasswordScreen/ForgotPasswordScreenStyles";
import StatusBar from "../../helpers/statusBar/StatusBar";
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import ErrorSection from "../../helpers/errorSection/ErrorSection";
import React, {useState} from "react";
import {sharedStyles} from "../../../styles/sharedStyles";
import {
    FP_EMAIL_TOP_MARGIN,
    FP_REGISTER_BTN_HEIGHT, FP_REGISTER_BTN_TOP_MARGIN,
    FP_REGISTER_BTN_WIDTH, FP_RESET_BTN_HEIGHT, FP_RESET_BTN_TOP_MARGIN, FP_RESET_BTN_WIDTH,
    RES_REGISTER_BTN_HEIGHT,
    RES_REGISTER_BTN_TOP_MARGIN,
    RES_REGISTER_BTN_WIDTH, RG_EMAIL_TOP_MARGIN
} from "../../../styles/constants";
import CenteredButton from "../../helpers/button/CenteredButton";
import FormTextField from "../../helpers/labelAndField/FormTextField";

const handleErrorLink = (target: string) => {
    if (target === 'resendEmail') {
        console.log('Resending email…')
        // trigger resend logic here
    }
}
export default function ForgotPasswordScreen() {
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
                onPress={() => console.log('reset password pressed')}
            />
        </View>
    );
}
