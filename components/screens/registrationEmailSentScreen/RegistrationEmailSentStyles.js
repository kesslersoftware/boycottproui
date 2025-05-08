import {topInset,bottomInset,sw,sh} from "../../helpers/screenDimensionsutilitiy"
import { StyleSheet } from 'react-native'
import {BODY_TEXT_DARK, BRIGHT_BLUE} from "../../../styles/constants";

export const styles = StyleSheet.create({
    verifyEmail: {
        width: sw * 0.5,
        marginLeft: sw * 0.250,
        marginTop: sh * 0.05,
        fontSize: sh * 0.0262,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    verificationLink: {
        width: sw * 0.8400,
        marginLeft: sw * 0.0800,
        marginTop: sh * 0.04,
        fontSize: sh * 0.0153,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    checkInbox: {
        width: sw * 0.7180,
        marginLeft: sw * 0.1410,
        marginTop: sh * 0.000,
        fontSize: sh * 0.0153,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    resendEmailBtn: {
        width: sw * 0.4610,
        marginLeft: sw * 0.2690,
        marginTop: sh * 0.007,
        height: sh * 0.0403,
        borderRadius: 20,
        backgroundColor: BRIGHT_BLUE,
        justifyContent: 'center',   // 🔥 vertical alignment
        alignItems: 'center'        // 🔥 horizontal alignment
    },
    resendEmailBtnTxt: {
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    }
})
