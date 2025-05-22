import {View, Text} from "react-native";
import {styles} from "./RegistrationEmailSentStyles";
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import React from "react";
import {sharedStyles} from "../../../styles/sharedStyles";
import {
    RES_REGISTER_BTN_HEIGHT,
    RES_REGISTER_BTN_TOP_MARGIN,
    RES_REGISTER_BTN_WIDTH
} from "../../../styles/constants";
import CenteredButton from "../../helpers/button/CenteredButton";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../../types/types";

type RegistrationEmailSentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RegistrationEmail'>
type RegistrationEmailSentScreenRouteProp = RouteProp<RootStackParamList, 'RegistrationEmail'>

export default function RegistrationEmailSentScreen() {
    // navigation constants
    const navigation = useNavigation<RegistrationEmailSentScreenNavigationProp>();
    const route = useRoute<RegistrationEmailSentScreenRouteProp>();
    const user = route.params.user;

    return(
        <View style={sharedStyles.containerSettings}>
            <HeaderBar/>
            <Text style={styles.verifyEmail}>Verify your email</Text>
            <Text style={styles.verificationLink}>We've sent a verification link to your email address. </Text>
            <Text style={styles.checkInbox}> Please check your inbox (and spam folder)!</Text>
            <CenteredButton
                text="resend email"
                widthPercent={RES_REGISTER_BTN_WIDTH}
                heightPercent={RES_REGISTER_BTN_HEIGHT}
                marginTopPercent={RES_REGISTER_BTN_TOP_MARGIN}
                onPress={() => console.log('Register pressed')}
            />
        </View>
    );
}
