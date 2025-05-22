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
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../../types/types";

type PasswordResetSuccessScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PasswordResetSuccess'>
type PasswordResetSuccessScreenRouteProp = RouteProp<RootStackParamList, 'PasswordResetSuccess'>

export default function PasswordResetSuccessScreen() {
    // navigation constants
    const navigation = useNavigation<PasswordResetSuccessScreenNavigationProp>();
    const route = useRoute<PasswordResetSuccessScreenRouteProp>();
    const user = route.params.user;

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
                            onPress={() => navigation.navigate('Login')}
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
                            onPress={() => navigation.navigate('Home')}
                        />
                    )
                }
            </View>
        </View>
    );
}
