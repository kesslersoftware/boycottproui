import {View, Text, Pressable} from "react-native";
import {styles} from "../myTrendsScreen/MyTrendsScreenStyles";
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import React from "react";
import Slogan from "../../helpers/slogan/Slogan";
import HomeBackButton from "../../helpers/homeBackButton/HomeBackButton";
import { Switch } from 'react-native'
import { useState } from 'react'
import {
    BODY_TEXT_DARK,
    BRIGHT_BLUE,
    DARK_GREY,
    GREY,
    MY_TR_ARRW_BTN_WIDTH,
    OFF_WHITE,
    WHITE
} from "../../../styles/constants";
import TrendsList from '../../helpers/companiesOrCauses/TrendsList'
import {sharedStyles} from "../../../styles/sharedStyles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ToggleSection from "../../helpers/toggle/ToggleSection";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../../types/types";
import {User} from "../../../types/DataModels";

type MyTrendsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MyTrends'>
type MyTrendsScreenRouteProp = RouteProp<RootStackParamList, 'MyTrends'>

type Props = {
    user: User
}

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
export default function MyTrendsScreen({ user: User }: Props) {
    // navigation constants
    const navigation = useNavigation<MyTrendsScreenNavigationProp>();

    const [isToggleOn, setIsToggleOn] = useState(false)
    return(
        <View style={sharedStyles.containerSettings}>
            {/*<Pressable style={styles.rightBtn}>
                <Icon
                    name='arrow-right'
                    size={MY_TR_ARRW_BTN_WIDTH}
                    color={BODY_TEXT_DARK}
                />
            </Pressable>*/}
            <View>
                <HeaderBar/>
                <View style={sharedStyles.homeAndSloganView}>
                    <HomeBackButton label="Home" onPress={() => navigation.navigate('Home')} />
                    <Slogan />
                </View>
                <View style={sharedStyles.titleContainer}>
                    <Text style={sharedStyles.title}>My Companies & Causes</Text>
                </View>
                <ToggleSection isToggleOn={isToggleOn} setIsToggleOn={setIsToggleOn}
                               footerText={"Companies that I am boycotting"}
                               otherFooterText={"Causes that I believe in"}/>
                {!isToggleOn && <TrendsList items={companies} onDelete={handleDelete} />}
                {isToggleOn && <TrendsList items={causes} onDelete={handleDelete} />}
            </View>
        </View>
    );
}
