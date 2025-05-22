import {View, Text, Pressable} from "react-native";
import {styles} from "../homeScreen/HomeScreenStyles";
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import React, { useState } from 'react';
import Slogan from "../../helpers/slogan/Slogan";
import {sharedStyles} from "../../../styles/sharedStyles";
import {sh} from "../../helpers/screenDimensionsutilitiy";
import {BODY_TEXT_DARK} from "../../../styles/constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import {RootStackParamList} from "../../../types/types";
import {User} from "../../../types/DataModels";


type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Search'>

type Props = {
    user: User
}
export default function HomeScreen({ user: User }: Props) {
    // navigation constants
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const [companies, setCompanies] = useState<number>(120)
    const [causes, setCauses] = useState<number>(500)
    const [topCompany, setTopCompany] = useState<string>('McDonalds')
    const [numPeople, setNumPeople] = useState<number>(123456)
    const [topReason, setTopReason] = useState<string>('unfair labor practices')
    const [topCause, setTopCause] = useState<string>('animal rights')
    return(
        <View style={sharedStyles.containerSettings}>
            {/*<Pressable style={styles.leftBtn} onPress={() => navigation.navigate('MyTrends')}>
                <Icon
                    name='arrow-left'
                    size={sh * 0.028}
                    color={BODY_TEXT_DARK}
                />
            </Pressable>
            <Pressable style={styles.rightBtn} onPress={() => navigation.navigate('TopTrends')}>
                <Icon
                    name='arrow-right'
                    size={sh * 0.028}
                    color={BODY_TEXT_DARK}
                />
            </Pressable>*/}
            <View>
                <HeaderBar/>
                <Slogan/>
                <Text style={styles.yourStats}>Your Stats:</Text>
                <Text style={styles.boycotts}>you are boycotting {companies} companies/brands</Text>
                <Text style={styles.numCauses}>you are following {causes} causes</Text>
                <Text style={styles.quickView}>Quick View:</Text>
                <View style={styles.quickViewContent}>
                    <Text style={styles.topCompany}>top company being boycotted: {topCompany}</Text>
                    {/*<Text style={styles.topCompanyName}>{topCompany}</Text>*/}
                    <Text style={styles.numPeople}>number of people boycotting:   {numPeople}</Text>
                    {/*<Text style={styles.peopleNum}>{numPeople}</Text>*/}
                    <Text style={styles.topReason}>top reason people are boycotting {topCompany} :</Text>
                    {/*<Text style={styles.reasonCompany}>{topCompany} :</Text>*/}
                    {/*i can leave off the colon field*/}
                    <Text style={styles.boycottReason}>{topReason}</Text>
                    <Text style={styles.topCauseFollowed}>top cause that people are following:</Text>
                    <Text style={styles.topCause}>{topCause}</Text>
                </View>
                <Pressable style={styles.topTrendsBtn} onPress={() => navigation.navigate('TopTrends')}>
                    <View style={styles.topTrendsContent}>
                        <Text style={styles.topTrendsBtnTxt}>Top Trends</Text>
                    </View>
                </Pressable>
                <Pressable style={styles.myTrendsBtn} onPress={() => navigation.navigate('MyTrends')}>
                    <View style={styles.myTrendsContent}>
                        <Text style={styles.myTrendsBtnTxt}>My Trends</Text>
                    </View>
                </Pressable>
                <Pressable style={styles.profileSettingBtn} onPress={() => navigation.navigate('ProfileSettings')} >
                    <Text style={styles.profileSettingBtnTxt}>Profile Settings</Text>
                </Pressable>
                <Pressable style={styles.searchBtn} onPress={() => navigation.navigate('Search')}>
                    <View style={styles.searchBtnContent}>
                        <Text style={styles.searchBtnTxt}>Search Companies & Causes</Text>
                    </View>
                </Pressable>
                {/*<Pressable style={styles.bottomBtn} onPress={() => navigation.navigate('Search')}>
                    <Icon
                        name='arrow-down'
                        size={sh * 0.028}
                        color={BODY_TEXT_DARK}
                    />
                </Pressable>*/}
            </View>
        </View>
    );
}
