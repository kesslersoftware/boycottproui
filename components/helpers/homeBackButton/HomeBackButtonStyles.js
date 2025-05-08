import { sw, sh } from '../../helpers/screenDimensionsutilitiy'
import { StyleSheet } from 'react-native'
import { BODY_TEXT_DARK, BRIGHT_BLUE } from '../../../styles/constants'

export const styles = StyleSheet.create({
    button: {
        width: sw * 0.165,
        height: sh * 0.0436,
        marginLeft: sw * 0.034,
        marginTop: sh * 0.003,
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
