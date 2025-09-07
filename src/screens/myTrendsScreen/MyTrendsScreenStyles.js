import {topInset,bottomInset,sw,sh} from "../../components/screenDimensionsutilitiy"
import { StyleSheet } from 'react-native'
import {BODY_TEXT_DARK, BRIGHT_BLUE} from "../../../styles/constants";

export const styles = StyleSheet.create({
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
})
