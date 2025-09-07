import {View, Text, Pressable} from "react-native";
import {styles} from "./ResetlLinkExpiredScreenStyles";
import HeaderBar from "../../components/headerBar/HeaderBar";
import React from "react";
import {sharedStyles} from "../../../styles/sharedStyles";
import {
    RLE_RESEND_BTN_HEIGHT, RLE_RESEND_BTN_TOP_MARGIN,
    RLE_RESEND_BTN_WIDTH
} from "../../../styles/constants";
import CenteredButton from "../../components/button/CenteredButton";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";

type ResetLinkExpiredScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetLinkExpired'>
type ResetLinkExpiredScreenRouteProp = RouteProp<RootStackParamList, 'ResetLinkExpired'>

export default function ResetLinkExpiredScreen() {
    // navigation constants
    const navigation = useNavigation<ResetLinkExpiredScreenNavigationProp>();
    const route = useRoute<ResetLinkExpiredScreenRouteProp>();
    const { user } = useUser();

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
