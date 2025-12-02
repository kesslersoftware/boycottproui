import {sharedStyles} from "../../../styles/sharedStyles";
import React from "react";
import {View, Text} from "react-native";
import {LOGO} from "../../../styles/constants";

export default function Slogan() {
    return (
        <View style={sharedStyles.sloganContent}>
            <Text style={sharedStyles.slogan}>{LOGO}</Text>
        </View>
    );
}
