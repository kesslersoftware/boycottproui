import {sharedStyles} from "../../../styles/sharedStyles";
import React from "react";
import {View, Text} from "react-native";

export default function Slogan() {
    return (
        <View style={sharedStyles.sloganContent}>
            <Text style={sharedStyles.slogan}>you're part of something bigger!</Text>
        </View>
    );
}
