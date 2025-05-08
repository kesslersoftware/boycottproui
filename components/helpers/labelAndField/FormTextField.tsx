import React from 'react'
import { View, Text, TextInput } from 'react-native'
import { sharedStyles } from '../../../styles/sharedStyles'
import {PLACE_HOLDER} from "../../../styles/constants";

type Props = {
    labelText: string
    labelMarginTop: number
    value?: string
    onChangeText?: (text: string) => void
    placeholder?: string
    hideLabel?: boolean
}

export default function FormTextField({
                                          labelText,
                                          labelMarginTop,
                                          value,
                                          onChangeText,
                                          placeholder,
                                          hideLabel = false
                                      }: Props) {
    return (
            <View style={[sharedStyles.formLabelAndFieldContainer,{ marginTop: labelMarginTop}]}>
                {
                    !hideLabel &&
                    <Text style={sharedStyles.label}>
                        {labelText}
                    </Text>
                }
                <TextInput
                    style={sharedStyles.field}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor = {PLACE_HOLDER}
                />
        </View>
    );
}

