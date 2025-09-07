import {topInset,bottomInset,sw,sh} from "../../components/screenDimensionsutilitiy"
import { StyleSheet } from 'react-native'
import {BODY_TEXT_DARK, BRIGHT_BLUE, FORM_FIELD_BORDER, WHITE} from "../../../styles/constants";

export const styles = StyleSheet.create({
    passwordRestContent: {
        marginTop: sh * 0.050,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    resetPassword: {
        fontSize: sh * 0.0262,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    pleaseReset: {
        marginTop: sh * 0.040,
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    sendInstructions: {
        width: sw * 0.5900,
        marginLeft: sw * 0.2040,
        marginTop: sh * 0.0050,
        fontSize: sh * 0.0153,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    passwordFormContent: {
        marginLeft: sw * 0.102,
        marginTop: sh * 0.0450,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'left',
        alignItems: 'left',
        position: 'relative',
    },
    passwordLabel: {
        marginTop: sh * 0.013,
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: sh * 0.0218,
        color: BODY_TEXT_DARK
    },
    passwordField: {
        width: sw * 0.791,
        height: sh * 0.052,
        marginTop: sh * 0.004,
        backgroundColor: WHITE,
        borderWidth: 1,
        borderColor: FORM_FIELD_BORDER,
        borderRadius: 10
    },
    repeatPasswordLabel: {
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: sh * 0.0218,
        color: BODY_TEXT_DARK
    },
    repeatPasswordField: {
        width: sw * 0.791,
        height: sh * 0.052,
        marginTop: sh * 0.004,
        borderWidth: 1,
        backgroundColor: WHITE,
        borderColor: FORM_FIELD_BORDER,
        borderRadius: 10
    },
    resetPasswordBtn: {
        width: sw * 0.4610,
        marginLeft: sw * 0.2690,
        marginTop: sh * 0.030,
        height: sh * 0.0403,
        borderRadius: 20,
        backgroundColor: BRIGHT_BLUE,
        justifyContent: 'center',   // 🔥 vertical alignment
        alignItems: 'center'        // 🔥 horizontal alignment
    },
    resetPasswordBtnTxt: {
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    }
})
