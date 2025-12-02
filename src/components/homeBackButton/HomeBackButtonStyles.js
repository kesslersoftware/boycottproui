import { sw, sh } from '../screenDimensionsutilitiy'
import { StyleSheet } from 'react-native'
import { BODY_TEXT_DARK, BRIGHT_BLUE } from '../../../styles/constants'

export const styles = StyleSheet.create({
    button: {
        flex: 1,
        height: sh * 0.0436,
        marginRight: sw * 0.02,
        borderRadius: 10,
        backgroundColor: BRIGHT_BLUE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
        textAlign: 'center',
    },
})
