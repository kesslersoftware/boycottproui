import {BODY_TEXT_DARK, FORM_FIELD_BORDER, LINK_TEXT} from "../../../styles/constants";
import {Dimensions, Platform, StatusBar, StyleSheet} from 'react-native'
const topInset = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44
const sw = Dimensions.get('window').width
const sh = Dimensions.get('window').height - topInset
export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        /*justifyContent: 'flex-end',
        marginVertical: 0*/
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: BODY_TEXT_DARK,
        backgroundColor: FORM_FIELD_BORDER,
        borderRadius: 4
    },
    checkedBox: {
        backgroundColor: LINK_TEXT,
        borderColor: LINK_TEXT
    },
    messageTxt: {
        marginLeft: sw * 0.022,
        fontFamily: 'Inter',
        fontWeight: '700',
        fontSize: sh * 0.0160,
        color: BODY_TEXT_DARK,
        textAlign: 'center',
        textAlignVertical: "center"
    }
})
