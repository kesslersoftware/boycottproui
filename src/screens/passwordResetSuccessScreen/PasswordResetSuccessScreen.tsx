import {View, Text, Pressable} from "react-native";
import {styles} from "./PasswordResetSuccessScreenStyles";
import HeaderBar from "../../components/headerBar/HeaderBar";
import React, {useState} from "react";
import {sharedStyles} from "../../../styles/sharedStyles";
import {
    PRS_RETURN_BTN_HEIGHT, PRS_RETURN_BTN_TOP_MARGIN,
    PRS_RETURN_BTN_WIDTH,
    RESET_RETURN_BTN_HEIGHT,
    RESET_RETURN_BTN_TOP_MARGIN,
    RESET_RETURN_BTN_WIDTH
} from "../../../styles/constants";
import CenteredButton from "../../components/button/CenteredButton";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";
import { useUser } from '../../../src/context/UserContext';

type PasswordResetSuccessScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PasswordResetSuccess'>
type PasswordResetSuccessScreenRouteProp = RouteProp<RootStackParamList, 'PasswordResetSuccess'>

export default function PasswordResetSuccessScreen() {
    // navigation constants
    const navigation = useNavigation<PasswordResetSuccessScreenNavigationProp>();
    const route = useRoute<PasswordResetSuccessScreenRouteProp>();
    const { user } = useUser();
    const { prompt, back_navigation } = route.params;
    const returnToPrevious = () => {
        navigation.goBack();
    };
    return(
        <View style={sharedStyles.containerSettings}>
            <HeaderBar/>
            <View style={styles.passwordRestContent}>
                <Text style={styles.checkbox}>✅</Text>
                <Text style={styles.resetSuccess}>password has been reset successfully</Text>
                <CenteredButton
                    text={`return to ${prompt}`}
                    widthPercent={PRS_RETURN_BTN_WIDTH}
                    heightPercent={PRS_RETURN_BTN_HEIGHT}
                    marginTopPercent={PRS_RETURN_BTN_TOP_MARGIN}
                    onPress={returnToPrevious}
                />

            </View>
        </View>
    );
}
