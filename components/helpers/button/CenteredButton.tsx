import React from 'react'
import { Pressable, Text } from 'react-native'
import { sw, sh } from '../../helpers/screenDimensionsutilitiy'
import {sharedStyles} from "../../../styles/sharedStyles";
import {BRIGHT_BLUE} from "../../../styles/constants";

interface CenteredButtonProps {
    text: string
    color?: string
    widthPercent: number
    heightPercent: number
    marginTopPercent: number
    onPress: () => void
}

export default function CenteredButton({
                                         text,
                                         color = BRIGHT_BLUE,
                                         widthPercent,
                                         heightPercent,
                                         marginTopPercent,
                                         onPress
                                     }: CenteredButtonProps) {
    return (
        <Pressable
            style={[
                sharedStyles.centeredButton,
                {
                    width: sw * widthPercent,
                    height: sh * heightPercent,
                    marginTop: sh * marginTopPercent,
                    backgroundColor: color
                }
            ]}
            onPress={onPress}
        >
            <Text style={sharedStyles.centeredButtonText}>{text}</Text>
        </Pressable>
    )
}

