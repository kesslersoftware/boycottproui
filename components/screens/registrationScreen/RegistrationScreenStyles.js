import {topInset,bottomInset,sw,sh} from "../../helpers/screenDimensionsutilitiy"
import {APP_BACKGROUND,
    BODY_TEXT_DARK,
    FORM_FIELD_BORDER,
    SUCCESS_GREEN} from "../../../styles/constants";
import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    createAccount: {
        marginTop: sh * 0.0327,
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: sh * 0.0393,
        color: BODY_TEXT_DARK,
        textAlign: 'center'
    },
    usernameLabel: {
        marginLeft: sw * 0.102,
        marginTop: sh * 0.015,
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: sh * 0.0218,
        color: BODY_TEXT_DARK
    },
    usernameField: {
        width: sw * 0.791,
        height: sh * 0.052,
        marginLeft: sw * 0.102,
        marginTop: sh * 0.004,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: FORM_FIELD_BORDER,
        borderRadius: 10
    },
    emailLabel: {
        marginLeft: sw * 0.102,
        marginTop: sh * 0.013,
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: sh * 0.0218,
        color: BODY_TEXT_DARK
    },
    emailField: {
        width: sw * 0.791,
        height: sh * 0.052,
        marginLeft: sw * 0.102,
        marginTop: sh * 0.004,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: FORM_FIELD_BORDER,
        borderRadius: 10
    },
    repeatEmailLabel: {
        marginLeft: sw * 0.102,
        marginTop: sh * 0.013,
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: sh * 0.0218,
        color: BODY_TEXT_DARK
    },
    repeatEmailField: {
        width: sw * 0.791,
        height: sh * 0.052,
        marginLeft: sw * 0.102,
        marginTop: sh * 0.004,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: FORM_FIELD_BORDER,
        borderRadius: 10
    },
    passwordLabel: {
        marginLeft: sw * 0.102,
        marginTop: sh * 0.013,
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: sh * 0.0218,
        color: BODY_TEXT_DARK
    },
    passwordField: {
        width: sw * 0.791,
        height: sh * 0.052,
        marginLeft: sw * 0.102,
        marginTop: sh * 0.004,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: FORM_FIELD_BORDER,
        borderRadius: 10
    },
    repeatPasswordLabel: {
        marginLeft: sw * 0.102,
        marginTop: sh * 0.013,
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: sh * 0.0218,
        color: BODY_TEXT_DARK
    },
    repeatPasswordField: {
        width: sw * 0.791,
        height: sh * 0.052,
        marginLeft: sw * 0.102,
        marginTop: sh * 0.004,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: FORM_FIELD_BORDER,
        borderRadius: 10
    },
    registerButton: {
        width: sw * 0.762,
        height: sh * 0.063,
        marginLeft: sw * 0.119,
        marginTop: sh * 0.030,
        backgroundColor: SUCCESS_GREEN,
        borderRadius: 20
    },
    registerBtnContent: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    registerButtonText: {
        marginTop: sh * 0.018,
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: sh * 0.0218,
        color: BODY_TEXT_DARK,
    }
})
