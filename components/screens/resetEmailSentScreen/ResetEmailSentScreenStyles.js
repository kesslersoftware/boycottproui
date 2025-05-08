import {topInset,bottomInset,sw,sh} from "../../helpers/screenDimensionsutilitiy"
import { StyleSheet } from 'react-native'
import {BODY_TEXT_DARK, BRIGHT_BLUE} from "../../../styles/constants";

export const styles = StyleSheet.create({
    resetEmailContent: {
        marginTop: sh * 0.050,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    checkEmail: {
        fontSize: sh * 0.0262,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    ifAccount: {
        marginTop: sh * 0.040,
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    sentInstructions: {
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },

})
