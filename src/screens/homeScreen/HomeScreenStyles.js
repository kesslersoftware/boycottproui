import {Dimensions, Platform, StatusBar} from 'react-native'
import { StyleSheet } from 'react-native'
import {BODY_TEXT_DARK, BRIGHT_BLUE, DELETE_RED} from "../../../styles/constants";
import {topInset,bottomInset,sw,sh} from "../../components/screenDimensionsutilitiy"


export const styles = StyleSheet.create({
    leftBtn: {
        position: 'absolute',
        left: 0,
        top: (sh + topInset) / 2 - ((sh + topInset) * 0.072 / 2), // center vertically
        width: sw * 0.068,
        height: sh * 0.072,
        borderRadius: 4,
        backgroundColor: BRIGHT_BLUE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftBtnArrow: {
        width: sw * 0.036,
        /*marginLeft: sw * 0.017,
        marginTop: sh * 0.027,*/
        fontSize: sh * 0.0262,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK
    },
    rightBtn: {
        position: 'absolute',
        right: 0,
        top: (sh + topInset) / 2 - ((sh + topInset ) * 0.072 / 2), // same logic
        width: sw * 0.068,
        height: sh * 0.072,
        borderRadius: 4,
        backgroundColor: BRIGHT_BLUE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightBtnArrow: {
        width: sw * 0.036,
        fontSize: sh * 0.0262,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK
    },
    sloganContent: {
        marginTop: sh * 0.008,
        width: '97%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        position: 'relative',
    },
    slogan: {
        /*width: sw * 0.592,
        marginLeft: sw * 0.65, //0.039 .369
        marginTop: sh * 0.008,*/
        fontSize: sh * 0.0174,
        fontFamily: 'Inter',
        fontStyle: 'italic',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
    },
    yourStats: {
        marginLeft: sw * 0.024,
        marginTop: sh * 0.09,
        fontSize: sh * 0.0218,
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK,
    },
    boycotts: {
        width: sw * 0.709,
        marginLeft: sw * 0.097,
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
    },
    numCauses: {
        width: sw * 0.485,
        marginLeft: sw * 0.097,
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
    },
    quickView: {
        width: sw * 0.274,
        marginLeft: sw * 0.024,
        marginTop: sh * 0.05,
        fontSize: sh * 0.0218,
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK,
    },
    quickViewContent: {
        marginLeft: sw * 0.102,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'left',
        alignItems: 'left',
        position: 'relative',
    },
    buttonsContent: {
        marginTop: sh * 0.005,
        //marginLeft: sw * 0.102,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'left',
        alignItems: 'left',
        position: 'relative',
    },
    topCompany: {
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
    },
    topCompanyName: {
        marginTop: sh * 0.0104,
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK,
    },
    numPeople: {
        marginTop: sh * 0.0104,
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
    },
    peopleNum: {
        width: sw * 0.136,
        marginLeft: sw * 0.061,
        marginTop: sh * 0.0104,
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK,
    },
    topReason: {
        marginTop: sh * 0.0104,
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
    },
    reasonCompany: {
        width: sw * 0.184,
        marginTop: sh * 0.0104,
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
    },
    boycottReason: {
        marginTop: sh * 0.0104,
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK,
    },
    topCauseFollowed: {
        marginTop: sh * 0.0104,
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
    },
    topCause: {
        marginTop: sh * 0.0104,
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK,
    },
    upgradeBtn: {
        width: sw * 0.762,
        marginLeft: sw * 0.119,
        marginTop: sh * 0.004,
        height: sh * 0.063,
        borderRadius: 20,
        backgroundColor: BRIGHT_BLUE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topTrendsBtn: {
        width: sw * 0.762,
        marginLeft: sw * 0.119,
        marginTop: sh * 0.004,
        height: sh * 0.063,
        borderRadius: 20,
        backgroundColor: BRIGHT_BLUE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    topTrendsContent: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    topTrendsBtnTxt: {
        fontSize: sh * 0.0262,
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK
    },
    topTrendsBtnArrow: {
        position: 'absolute',
        right: sw * 0.0262,
        fontSize: sh * 0.0262,
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK
    },
    myTrendsBtn: {
        width: sw * 0.762,
        marginLeft: sw * 0.119,
        marginTop: sh * 0.004,
        height: sh * 0.063,
        borderRadius: 20,
        backgroundColor: BRIGHT_BLUE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    myTrendsContent: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    myTrendsBtnArrow: {
        position: 'absolute',
        left: sw * 0.0262,
        fontSize: sh * 0.0262,
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK
    },
    myTrendsBtnTxt: {
        fontSize: sh * 0.0262,
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK
    },
    profileSettingBtn: {
        width: sw * 0.762,
        marginLeft: sw * 0.119,
        marginTop: sh * 0.004,
        height: sh * 0.063,
        borderRadius: 20,
        backgroundColor: BRIGHT_BLUE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileSettingBtnTxt: {
        fontSize: sh * 0.0262,
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK
    },
    searchBtn: {
        width: sw * 0.762,
        marginLeft: sw * 0.119,
        marginTop: sh * 0.004,
        height: sh * 0.063,
        borderRadius: 20,
        backgroundColor: BRIGHT_BLUE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchBtnContent: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    searchBtnTxt: {
        fontSize: sh * 0.0196,
        marginTop: sh * 0.02,
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK
    },
    searchBtnArrow: {
        fontSize: sh * 0.0262,
        marginBottom: sh * 0.01,
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK
    },
    bottomBtn: {
        width: sw * 1.000,
        marginLeft: sw * 0.000,
        marginTop: sh * 0.063,
        height: sh * 0.028,
        borderRadius: 4,
        backgroundColor: BRIGHT_BLUE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomBtnArrow: {
        /*width: sw * 0.041,*/
        /*marginLeft: sw * 0.483,*/
        /*marginTop: sh * 0.004,*/
        fontSize: sh * 0.0262,
        /*textAlign: 'center',*/
        textAlignVertical: 'center',
        fontFamily: 'Inter',
        fontWeight: '800',
        color: BODY_TEXT_DARK
    },

})
