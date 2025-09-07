import { Dimensions } from 'react-native'
import {BODY_TEXT_DARK, HEADER_BACKGROUND} from "../../../styles/constants";
import { StyleSheet } from 'react-native'
import { StatusBar, Platform } from 'react-native'
const topInset = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44
const sw = Dimensions.get('window').width
const sh = Dimensions.get('window').height - topInset
const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0
export const styles = StyleSheet.create({
    headerBar: {
        width: sw * 0.9540,
        marginLeft: sw * 0.0240,
        marginTop: paddingTop,
        borderRadius: 20,
        height: sh * 0.0340,
        backgroundColor: HEADER_BACKGROUND
    },
    titleText: {
        width: sw * 0.3110,
        marginLeft: sw * 0.3200,
        /*marginTop: sh * 0.0070,*/
        /*height: sh * 0.0210,*/
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: sh * 0.0262,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
})
