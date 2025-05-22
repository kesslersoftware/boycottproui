import { StyleSheet } from 'react-native'
import { sw, sh } from '../../helpers/screenDimensionsutilitiy'
import {ALMOST_WHITE, BODY_TEXT_DARK, DELETE_RED, VERY_LIGHT_GREY, WHITE} from '../../../styles/constants'

export const styles = StyleSheet.create({
    listContainer: {
        width: sw * 0.864,
        height: sh * 0.591,
        marginLeft: sw * 0.068,
        marginTop: sh * 0.016,
        backgroundColor: WHITE,
        borderColor: VERY_LIGHT_GREY,
        padding: sh * 0.008,
        borderRadius: 14
    },
    listItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: sh * 0.015,
    },

    listItemRank: {
        width: sw * 0.078,
        height: sh * 0.0349,
        borderRadius: sw * 0.039,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: sw * 0.03,
        marginLeft: sw * 0.03
    },
    rankNumber: {
        fontSize: sh * 0.0153,
        fontWeight: '700',
        color: BODY_TEXT_DARK,
    },
    listItemDesc: {
        height: sh * 0.0349,
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
        backgroundColor: WHITE,
        borderColor: ALMOST_WHITE,
        borderWidth: 1,
        borderRadius: 5,
        textAlignVertical: 'center',
        marginLeft: sw * 0.02,
        marginRight: sw * 0.02,
        padding: 2
    },
    listItemWithIndex: {
        width: sw * 0.558,
    },
    listItemWithoutIndex: {
        width: sw * 0.696
    },

    deleteBtn: {
        width: sw * 0.078,
        height: sh * 0.0349,
        backgroundColor: DELETE_RED,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteIcon: {
        color: WHITE,
        fontSize: sh * 0.0153,
        fontWeight: '700',
    },
})
