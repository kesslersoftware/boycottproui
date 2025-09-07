import {View, Text, TextInput, Pressable} from "react-native";
import {styles} from "./PasswordResetScreenStyles";
import HeaderBar from "../../components/headerBar/HeaderBar";
import React, {useState} from "react";
import ErrorSection from "../../components/errorSection/ErrorSection";
import {sharedStyles} from "../../../styles/sharedStyles";
import FormPasswordField from "../../components/labelAndField/FormPasswordField";
import {
    PR_RESET_BTN_WIDTH,
    PR_PASSWORD_TOP_MARGIN,
    PR_REDO_PASSWORD_TOP_MARGIN,
    PR_RESET_BTN_HEIGHT, PR_RESET_BTN_TOP_MARGIN, DELETE_RED
} from "../../../styles/constants";
import CenteredButton from "../../components/button/CenteredButton";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";
import { useUser } from '../../../src/context/UserContext';

type PasswordResetScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PasswordReset'>
type PasswordResetScreenRouteProp = RouteProp<RootStackParamList, 'PasswordReset'>

const handleErrorLink = (target: string) => {
    if (target === 'resendEmail') {
        console.log('Resending email…')
        // trigger resend logic here
    }
}
export default function PasswordResetScreen() {
    // navigation constants
    const back_navigation = 'ProfileSettings';
    const prompt = "settings";
    const navigation = useNavigation<PasswordResetScreenNavigationProp>();
    const route = useRoute<PasswordResetScreenRouteProp>();
    const { user } = useUser();

    const [visibleErrors, setVisibleErrors] = useState<number[]>([]) // 2,3,4,5,0
    const [password, setPassword] = useState('');
    const [redoPassword, setRedoPassword] = useState('');
    const goToResetSuccessScreen = () => {
        navigation.navigate('PasswordResetSuccess',
            { prompt, back_navigation });
    }
    const returnToProfileSettings = () => {
        navigation.goBack();
    }
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
                onPress={goToResetSuccessScreen}
            />
            <CenteredButton
                text="cancel"
                color={DELETE_RED}
                widthPercent={PR_RESET_BTN_WIDTH}
                heightPercent={PR_RESET_BTN_HEIGHT}
                marginTopPercent={PR_RESET_BTN_TOP_MARGIN}
                onPress={returnToProfileSettings}
            />
        </View>
    );
}
