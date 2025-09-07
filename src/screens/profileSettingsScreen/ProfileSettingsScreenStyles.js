import {topInset,bottomInset,sw,sh} from "../../components/screenDimensionsutilitiy"
import { StyleSheet } from 'react-native'
import {APP_BACKGROUND, BODY_TEXT_DARK, LINK_TEXT} from "../../../styles/constants";

export const styles = StyleSheet.create({
    textRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: sh * 0.024, // use 0.065 for first row if needed
        width: sw * 0.85,
        marginLeft: sw * 0.102
    },
    emailLabel: {
        fontSize: sh * 0.0218,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
    },
    emailTxt: {
        fontSize: sh * 0.0218,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
        marginRight: sw * 0.068 // from your data
    },
    passwordLabel: {
        fontSize: sh * 0.0218,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
    },
    passwordLink: {
        fontSize: sh * 0.0218,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: LINK_TEXT,
        textDecorationLine: 'underline',
        marginRight: sw * 0.068 // from your data
    }

})
