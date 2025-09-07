import {View, Text, Pressable} from "react-native";
import {styles} from "./ResetEmailSentScreenStyles";
import HeaderBar from "../../components/headerBar/HeaderBar";
import React from "react";
import {sharedStyles} from "../../../styles/sharedStyles";
import {
    RESET_RETURN_BTN_HEIGHT, RESET_RETURN_BTN_TOP_MARGIN,
    RESET_RETURN_BTN_WIDTH
} from "../../../styles/constants";
import CenteredButton from "../../components/button/CenteredButton";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";

type ResetEmailSentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetEmailSent'>
type ResetEmailSentScreenRouteProp = RouteProp<RootStackParamList, 'ResetEmailSent'>

export default function ResetEmailSentScreen() {
    // navigation constants
    const navigation = useNavigation<ResetEmailSentScreenNavigationProp>();
    const route = useRoute<ResetEmailSentScreenRouteProp>();
    const { user } = useUser();

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
                    onPress={() => navigation.navigate('Login')}
                />
            </View>
        </View>
    );
}
