import {topInset,bottomInset,sw,sh} from "../../helpers/screenDimensionsutilitiy"
import { StyleSheet } from 'react-native'
import {BODY_TEXT_DARK, BRIGHT_BLUE} from "../../../styles/constants";

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
})
