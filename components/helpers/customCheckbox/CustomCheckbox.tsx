import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {styles} from "./CustomCheckboxStyles";

export default function CustomCheckbox() {
    const [checked, setChecked] = useState(false)

    return (
        <Pressable style={styles.container} onPress={() => setChecked(!checked)}>
            <View style={[styles.checkbox, checked && styles.checkedBox]} />
            <Text style={styles.termsOfService}>I agree to Terms of Service and Privacy Policy</Text>
        </Pressable>
    )
}
