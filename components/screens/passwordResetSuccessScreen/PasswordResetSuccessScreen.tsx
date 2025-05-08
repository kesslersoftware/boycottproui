import {View, Text, Pressable} from "react-native";
import {styles} from "../passwordResetSuccessScreen/PasswordResetSuccessScreenStyles";
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import React, {useState} from "react";
import {sharedStyles} from "../../../styles/sharedStyles";
import {
    PRS_RETURN_BTN_HEIGHT, PRS_RETURN_BTN_TOP_MARGIN,
    PRS_RETURN_BTN_WIDTH,
    RESET_RETURN_BTN_HEIGHT,
    RESET_RETURN_BTN_TOP_MARGIN,
    RESET_RETURN_BTN_WIDTH
} from "../../../styles/constants";
import CenteredButton from "../../helpers/button/CenteredButton";

export default function PasswordResetSuccessScreen() {
    const [gotoLogin, setGotoLogin] = useState<boolean>(true);
    return(
        <View style={sharedStyles.containerSettings}>
            <HeaderBar/>
            <View style={styles.passwordRestContent}>
                <Text style={styles.checkbox}>✅</Text>
                <Text style={styles.resetSuccess}>password has been reset successfully</Text>
                {
                    gotoLogin &&
                    (
                        <CenteredButton
                            text="return to login"
                            widthPercent={PRS_RETURN_BTN_WIDTH}
                            heightPercent={PRS_RETURN_BTN_HEIGHT}
                            marginTopPercent={PRS_RETURN_BTN_TOP_MARGIN}
                            onPress={() => console.log('return to login pressed')}
                        />
                    )
                }
                {
                    !gotoLogin &&
                    (
                        <CenteredButton
                            text="return to home"
                            widthPercent={PRS_RETURN_BTN_WIDTH}
                            heightPercent={PRS_RETURN_BTN_HEIGHT}
                            marginTopPercent={PRS_RETURN_BTN_TOP_MARGIN}
                            onPress={() => console.log('return to login pressed')}
                        />
                    )
                }
            </View>
        </View>
    );
}
