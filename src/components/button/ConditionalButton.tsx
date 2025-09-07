import React from 'react'
import { Pressable, Text } from 'react-native'
import { sw, sh } from '../screenDimensionsutilitiy'
import {sharedStyles} from "../../../styles/sharedStyles";
import {BRIGHT_BLUE} from "../../../styles/constants";

interface CenteredButtonProps {
    text: string
    color?: string
    widthPercent: number
    heightPercent: number
    marginTopPercent: number
    onPress: () => void
    hasItems: boolean
}

export default function ConditionalButton({
                                           text,
                                           color = BRIGHT_BLUE,
                                           widthPercent,
                                           heightPercent,
                                           marginTopPercent,
                                           onPress,
                                           hasItems = false
                                       }: CenteredButtonProps) {
    return (
        <Pressable
            style={[
                sharedStyles.centeredButton,
                {
                    width: sw * widthPercent},{
                    height: sh * heightPercent},{
                    marginTop: sh * marginTopPercent},{
                    backgroundColor: color
                }
            ]}
            disabled={!hasItems}
            onPress={onPress}
        >
            <Text style={sharedStyles.centeredButtonText}>{text}</Text>
        </Pressable>
    )
}

