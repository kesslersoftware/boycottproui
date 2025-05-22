import React from 'react'
import { View, Text, TextInput } from 'react-native'
import { sharedStyles } from '../../../styles/sharedStyles'
import {PLACE_HOLDER} from "../../../styles/constants";
import {sw} from "../screenDimensionsutilitiy";

type Props = {
    labelText: string
    labelMarginTop: number
    value?: string
    onChangeText?: (text: string) => void
    placeholder?: string
    hideLabel?: boolean
    width?: number
    paddingHorizontal?: number
}

export default function FormTextField({
                                          labelText,
                                          labelMarginTop,
                                          value,
                                          onChangeText,
                                          placeholder,
                                          hideLabel = false,
                                          width = 1.00,
                                          paddingHorizontal = 0.102
                                      }: Props) {
    return (
            <View style={[sharedStyles.formLabelAndFieldContainer,
                { marginTop: labelMarginTop},
                { width: sw * width },
                { paddingHorizontal: sw * paddingHorizontal}]}>
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

