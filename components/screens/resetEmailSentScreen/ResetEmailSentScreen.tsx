import {View, Text, Pressable} from "react-native";
import {styles} from "../resetEmailSentScreen/ResetEmailSentScreenStyles";
import StatusBar from "../../helpers/statusBar/StatusBar";
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import React from "react";
import {sharedStyles} from "../../../styles/sharedStyles";
import {
    RES_REGISTER_BTN_HEIGHT,
    RES_REGISTER_BTN_TOP_MARGIN,
    RES_REGISTER_BTN_WIDTH, RESET_RETURN_BTN_HEIGHT, RESET_RETURN_BTN_TOP_MARGIN,
    RESET_RETURN_BTN_WIDTH
} from "../../../styles/constants";
import CenteredButton from "../../helpers/button/CenteredButton";

export default function ResetEmailSentScreen() {
    return(
        <View style={sharedStyles.containerSettings}>
            <HeaderBar/>
            <View style={styles.resetEmailContent}>
                <Text style={styles.checkEmail}>Check Your Email</Text>
                <Text style={styles.ifAccount}>If an account exists for that email,</Text>
                <Text style={styles.sentInstructions}>we have sent reset instructions. </Text>
                <CenteredButton
                    text="return to login"
                    widthPercent={RESET_RETURN_BTN_WIDTH}
                    heightPercent={RESET_RETURN_BTN_HEIGHT}
                    marginTopPercent={RESET_RETURN_BTN_TOP_MARGIN}
                    onPress={() => console.log('return to login pressed')}
                />
            </View>
        </View>
    );
}
