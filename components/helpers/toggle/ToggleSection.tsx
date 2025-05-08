import React from 'react'
import { View, Text, Switch } from 'react-native'
import { sharedStyles } from '../../../styles/sharedStyles'
import {BRIGHT_BLUE, DARK_GREY, DEFAULT_TOGGLE_TOP_MARGIN, GREY, OFF_WHITE, WHITE} from '../../../styles/constants'

type ToggleSectionProps = {
    isToggleOn: boolean
    setIsToggleOn: (value: boolean) => void
    footerText?: string
    otherFooterText?: string
    leftLabel?: string
    rightLabel?: string
    marginTop?: number
}

export default function ToggleSection({ isToggleOn,
                                        setIsToggleOn,
                                        footerText,
                                        otherFooterText,
                                        leftLabel = 'Companies',
                                        rightLabel = 'Causes',
                                        marginTop = DEFAULT_TOGGLE_TOP_MARGIN
                                      }: ToggleSectionProps) {
    return (
        <View>
            <View style={[sharedStyles.toggleSection, { marginTop: marginTop}]}>
                <View style={sharedStyles.toggleRow}>
                    <Text style={sharedStyles.myCompaniesTxt}>{leftLabel}</Text>
                    <Switch
                        value={isToggleOn}
                        onValueChange={setIsToggleOn}
                        trackColor={{ false: GREY, true: BRIGHT_BLUE }}
                        thumbColor={isToggleOn ? WHITE : OFF_WHITE}
                        ios_backgroundColor={DARK_GREY}
                        style={sharedStyles.toggleSwitch}
                    />
                    <Text style={sharedStyles.myCausesTxt}>{rightLabel}</Text>
                </View>
            </View>
            <View style={sharedStyles.footerWrapper}>
                {!isToggleOn && footerText && <Text style={sharedStyles.toggleFooterText}>{footerText}</Text>}
                {isToggleOn && footerText && <Text style={sharedStyles.toggleFooterText}>{otherFooterText}</Text>}
            </View>
        </View>
    );
}
