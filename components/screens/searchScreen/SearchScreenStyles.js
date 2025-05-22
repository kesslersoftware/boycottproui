import {topInset,bottomInset,sw,sh} from "../../helpers/screenDimensionsutilitiy"
import { StyleSheet } from 'react-native'
import {APP_BACKGROUND, FORM_FIELD_BORDER} from "../../../styles/constants";

export const styles = StyleSheet.create({
    boycottContainer: {
        width: sw * 0.898,
        height: sh * 0.48,
        marginTop: sh * 0.016,
        marginLeft: sw * 0.051,
        backgroundColor: APP_BACKGROUND,
        borderColor: FORM_FIELD_BORDER,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: sw * 0.03,
    }, checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    saveBtnContainer: {
        flexDirection: 'row',

    },
    saveBtn: {
        marginLeft: sw * 0.00
    },
    cancelBtn: {
        marginLeft: sw * 0.18,
        marginRight: sw * 0.0
    }


})
