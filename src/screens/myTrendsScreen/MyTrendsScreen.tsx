import {View, Text, Pressable} from "react-native";
import HeaderBar from "../../components/headerBar/HeaderBar";
import React, {useEffect} from "react";
import Slogan from "../../components/slogan/Slogan";
import HomeBackButton from "../../components/homeBackButton/HomeBackButton";
import { useState } from 'react'
import TrendsList, {Item} from '../../components/companiesOrCauses/TrendsList'
import {sharedStyles} from "../../../styles/sharedStyles";
import ToggleSection from "../../components/toggle/ToggleSection";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";
import { useUser } from '../../../src/context/UserContext';

// @ts-ignore
import {deleteUserBoycott, deleteUserCause, getUserBoycotts} from '../../api/users';
import { getUserCauses } from '../../api/users';
import LoadingOverlay from "../../components/common/LoadingOverlay";
import {BoycottData, LocalBoycottStore} from "../../services/LocalBoycottStore";
import { postAnonymousStat } from "../../services/AnonymousStatsService";
import {ResponseMessage} from "../../types/misc";
import {sleep} from "../../utils/navigationHelpers";
import { useIsFocused } from '@react-navigation/native';

type MyTrendsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MyTrends'>
type MyTrendsScreenRouteProp = RouteProp<RootStackParamList, 'MyTrends'>

type Props = {
    route: MyTrendsScreenRouteProp;
};

export default function MyTrendsScreen() {

    const { user , setUser} = useUser();
    const successColor = '#155724';
    const errorColor = '#ff0000';
    // navigation constants
    const navigation = useNavigation<MyTrendsScreenNavigationProp>();
    const isFocused = useIsFocused();
    const back_navigation = 'MyTrends';
    const[companies, setCompanies] = useState<Item[]>([]);
    const[causes, setCauses] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [isToggleOn, setIsToggleOn] = useState(false);
    const [visibleError, setVisibleError] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState('');
    const [ messageColor, setMessageColor ] = useState(successColor);
    useEffect(() => {
        fetchMyTrends();
    }, []);
    useEffect(() => {
        if (isFocused) {
            setIsToggleOn(false);
            fetchMyTrends();
        }
    }, [isFocused]);
    const fetchMyTrends = async () => {
        setLoading(true);
        setVisibleError('');
        if(user!.paying_user) {
          try {
              const topCompanies = await getUserBoycotts();
              const topCauses = await getUserCauses();
              setCompanies(topCompanies);
              setCauses(topCauses);
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
                  navigation.reset({index: 0, routes: [{name: 'Login'}]});
                  return;
              } else {
                  setVisibleError(message);
              }
          } finally {
              setLoading(false); // hide spinner
          }
        } else {
              try {
                  const data = await LocalBoycottStore.load();
                  // you hav to filter both of these into sets
                  const topCompanies = data.user_boycotts;
                  const topCauses = data.user_causes;
                  setCompanies(topCompanies);
                  setCauses(topCauses);
              } catch (e: any) {
                  // local storage failure: never log out; show persistent error
                  const msg = e?.message || 'Could not load your boycotts. Please try again.';
                  setVisibleError(msg);
              } finally {
                  setLoading(false); // hide spinner
              }
        }
    };
    const deleteCompany = async (id: string) => {
        let message: ResponseMessage = {
            status: 200,
            message: '',
            devMsg: ''
        };
        setLoading(true); // show spinner
        if(user!.paying_user) {
            try {
                message = await deleteUserBoycott(id);
                fetchMyTrends();
                await setStatusMessageAndColor(message.message, successColor);
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
                    navigation.reset({index: 0, routes: [{name: 'Login'}]});
                    return;
                } else {
                    setVisibleError(message);
                }
            } finally {
                setLoading(false);
            }
        } else {
            try {
                // logic to delete from local storage and retrieve a list of causeIds
                const data: BoycottData = await LocalBoycottStore.load();
                const boycottsForThisCompany = data.user_boycotts.filter(rec =>
                    rec.company_id === id);
                data.user_boycotts = data.user_boycotts.filter(rec =>
                    rec.company_id != id);
                await LocalBoycottStore.save(data);
                await postAnonymousStat("company", {
                    company_id: id,
                    increment: false
                });
                for (let boycott of boycottsForThisCompany) {
                    const cause_id = boycott.cause_id;
                    const cause_desc = boycott.cause_desc;
                    const company_name = boycott.company_name;
                    await postAnonymousStat("cause_company", {
                        cause_id: cause_id,
                        company_id: id,
                        cause_desc: cause_desc,
                        company_name: company_name,
                        increment: false
                    });
                }
                fetchMyTrends();
                await setStatusMessageAndColor(message.message, successColor);
            } catch (e: any) {
                // local storage failure: never log out; show persistent error
                const msg = e?.message || 'Could not load your boycotts. Please try again.';
                setVisibleError(msg);
            } finally {
                setLoading(false);
            }
        }
    }
    const setStatusMessageAndColor = async (message: string, color: string) => {
        setStatusMessage(message);
        setMessageColor(color);
        await sleep(3000);
        setStatusMessage('');
    }
    const deleteCause = async (id: string) => {
        let message: ResponseMessage = {
            status: 200,
            message: '',
            devMsg: ''
        };

        setLoading(true);
        if(user!.paying_user) {
            try {
                message = await deleteUserCause(id);
                fetchMyTrends();
                await setStatusMessageAndColor(message.message, successColor);
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
                    navigation.reset({index: 0, routes: [{name: 'Login'}]});
                    return;
                } else {
                    setVisibleError(message);
                }
            } finally {
                setLoading(false);
            }
        } else {
            try {
                const data: BoycottData = await LocalBoycottStore.load();
                data.user_causes = data.user_causes.filter(rec => rec.cause_id != id);
                await LocalBoycottStore.save(data);
                await postAnonymousStat("cause", {
                    cause_id: id,
                    increment: false
                });
                fetchMyTrends();
                await setStatusMessageAndColor(message.message, successColor);
            } catch (e: any) {
                // local storage failure: never log out; show persistent error
                const msg = e?.message || 'Could not load your boycotts. Please try again.';
                setVisibleError(msg);
            } finally {
                setLoading(false);
            }
        }
    }
    return(
        <View style={sharedStyles.containerSettings}>

                <HeaderBar/>
                { loading && <LoadingOverlay />}
                { !loading &&
                    <>
                    <View style={sharedStyles.homeAndSloganView}>
                        <HomeBackButton label="Home" onPress={() => navigation.goBack()} />
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
                        <Text style={sharedStyles.title}>My Companies & Causes</Text>
                    </View>
                    <ToggleSection isToggleOn={isToggleOn} setIsToggleOn={setIsToggleOn}
                                   footerText={"Companies that I am boycotting"}
                                   otherFooterText={"Causes that I believe in"}/>
                    {
                        !isToggleOn &&
                        <TrendsList items={companies}
                            onSelectCompany={(company_id) =>
                            navigation.navigate('CompanyDetails', { company_id, back_navigation })}
                            onDeleteCompany={deleteCompany}
                            showDelete={true}/>
                    }
                    {
                        isToggleOn &&
                        <TrendsList items={causes}
                            onSelectCause={(cause_id) =>
                            navigation.navigate('CauseDetails', { cause_id, back_navigation })}
                            onDeleteCause={deleteCause}
                            showDelete={true}/>
                    }
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
