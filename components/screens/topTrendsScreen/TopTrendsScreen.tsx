import {View, Text, Pressable} from "react-native";
import {styles} from "../topTrendsScreen/TopTrendsScreenStyles";
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import React from "react";
import Slogan from "../../helpers/slogan/Slogan";
import HomeBackButton from "../../helpers/homeBackButton/HomeBackButton";
import { Switch } from 'react-native'
import { useState } from 'react'
import {BODY_TEXT_DARK, BRIGHT_BLUE, GREY, OFF_WHITE, TOP_TR_ARRW_BTN_WIDTH, WHITE} from "../../../styles/constants";
import TrendsList from '../../helpers/companiesOrCauses/TrendsList'
import {sharedStyles} from "../../../styles/sharedStyles";
import { sw, sh } from '../../helpers/screenDimensionsutilitiy'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ToggleSection from "../../helpers/toggle/ToggleSection";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../../types/types";

type TopTrendsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TopTrends'>
type TopTrendsScreenRouteProp = RouteProp<RootStackParamList, 'TopTrends'>

const companies = [
    { name: 'Company A', rank: 1 },
    { name: 'Company B', rank: 2 },
    { name: 'Company C', rank: 3 },
]
const causes = [
    { name: 'Animal rights' },
    { name: 'Unfair labor practices'},
    { name: 'Environment' }
]

function handleDelete(name: string) {
    console.log('Delete', name)
}

export default function TopTrendsScreen() {
    // navigation constants
    const navigation = useNavigation<TopTrendsScreenNavigationProp>();
    const route = useRoute<TopTrendsScreenRouteProp>();
    const user = route.params.user;

    const [isToggleOn, setIsToggleOn] = useState(false)
    return(
        <View style={sharedStyles.containerSettings}>
            {/*<Pressable style={styles.leftBtn}>
                <Icon
                    name='arrow-left'
                    size={TOP_TR_ARRW_BTN_WIDTH}
                    color={BODY_TEXT_DARK}
                />
                <Text style={styles.leftBtnArrow}>{'<'}</Text>
            </Pressable>*/}
            <View>
                <HeaderBar/>
                <View style={sharedStyles.homeAndSloganView}>
                    <HomeBackButton label="back" onPress={() => navigation.navigate('Home')} />
                    <Slogan />
                </View>
                <View style={sharedStyles.titleContainer}>
                    <Text style={sharedStyles.title}>Top Trends</Text>
                </View>
                <ToggleSection isToggleOn={isToggleOn} setIsToggleOn={setIsToggleOn}
                               footerText={"Top companies that people boycotting"}
                               otherFooterText={"Top causes that people believe in"}/>
                {!isToggleOn && <TrendsList items={companies} onDelete={handleDelete} />}
                {isToggleOn && <TrendsList items={causes} onDelete={handleDelete} />}
            </View>
        </View>
    );
}
