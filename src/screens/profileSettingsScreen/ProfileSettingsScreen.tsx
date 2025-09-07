import {View, Text, Alert} from "react-native";
import {styles} from "./ProfileSettingsScreenStyles";
import {sharedStyles} from "../../../styles/sharedStyles";
import {sw} from "../../components/screenDimensionsutilitiy"
import HeaderBar from "../../components/headerBar/HeaderBar";
import React, {useEffect, useState} from "react";
import HomeBackButton from "../../components/homeBackButton/HomeBackButton";
import Slogan from "../../components/slogan/Slogan";
import FormTextField from "../../components/labelAndField/FormTextField";
import CenteredButton from "../../components/button/CenteredButton";
import { getUserById } from '../../api/users';
import { changeUsername } from '../../api/users';
import {
    PROFILE_RETURN_BTN_HEIGHT, PROFILE_RETURN_BTN_TOP_MARGIN,
    PROFILE_RETURN_BTN_WIDTH
} from "../../../styles/constants";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";
import { useUser } from '../../context/UserContext';
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { updateUserAttributes } from 'aws-amplify/auth';

type ProfileSettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProfileSettings'>
type ProfileSettingsScreenRouteProp = RouteProp<RootStackParamList, 'ProfileSettings'>

export default function ProfileSettingsScreen() {
    const successColor = '#155724';
    const errorColor = '#ff0000';
    // navigation constants
    const navigation = useNavigation<ProfileSettingsScreenNavigationProp>();
    const route = useRoute<ProfileSettingsScreenRouteProp>();
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [email, setEmail] = useState('');
    const [visibleError, setVisibleError] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState('');
    const [ messageColor, setMessageColor ] = useState(successColor);
    const sleep = (ms: number) =>
        new Promise(resolve => setTimeout(resolve, ms));
    const setStatusMessageAndColor = async (message: string, color: string) => {
        setStatusMessage(message);
        setMessageColor(color);
        await sleep(3000);
        setStatusMessage('');
    }
    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                setLoading(true);
                const userSettings = await getUserById();
                setUsername(userSettings!.username!);
                setNewUserName(userSettings!.username!);
                setEmail(userSettings.email_addr);
                console.log("user settings set");
            } catch (e: any) {
                // api.ts throws parsed JSON or {status, message}
                const status = e?.status ?? e?.statusCode;
                const message =
                    e?.message ||
                    e?.error ||
                    'Something went wrong. Please try again.';
                if (status === 401) {
                    // clear local user if you want
                    await setUser(undefined);          // from your UserContext
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    return;
                } else {
                    setVisibleError(message);
                }
            } finally {
                setLoading(false); // hide spinner
            }
        };
        fetchUserSettings();
        console.log("fetching user settings");
    }, []);
    const alterUsername = async () => {
        try {
            setVisibleError('');
            console.log("changing username");
            setLoading(true); // show spinner
            await updateUserAttributes({ userAttributes: { preferred_username: newUserName } });
            const result = await changeUsername({ user_id : 's',
                oldUsername : username,
                newUsername : newUserName}
            );
            console.log("username changed");
            setUsername(newUserName);
            setNewUserName('');
            setStatusMessageAndColor(successColor, result.message);
        } catch (e: any) {
            // api.ts throws parsed JSON or {status, message}
            const status = e?.status ?? e?.statusCode;
            const message =
                e?.message ||
                e?.error ||
                'Something went wrong. Please try again.';
            if (status === 401) {
                // clear local user if you want
                await setUser(undefined);          // from your UserContext
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                return;
            } else {
                setVisibleError(message);
            }
        } finally {
            setLoading(false); // hide spinner
        }
    };
    return(
        <View style={sharedStyles.containerSettings}>
            <HeaderBar/>
            { loading && <LoadingOverlay />}
            { !loading &&
                <>
                <View style={sharedStyles.homeAndSloganView}>
                    <HomeBackButton label="back" onPress={() => navigation.goBack()} />
                    <Slogan />
                </View>
                {
                    visibleError.length > 0 &&
                    <>
                        <Text style={sharedStyles.errorText}>
                            {visibleError}
                        </Text>
                    </>
                }
                <View style={sharedStyles.titleContainer}>
                    <Text style={sharedStyles.title}>Profile Settings</Text>
                </View>
                <View style={styles.textRow}>
                    <Text style={styles.emailLabel}>email:</Text>
                    <Text style={styles.emailTxt}>{email}</Text>
                </View>
                <CenteredButton
                    text="change email"
                    widthPercent={PROFILE_RETURN_BTN_WIDTH}
                    heightPercent={PROFILE_RETURN_BTN_HEIGHT}
                    marginTopPercent={PROFILE_RETURN_BTN_TOP_MARGIN}
                    onPress={() => console.log('update username pressed')}
                />
                <View style={styles.textRow}>
                    <Text style={styles.passwordLabel}>password:</Text>
                    <Text style={styles.passwordLink} onPress={() =>
                        navigation.navigate('PasswordReset')}>
                        change password
                    </Text>
                </View>
                <FormTextField
                    labelText="username"
                    labelMarginTop={sw * 0.039}
                    value={newUserName}
                    onChangeText={setNewUserName}
                    placeholder=""
                />
                <CenteredButton
                    text="update username"
                    widthPercent={PROFILE_RETURN_BTN_WIDTH}
                    heightPercent={PROFILE_RETURN_BTN_HEIGHT}
                    marginTopPercent={PROFILE_RETURN_BTN_TOP_MARGIN}
                    onPress={alterUsername}
                />
                {statusMessage !== '' && (
                    <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center', backgroundColor: '#D4EDDA', padding: 10, borderRadius: 8 }}>
                        <Text style={{ color: '#155724' }}>{statusMessage}</Text>
                    </View>
                )}
                </>
            }
        </View>
    );
}
