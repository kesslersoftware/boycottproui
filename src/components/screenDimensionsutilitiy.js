import {Dimensions, Platform, StatusBar} from 'react-native'
export const topInset = Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44
export const bottomInset = Platform.OS === 'android' ? 48 : 34 // approx height for nav/home bar
export const sw = Dimensions.get('window').width
export const sh = Dimensions.get('window').height - topInset
