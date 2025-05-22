import { StyleSheet } from 'react-native'
import { sw, sh } from '../../helpers/screenDimensionsutilitiy'
import {
    APP_BACKGROUND,
    BODY_TEXT_DARK,
    COLUMBIA_BLUE, CYAN,
    FORM_FIELD_BORDER,
    WHITE
} from "../../../styles/constants";

export const styles = StyleSheet.create({
    listContainer: {
        width: sw * 0.898,
        height: sh * 0.2,
        marginTop: sh * 0.016,
        marginLeft: sw * 0.051,
        backgroundColor: APP_BACKGROUND,
        borderColor: FORM_FIELD_BORDER,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: sw * 0.03
    },
    reasonContainer: {
        width: sw * 0.82,
        height: sh * 0.2,
        marginTop: sh * 0.016,
        marginLeft: sw * 0.000,
        backgroundColor: APP_BACKGROUND,
        borderColor: FORM_FIELD_BORDER,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: sw * 0.03
    },
    listHeading: {
        marginTop: sh * 0.000, // marginTop: sh * 0.005,
        fontSize: sh * 0.0153,
        fontWeight: '700',
        fontFamily: 'Inter',
        color: BODY_TEXT_DARK
    },
    listItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: sh * 0.005,
        //paddingHorizontal: sw * 0.04,
        //marginTop: sh * 0.003,
        /*borderRadius: 10,
        borderWidth: 1,
        borderColor: FORM_FIELD_BORDER,
        backgroundColor: WHITE*/
    },
    selectedRow: {
        backgroundColor: COLUMBIA_BLUE, // Example light blue, change to match your theme
        borderColor: CYAN,
    },
    notSelectedRow: {
        backgroundColor: WHITE,
        borderColor: FORM_FIELD_BORDER,
    },
    listItemDescWithPeople: {
        width: sw * 0.633,
        marginRight: sw * 0.02
    },
    listItemDescFull: {
        width: sw * 0.845
    },
    reasonListDesc: {
        width: sw * 0.75
    },
    listItemDesc: {
        height: sh * 0.024,
        fontSize: sh * 0.0153,
        fontWeight: '700',
        fontFamily: 'Inter',
        color: BODY_TEXT_DARK,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: sw * 0.02
    },
    numPeople: {
        height: sh * 0.024,
        width: sw * 0.170,
        fontSize: sh * 0.0153,
        fontWeight: '700',
        fontFamily: 'Inter',
        textAlign: 'center',
        textAlignVertical: 'center',
        color: BODY_TEXT_DARK,
        backgroundColor: WHITE,
        borderColor: FORM_FIELD_BORDER,
        borderWidth: 1,
        borderRadius: 10
    }
})
