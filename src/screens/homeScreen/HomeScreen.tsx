import {View, Text, Pressable} from "react-native";
import {styles} from "./HomeScreenStyles";
import HeaderBar from "../../components/headerBar/HeaderBar";
import React, {useEffect, useState} from 'react';
import Slogan from "../../components/slogan/Slogan";
import {sharedStyles} from "../../../styles/sharedStyles";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";
import {getUserStats, upgradeUser, getUserById} from '../../api/users';
import { useUser } from '../../context/UserContext';
import HomeBackButton from "../../components/homeBackButton/HomeBackButton";
import LoadingOverlay from '../../components/common/LoadingOverlay';
import {LocalBoycottStore} from "../../services/LocalBoycottStore";
import {ResponseMessage} from "../../types/misc";
import {UpgradeUserForm} from "../../types/users/UpgradeUserForm";
import {signOut} from "aws-amplify/auth";
import {BTN_TEXT_LOGOUT, HOME_YOUR_STATS_HEADER, HOME_QUICK_VIEW_HEADER, HOME_SEE_MY_STATS_BTN, HOME_TOP_TRENDS_BTN} from "../../../styles/constants";
import StatsSection from "../../components/statsSection/StatsSection";
import Constants from 'expo-constants';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Search'>

export default function HomeScreen() {
    // navigation constants
    const successColor = '#155724';
    const errorColor = '#ff0000';
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { user, setUser } = useUser();
    const [visibleError, setVisibleError] = useState<string>('');
    const [companies, setCompanies] = useState<number>(0);
    const [causes, setCauses] = useState<number>(0);
    const [topCompany, setTopCompany] = useState<string>('');
    const [numPeople, setNumPeople] = useState<number>(0);
    const [topReason, setTopReason] = useState<string>('');
    const [topCause, setTopCause] = useState<string>('');
    const [loading, setLoading] = useState(false);
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
        LocalBoycottStore.checkAndRefreshIfNeeded();
    }, []);
    useEffect(() => {
        if (!user?.user_id) {
            // navigation.navigate('Login');
        }
    }, [user]);
    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.user_id) return;
            setLoading(true);
            if (user!.paying_user) {
                try {
                    const stats = await getUserStats();
                    console.log("stats are: " + stats);
                    setCompanies(stats.totalBoycotts || 0);
                    setCauses(stats.numCausesFollowed || 0);
                    setTopCompany(stats.worstCompanyName || 'None at the moment');
                    setNumPeople(stats.worstCount || 0);
                    setTopReason(stats.topReason || 'not applicable');
                    setTopCause(stats.causeName || 'None at the moment');
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
            } else {
                try {
                    // need to add functionality
                } catch (e: any) {
                    // local storage failure: never log out; show persistent error
                    const msg = 'Could not load your personal stats. Please try again.';
                    setVisibleError(msg);
                } finally {
                    setLoading(false); // hide spinner
                }
            }
        };
        fetchStats();
    }, [user?.user_id]);
    const resetLocalData = async () => {
        if(!user?.paying_user) {
            await LocalBoycottStore.clear();
        } else {
            console.log("PAYING USER!");
        }
    }
    const upgradeToPaidUser = async () => {
        let message: ResponseMessage = {
            status: 200,
            message: '',
            devMsg: ''
        };
        try {
            setLoading(true);
            const data = await LocalBoycottStore.load();
            const form: UpgradeUserForm = {
              user_boycotts: data.user_boycotts,
              user_causes:   data.user_causes
            };
            message = await upgradeUser(form);
            if (message.status==200) {
                const updatedUser = await getUserById();
                setUser(updatedUser);
                await LocalBoycottStore.clear();
            }
            await setStatusMessageAndColor(message.message, messageColor);
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
            setLoading(false);
        }
    }
    const handleLogout = async () => {
        await signOut({ global: true });
        setUser(undefined);
        //navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
    const navigateTo = (name: string) => {
        const nameWithQuotes: string = "'" + name + "'";
        navigation.navigate("'" + name + "'");
    }
    return(
        <View style={sharedStyles.containerSettings}>
            <HeaderBar/>
            {loading && <LoadingOverlay />}
            { !loading &&
                <>
                    <View style={sharedStyles.homeAndSloganView}>
                        <HomeBackButton label={BTN_TEXT_LOGOUT} onPress={handleLogout} />
                        <Slogan/>
                    </View>
                    {
                        visibleError.length > 0 &&
                        <>
                            <Text style={sharedStyles.errorText}>
                                {visibleError}
                            </Text>
                        </>
                    }
                    <View style={styles.sectionsContainer}>
                        <StatsSection
                            header={HOME_YOUR_STATS_HEADER}
                            buttonText={HOME_SEE_MY_STATS_BTN}
                            onButtonPress={() => navigation.navigate('MyTrends')}
                        >
                            <Text style={styles.statsText}>you are boycotting {companies ? companies.toLocaleString() : '0'} companies/brands</Text>
                            <Text style={styles.statsText}>you are following {causes ? causes.toLocaleString() : '0'} causes</Text>
                        </StatsSection>

                        <StatsSection
                            header={HOME_QUICK_VIEW_HEADER}
                            buttonText={HOME_TOP_TRENDS_BTN}
                            onButtonPress={() => navigation.navigate('TopTrends')}
                        >
                            <Text style={styles.statsText}>top company being boycotted: {topCompany}</Text>
                            <Text style={styles.statsText}>number of people boycotting {topCompany}: {numPeople ? numPeople.toLocaleString() : '0'}</Text>
                            <Text style={styles.statsText}>top reason people are boycotting {topCompany}: {topReason}</Text>
                            <Text style={styles.statsText}>top cause that people are following: {topCause}</Text>
                        </StatsSection>
                    </View>

                    <View style={styles.buttonsContent}>
                        {
                            !user?.paying_user &&
                            <Pressable style={styles.upgradeBtn} onPress={upgradeToPaidUser}>
                                <Text style={styles.topTrendsBtnTxt}>upgrade user</Text>
                            </Pressable>
                        }
                        <Pressable style={styles.profileSettingBtn} onPress={() =>
                            navigation.navigate('ProfileSettings')} >
                            <Text style={styles.profileSettingBtnTxt}>Profile Settings</Text>
                        </Pressable>
                        <Pressable style={styles.profileSettingBtn} onPress={() => navigation.navigate('Search')}>
                            <Text style={styles.profileSettingBtnTxt}>Search Companies & Causes</Text>
                        </Pressable>
                        {
                            Constants.expoConfig?.extra?.APP_ENV !== 'prod' &&
                            <Pressable style={styles.profileSettingBtn} onPress={resetLocalData}>
                                <Text style={styles.profileSettingBtnTxt}>reset</Text>
                            </Pressable>
                        }
                    </View>
                </>
            }
            {
                statusMessage !== '' &&
                <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center',
                    backgroundColor: '#D4EDDA', padding: 10, borderRadius: 8 }}>
                    <Text style={{ color: { messageColor } }}>{statusMessage}</Text>
                </View>
            }
        </View>
    );
}
