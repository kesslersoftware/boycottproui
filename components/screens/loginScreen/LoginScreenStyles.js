import {topInset,bottomInset,sw,sh} from "../../helpers/screenDimensionsutilitiy"
import {
    APP_BACKGROUND,
    BODY_TEXT_DARK,
    BRIGHT_BLUE,
    FORM_FIELD_BORDER,
    PRIMARY_BLUE, SUCCESS_GREEN,
    WHITE
} from "../../../styles/constants";
import { StyleSheet } from 'react-native'


export const styles = StyleSheet.create({
    welcomeText: {
        width: sw * 0.4370,
        marginLeft: sw * 0.2820,
        marginTop: sh * 0.0060,
        fontSize: sh * 0.0436,
        textAlign: 'center',
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK,
    },
    toText: {
        width: sw * 0.0970,
        marginLeft: sw * 0.4510,
        fontSize: sh * 0.0436,
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK,
    },
    boycottText: {
        width: sw * 0.5530,
        marginLeft: sw * 0.2230,
        fontSize: sh * 0.0436,
        textAlign: 'center',
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK,
    },
    slogan: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '700',
        width: sw * 0.7650,
        marginLeft: sw * 0.1140,
        marginTop: sh * 0.0240,
        height: sh * 0.0230,
        fontSize: sh * 0.0153,
        color: BODY_TEXT_DARK,
    },
    signInTxt: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '700',
        width: sw * 0.3350,
        marginLeft: sw * 0.3250,
        fontSize: sh * 0.0218,
        color: BODY_TEXT_DARK
    },
    passwordLabel: {
        width: sw * 0.2310,
        marginLeft: sw * 0.1020,
        marginTop: sh * 0.0100,
        fontSize: sh * 0.0218,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    inputBox2: {
        width: sw * 0.7910,
        marginLeft: sw * 0.1020,
        marginTop: sh * 0.0100,
        height: sh * 0.0520,
        borderRadius: 10,
        backgroundColor: WHITE,
        borderColor: FORM_FIELD_BORDER,
        borderWidth: 1,
    },
    forgotPassword: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '700',
        width: sw * 0.4130,
        marginLeft: sw * 0.2770,
        marginTop: sh * 0.0130,
        fontSize: sh * 0.0218,
        color: PRIMARY_BLUE,
        textDecorationLine: 'underline',
    },
    loginButton: {
        width: sw * 0.7620,
        marginLeft: sw * 0.1020,
        marginTop: sh * 0.0190,
        height: sh * 0.0630,
        borderRadius: 20,
        backgroundColor: BRIGHT_BLUE
    },
    loginButtonText: {
        width: sw * 0.1310,
        marginLeft: sw * 0.3160,
        marginTop: sh * 0.0150,
        fontSize: sh * 0.0218,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    noAccountText: {
        width: sw * 0.5490,
        marginLeft: sw * 0.2140,
        marginTop: sh * 0.0260,
        fontSize: sh * 0.0218,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    registerButton: {
        width: sw * 0.7620,
        marginLeft: sw * 0.1170,
        marginTop: sh * 0.0230,
        height: sh * 0.0630,
        borderRadius: 20,
        backgroundColor: SUCCESS_GREEN,
    },
    registerButtonText: {
        width: sw * 0.1970,
        marginLeft: sw * 0.2840,
        marginTop: sh * 0.0150,
        fontSize: sh * 0.0218,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    }
})
