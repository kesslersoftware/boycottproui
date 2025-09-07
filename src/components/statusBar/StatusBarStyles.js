import {Dimensions, Platform, StatusBar} from 'react-native'
import { StyleSheet } from 'react-native'
const topInset = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44
const sw = Dimensions.get('window').width
const sh = Dimensions.get('window').height - topInset

export const styles = StyleSheet.create({
    statusBar: {
        width: sw * 1.0000,
        marginLeft: sw * 0.0000,
        marginTop: sh * 0.0000,
        height: sh * 0.0360
    },
    rightSide: {
        height: sh * 0.012,
        width: sw * 0.160
    },
    batteryImage: {
        height: sh * 0.012,
        width: sw * 0.058
    },
    leftSide: {
        height: sh * 0.023,
        width: sw * 0.131
    },
    timeImage: {
        height: sh * 0.023,
        width: sw * 0.131,
        borderRadius: 32
    }
})
