import {View, Text} from "react-native";
import {styles} from "../profileSettingsScreen/ProfileSettingsScreenStyles";
import {sharedStyles} from "../../../styles/sharedStyles";
import {topInset,bottomInset,sw,sh} from "../../helpers/screenDimensionsutilitiy"
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import React, {useState} from "react";
import HomeBackButton from "../../helpers/homeBackButton/HomeBackButton";
import Slogan from "../../helpers/slogan/Slogan";
import FormTextField from "../../helpers/labelAndField/FormTextField";
import CenteredButton from "../../helpers/button/CenteredButton";
import {
    PROFILE_RETURN_BTN_HEIGHT, PROFILE_RETURN_BTN_TOP_MARGIN,
    PROFILE_RETURN_BTN_WIDTH,
    RESET_RETURN_BTN_HEIGHT,
    RESET_RETURN_BTN_TOP_MARGIN,
    RESET_RETURN_BTN_WIDTH
} from "../../../styles/constants";

export default function ProfileSettingsScreen() {
    const [username, setUsername] = useState('')
    return(
        <View style={sharedStyles.containerSettings}>
            <View>
                <HeaderBar/>
                <View style={sharedStyles.homeAndSloganView}>
                    <HomeBackButton label="back" onPress={() => console.log('Go back')} />
                    <Slogan />
                </View>
                <View style={sharedStyles.titleContainer}>
                    <Text style={sharedStyles.title}>Profile Settings</Text>
                </View>
                <View style={styles.textRow}>
                    <Text style={styles.emailLabel}>email:</Text>
                    <Text style={styles.emailTxt}>dylan@example.com</Text>
                </View>
                <View style={styles.textRow}>
                    <Text style={styles.passwordLabel}>password:</Text>
                    <Text style={styles.passwordLink} onPress={() => console.log('Change Password')}>
                        change password
                    </Text>
                </View>

                <FormTextField
                    labelText="username"
                    labelMarginTop={sw * 0.039}
                    value=""
                    onChangeText={setUsername}
                    placeholder=""
                />
                <CenteredButton
                    text="update username"
                    widthPercent={PROFILE_RETURN_BTN_WIDTH}
                    heightPercent={PROFILE_RETURN_BTN_HEIGHT}
                    marginTopPercent={PROFILE_RETURN_BTN_TOP_MARGIN}
                    onPress={() => console.log('update username pressed')}
                />

            </View>
        </View>
    );
}
