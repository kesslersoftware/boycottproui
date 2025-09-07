import {topInset,bottomInset,sw,sh} from "../../components/screenDimensionsutilitiy"
import { StyleSheet } from 'react-native'
import {BODY_TEXT_DARK, BRIGHT_BLUE, FORM_FIELD_BORDER, WHITE} from "../../../styles/constants";


export const styles = StyleSheet.create({
    resetPassword: {
        width: sw * 0.5850,
        marginLeft: sw * 0.2090,
        marginTop: sh * 0.050,
        fontSize: sh * 0.0262,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    enterEmail: {
        width: sw * 0.7180,
        marginLeft: sw * 0.1410,
        marginTop: sh * 0.040,
        fontSize: sh * 0.0153,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },

    sendInstructions: {
        width: sw * 0.5900,
        marginLeft: sw * 0.2040,
        marginTop: sh * 0.000,
        fontSize: sh * 0.0153,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    emailFormContent: {
        marginLeft: sw * 0.102,
        marginTop: sh * 0.0360,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'left',
        alignItems: 'left',
        position: 'relative',
    },
    emailLabel: {
        width: sw * 0.1260,
        marginTop: sh * 0.0360,
        fontSize: sh * 0.0218,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    emailField: {
        width: sw * 0.7910,
        marginTop: sh * 0.0040,
        height: sh * 0.0523,
        borderRadius: 10,
        backgroundColor: WHITE,
        borderColor: FORM_FIELD_BORDER,
        borderWidth: 1
    },
    resetPasswordBtn: {
        width: sw * 0.4610,
        marginLeft: sw * 0.2690,
        marginTop: sh * 0.0360,
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
