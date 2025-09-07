import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { sharedStyles } from '../../../styles/sharedStyles'
import { sw, sh } from '../screenDimensionsutilitiy'
import { BODY_TEXT_DARK } from '../../../styles/constants'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type FormPasswordFieldProps = {
    labelText: string
    labelMarginTop: number
    value?: string
    onChangeText?: (text: string) => void
    width?: number
    paddingHorizontal?: number
}

export default function FormPasswordField({
                                              labelText,
                                              labelMarginTop,
                                              value,
                                              onChangeText,
                                              width = 1.00,
                                              paddingHorizontal = 0.102
                                          }: FormPasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <View style={[sharedStyles.formLabelAndFieldContainer,
            { marginTop: labelMarginTop},
            { width: sw * width },
            { paddingHorizontal: sw * paddingHorizontal}]}>
            <Text style={sharedStyles.label}>
                {labelText}
            </Text>
            <View style={sharedStyles.passwordFieldWrapper}>
                <TextInput
                    style={sharedStyles.field}
                    secureTextEntry={!showPassword}
                    value={value}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={onChangeText}
                />
                <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={sharedStyles.eyeIcon}
                >
                    <Icon
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={sh * 0.028}
                        color={BODY_TEXT_DARK}
                    />
                </Pressable>
            </View>
        </View>
    )
}
