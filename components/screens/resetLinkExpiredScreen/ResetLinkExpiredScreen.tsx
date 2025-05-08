import {View, Text, Pressable} from "react-native";
import {styles} from "../resetLinkExpiredScreen/ResetlLinkExpiredScreenStyles";
import StatusBar from "../../helpers/statusBar/StatusBar";
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import React from "react";
import {sharedStyles} from "../../../styles/sharedStyles";
import {
    RES_REGISTER_BTN_HEIGHT,
    RES_REGISTER_BTN_TOP_MARGIN,
    RES_REGISTER_BTN_WIDTH, RLE_RESEND_BTN_HEIGHT, RLE_RESEND_BTN_TOP_MARGIN,
    RLE_RESEND_BTN_WIDTH
} from "../../../styles/constants";
import CenteredButton from "../../helpers/button/CenteredButton";

export default function ResetLinkExpiredScreen() {
    return(
        <View style={sharedStyles.containerSettings}>
            <HeaderBar/>
            <View style={styles.linkExpiredContent}>
                <Text style={styles.linkExpired}>Link expired!</Text>
                <Text style={styles.linkHas}>This password reset link has expired or is invalid.</Text>
                <Text style={styles.request}>Please request a new one.</Text>
                <CenteredButton
                    text="resend email"
                    widthPercent={RLE_RESEND_BTN_WIDTH}
                    heightPercent={RLE_RESEND_BTN_HEIGHT}
                    marginTopPercent={RLE_RESEND_BTN_TOP_MARGIN}
                    onPress={() => console.log('resend email pressed')}
                />
            </View>
        </View>
    );
}
