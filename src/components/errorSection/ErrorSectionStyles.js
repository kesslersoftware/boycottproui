import {Dimensions, Platform, StatusBar} from 'react-native'
import {DELETE_RED, LINK_TEXT} from "../../../styles/constants";
import { StyleSheet } from 'react-native'
const topInset = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44
const sw = Dimensions.get('window').width
const sh = Dimensions.get('window').height - topInset

export const styles = StyleSheet.create({
    errorContainer: {
        width: '100%',
        minHeight: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: sh * 0.0050
    },
    errorContainerLarge: {
        width: '100%',
        minHeight: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: sh * 0.0050
    },
    errorText: {
        color: DELETE_RED,
        fontSize: sh * 0.0153,
        textAlign: 'center',
        marginBottom: sh * 0.0100,
        fontStyle: 'italic',
    },
    errorLink: {
        color: LINK_TEXT,
        fontSize: sh * 0.0153,
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginBottom: sh * 0.0100,
        fontStyle: 'italic',
    },
})
