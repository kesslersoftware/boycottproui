import {View, Text} from "react-native";
import {styles} from "../../screens/registrationScreen/RegistrationScreenStyles";
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import CustomCheckbox from "../../helpers/customCheckbox/CustomCheckbox"
import React, { useState } from 'react'
import ErrorSection from "../../helpers/errorSection/ErrorSection";
import {sharedStyles} from "../../../styles/sharedStyles";
import {
    RG_EMAIL_TOP_MARGIN,
    RG_PASSWORD_TOP_MARGIN,
    RG_REDO_EMAIL_TOP_MARGIN,
    RG_REDO_PASSWORD_TOP_MARGIN, RG_REGISTER_BTN_HEIGHT, RG_REGISTER_BTN_TOP_MARGIN,
    RG_REGISTER_BTN_WIDTH,
    RG_USERNAME_TOP_MARGIN,
    SUCCESS_GREEN
} from "../../../styles/constants";
import CenteredButton from "../../helpers/button/CenteredButton";
import FormTextField from "../../helpers/labelAndField/FormTextField";
import FormPasswordField from "../../helpers/labelAndField/FormPasswordField";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../../types/types";

type RegistrationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Registration'>
type RegistrationScreenRouteProp = RouteProp<RootStackParamList, 'Registration'>

export default function RegistrationScreen() {
    // navigation constants
    const navigation = useNavigation<RegistrationScreenNavigationProp>();
    const route = useRoute<RegistrationScreenRouteProp>();
    const user = route.params.user;

    const [visibleErrors, setVisibleErrors] = useState<number[]>([7, 8, 9]); // 7,8,9
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [redoEmail, setRedoEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redoPassword, setRedoPassword] = useState('');
    const [checked, setChecked] = useState(false);
    return(
        <View style={sharedStyles.containerSettings}>
          <HeaderBar/>
          <Text style={styles.createAccount}>Create your account</Text>
          <ErrorSection
                errorIndexes={visibleErrors}
                onLinkPress={() => {}}
          />
          <FormTextField
              labelText="username(optional)"
              labelMarginTop={RG_USERNAME_TOP_MARGIN}
              value=""
              onChangeText={setUsername}
              placeholder=""
          />
        <FormTextField
            labelText="email"
            labelMarginTop={RG_EMAIL_TOP_MARGIN}
            value=""
            onChangeText={setEmail}
            placeholder=""
        />
        <FormTextField
            labelText="repeat email"
            labelMarginTop={RG_REDO_EMAIL_TOP_MARGIN}
            value=""
            onChangeText={setRedoEmail}
            placeholder=""
        />
        <FormPasswordField
            labelText="password"
            labelMarginTop={RG_PASSWORD_TOP_MARGIN}
            value=""
            onChangeText={setPassword}
        />
        <FormPasswordField
            labelText="repeat password"
            labelMarginTop={RG_REDO_PASSWORD_TOP_MARGIN}
            value=""
            onChangeText={setRedoPassword}
        />
          <CustomCheckbox
              checked = {checked}
              setChecked = {() => setChecked(!checked)}
          />
          <CenteredButton
             text="Register"
             color = {SUCCESS_GREEN}
             widthPercent={RG_REGISTER_BTN_WIDTH}
             heightPercent={RG_REGISTER_BTN_HEIGHT}
             marginTopPercent={RG_REGISTER_BTN_TOP_MARGIN}
             onPress={() => navigation.navigate('RegistrationEmail')}
          />
      </View>
    );
}
