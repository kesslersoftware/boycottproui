import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {styles} from "./CustomCheckboxStyles";
import {sh, sw} from "../screenDimensionsutilitiy";

type checkboxProps = {
    checked: boolean
    setCheck: () => void
    text?: string
    leftMargin?: number
    topMargin?: number
};
const default_message = "I agree to Terms of Service and Privacy Policy";
export default function CustomCheckbox({
                                           checked,
                                           setCheck,
                                           text = default_message,
                                           leftMargin = 0.102,
                                           topMargin = 0.032
                                       }: checkboxProps) {


    return (
        <Pressable style={styles.container} onPress={setCheck}>
            <View style={[styles.checkbox, checked && styles.checkedBox, { marginLeft : sw * leftMargin},
                { marginTop : sh * topMargin}]} />
            <Text style={[styles.messageTxt, { marginTop: sh * topMargin,}]}>{text}</Text>
        </Pressable>
    )
}
