import {topInset,bottomInset,sw,sh} from "../components/helpers/screenDimensionsutilitiy"
import { StyleSheet } from 'react-native'
import {APP_BACKGROUND, BODY_TEXT_DARK, BRIGHT_BLUE, FORM_FIELD_BORDER, WHITE} from "./constants";

export const sharedStyles = StyleSheet.create({
    containerSettings: {
        height: sh,
        width: sw,
        backgroundColor: APP_BACKGROUND,
    },
    sloganContent: {
        marginTop: sh * 0.008,
        width: '60%', // or sw * 0.60
        marginLeft: 'auto', // pushes it to the right
        marginRight: sw * 0.0262, // aligns with buttons that use right margin
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    slogan: {
        fontSize: sh * 0.0174,
        fontFamily: 'Inter',
        fontStyle: 'italic',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
    },
    homeBackBtn: {
        position: 'absolute',
        right: 0.1,
        top: (sh + topInset) / 2 - ((sh + topInset ) * 0.072 / 2), // same logic
        width: sw * 0.068,
        height: sh * 0.072,
        borderRadius: 4,
        backgroundColor: BRIGHT_BLUE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    homeBackBtnTxt: {
        width: sw * 0.036,
        fontSize: sh * 0.0262,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK
    },
    homeAndSloganView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: sh * 0.010, // from top margin % (0.010)
    },
    title: {
        width: sw * 0.687,      // component width %
        height: sh * 0.0393,    // height = 36 / 917
        fontSize: sh * 0.0262,  // font size %
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    toggleSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    myCompaniesTxt: {
        width: sw * 0.240,
        marginRight: sw * 0.03,
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: sh * 0.024,
    },
    toggleSwitch: {
        width: sw * 0.087,
        height: sh * 0.0196, // 18 / 917
        marginHorizontal: sw * 0.03,
    },
    myCausesTxt: {
        width: sw * 0.177,
        marginLeft: sw * 0.03,
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    footerWrapper: {
        alignItems: 'center',
    },
    toggleFooterText: {
        marginTop: sh * 0.05,
        fontSize: sh * 0.015, // sh * 0.0153
        /*textAlign: 'center',*/
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
    },
    formLabelAndFieldContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    label: {
        fontSize: sh * 0.0218,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    field: {
        width: '100%', // fill container
        marginLeft: 0, // handled by container
        marginTop: sh * 0.0070,
        height: sh * 0.0520,
        borderRadius: 10,
        backgroundColor: WHITE,
        borderColor: FORM_FIELD_BORDER,
        borderWidth: 1
    },
    centeredButton: {
        alignSelf: 'center',
        height: sh * 0.0403,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centeredButtonText: {
        fontSize: sh * 0.0218,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
        textAlign: 'center'
    },
    passwordFieldWrapper: {
        width: '100%',
        position: 'relative',
    },
    eyeIcon: {
        position: 'absolute',
        right: sw * 0.03,
        top: sh * 0.015,
    },
    nameText: {
        fontSize: sh * 0.022,
        marginTop: sh * 0.024,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK
    },
    centeredText: {
        fontSize: sh * 0.015,
        marginTop: sh * 0.024,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    }
})
