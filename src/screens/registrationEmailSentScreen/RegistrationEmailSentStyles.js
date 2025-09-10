import {topInset,bottomInset,sw,sh} from "../../components/screenDimensionsutilitiy"
import { StyleSheet } from 'react-native'
import {BODY_TEXT_DARK, BRIGHT_BLUE} from "../../../styles/constants";

export const styles = StyleSheet.create({
    verifyEmail: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center' 
    },
    verificationLink: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
    checkInbox: {
        fontSize: 16,
        textAlign: 'center' ,
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginHorizontal: 30,
        marginTop: 20,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
    resendMessage: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center' ,
        marginTop: 10,
    },
    successMessage: {
        fontSize: 18,
        color: 'green',
        textAlign: 'center' ,
        marginVertical: 20,
    }
})
