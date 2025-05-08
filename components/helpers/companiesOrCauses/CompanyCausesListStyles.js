import { StyleSheet } from 'react-native'
import { sw, sh } from "../../helpers/screenDimensionsutilitiy"
import { APP_BACKGROUND, FORM_FIELD_BORDER, WHITE, BODY_TEXT_DARK } from '../../../styles/constants'

export const styles = StyleSheet.create({
    listContainer: {
        width: sw * 0.898,
        height: sh * 0.110,
        marginTop: sh * 0.016,
        marginLeft: sw * 0.051,
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
        marginTop: sh * 0.003
    },
    listItemDesc: {
        height: sh * 0.024,
        fontSize: sh * 0.0153,
        fontWeight: '700',
        fontFamily: 'Inter',
        color: BODY_TEXT_DARK,
        backgroundColor: WHITE,
        borderColor: FORM_FIELD_BORDER,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: sw * 0.02
    },
    listItemDescWithPeople: {
        width: sw * 0.633,
        marginRight: sw * 0.02
    },
    listItemDescFull: {
        width: sw * 0.845
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
