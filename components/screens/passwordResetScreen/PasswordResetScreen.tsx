import {View, Text, TextInput, Pressable} from "react-native";
import {styles} from "../passwordResetScreen/PasswordResetScreenStyles";
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import React, {useState} from "react";
import ErrorSection from "../../helpers/errorSection/ErrorSection";
import {sharedStyles} from "../../../styles/sharedStyles";
import FormPasswordField from "../../helpers/labelAndField/FormPasswordField";
import {
    PR_RESET_BTN_WIDTH, FP_REGISTER_BTN_TOP_MARGIN,
    FP_REGISTER_BTN_WIDTH,
    PR_PASSWORD_TOP_MARGIN,
    PR_REDO_PASSWORD_TOP_MARGIN,
    RG_PASSWORD_TOP_MARGIN,
    RG_REDO_PASSWORD_TOP_MARGIN, PR_RESET_BTN_HEIGHT, PR_RESET_BTN_TOP_MARGIN
} from "../../../styles/constants";
import CenteredButton from "../../helpers/button/CenteredButton";

const handleErrorLink = (target: string) => {
    if (target === 'resendEmail') {
        console.log('Resending email…')
        // trigger resend logic here
    }
}
export default function PasswordResetScreen() {
    const [visibleErrors, setVisibleErrors] = useState<number[]>([11]) // 2,3,4,5,0
    const [password, setPassword] = useState('')
    const [redoPassword, setRedoPassword] = useState('')
    return(
        <View style={sharedStyles.containerSettings}>
            <HeaderBar/>
            <View style={styles.passwordRestContent}>
                <Text style={styles.resetPassword}>Password reset</Text>
                <Text style={styles.pleaseReset}>please reset your  password below:</Text>
            </View>
            <ErrorSection
                errorIndexes={visibleErrors}
                onLinkPress={handleErrorLink}
            />
            <FormPasswordField
                labelText="password"
                labelMarginTop={PR_PASSWORD_TOP_MARGIN}
                value=""
                onChangeText={setPassword}
            />
            <FormPasswordField
                labelText="repeat password"
                labelMarginTop={PR_REDO_PASSWORD_TOP_MARGIN}
                value=""
                onChangeText={setRedoPassword}
            />
            <CenteredButton
                text="reset password"
                widthPercent={PR_RESET_BTN_WIDTH}
                heightPercent={PR_RESET_BTN_HEIGHT}
                marginTopPercent={PR_RESET_BTN_TOP_MARGIN}
                onPress={() => console.log('reset password pressed')}
            />
        </View>
    );
}
