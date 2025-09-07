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
import {RouteProp, useIsFocused, useNavigation, useRoute} from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";
import { getTopCompanies } from '../../api/companies';
import { getTopCauses } from '../../api/causes';
// @ts-ignore
import LoadingOverlay from "../../components/common/LoadingOverlay";
import {useUser} from "../../context/UserContext";

type TopTrendsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TopTrends'>
type TopTrendsScreenRouteProp = RouteProp<RootStackParamList, 'TopTrends'>

export default function TopTrendsScreen() {
    // navigation constants
    const { user , setUser} = useUser();
    const navigation = useNavigation<TopTrendsScreenNavigationProp>();
    const back_navigation = 'TopTrends';
    const route = useRoute<TopTrendsScreenRouteProp>();
    const isFocused = useIsFocused();
    const[companies, setCompanies] = useState<Item[]>([]);
    const[causes, setCauses] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [isToggleOn, setIsToggleOn] = useState(false);
    const [visibleError, setVisibleError] = useState<string>('');
    useEffect(() => {
        fetchTopTrends();
    }, []);
    useEffect(() => {
        if (isFocused) {
            setIsToggleOn(false);
            fetchTopTrends();
        }
    }, [isFocused]);
    const fetchTopTrends = async () => {
        try {
            setLoading(true);
            const topCompanies = await getTopCompanies(10);
            setCompanies((topCompanies));
            const topCauses = await getTopCauses(10);
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
            setLoading(false);
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
                        <View style={sharedStyles.titleContainer}>
                            <Text style={sharedStyles.title}>Top Trends</Text>
                        </View>
                        {
                            visibleError.length > 0 &&
                            <>
                                <Text style={sharedStyles.errorText}>
                                    {visibleError}
                                </Text>
                            </>
                        }
                        <ToggleSection isToggleOn={isToggleOn} setIsToggleOn={setIsToggleOn}
                                       footerText={"Top companies that people are boycotting"}
                                       otherFooterText={"Top causes that people believe in"}/>
                        {
                            !isToggleOn &&
                            <TrendsList
                                items={companies}
                                onSelectCompany={(company_id) =>
                                navigation.navigate('CompanyDetails', { company_id, back_navigation })}
                            />
                        }
                        {
                            isToggleOn &&
                            <TrendsList
                                items={causes}
                                onSelectCause={(cause_id) =>
                                navigation.navigate('CauseDetails', { cause_id, back_navigation })}
                            />
                        }
                    </>
                }
        </View>
    );
}
