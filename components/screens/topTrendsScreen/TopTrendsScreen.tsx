import {View, Text, Pressable} from "react-native";
import {styles} from "../topTrendsScreen/TopTrendsScreenStyles";
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import React from "react";
import Slogan from "../../helpers/slogan/Slogan";
import HomeBackButton from "../../helpers/homeBackButton/HomeBackButton";
import { Switch } from 'react-native'
import { useState } from 'react'
import {BODY_TEXT_DARK, BRIGHT_BLUE, GREY, OFF_WHITE, TOP_TR_ARRW_BTN_WIDTH, WHITE} from "../../../styles/constants";
import CompaniesOrCausesList from '../../helpers/companiesOrCauses/CompaniesOrCausesList'
import {sharedStyles} from "../../../styles/sharedStyles";
import { sw, sh } from '../../helpers/screenDimensionsutilitiy'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ToggleSection from "../../helpers/toggle/ToggleSection";

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
    const [isToggleOn, setIsToggleOn] = useState(false)
    return(
        <View style={sharedStyles.containerSettings}>
            <Pressable style={styles.leftBtn}>
                <Icon
                    name='arrow-left'
                    size={TOP_TR_ARRW_BTN_WIDTH}
                    color={BODY_TEXT_DARK}
                />
                {/*<Text style={styles.leftBtnArrow}>{'<'}</Text>*/}
            </Pressable>
            <View>
                <HeaderBar/>
                <View style={sharedStyles.homeAndSloganView}>
                    <HomeBackButton label="back" onPress={() => console.log('Go back')} />
                    <Slogan />
                </View>
                <View style={sharedStyles.titleContainer}>
                    <Text style={sharedStyles.title}>Top Trends</Text>
                </View>
                <ToggleSection isToggleOn={isToggleOn} setIsToggleOn={setIsToggleOn}
                               footerText={"Top companies that people boycotting"}
                               otherFooterText={"Top causes that people believe in"}/>
                {!isToggleOn && <CompaniesOrCausesList items={companies} onDelete={handleDelete} />}
                {isToggleOn && <CompaniesOrCausesList items={causes} onDelete={handleDelete} />}
            </View>
        </View>
    );
}
