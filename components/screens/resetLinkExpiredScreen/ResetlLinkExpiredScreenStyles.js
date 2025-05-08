import {topInset,bottomInset,sw,sh} from "../../helpers/screenDimensionsutilitiy"
import { StyleSheet } from 'react-native'
import {BODY_TEXT_DARK, BRIGHT_BLUE} from "../../../styles/constants";

export const styles = StyleSheet.create({
    linkExpiredContent: {
        marginTop: sh * 0.050,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    linkExpired: {
        fontSize: sh * 0.0262,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    linkHas: {
        marginTop: sh * 0.040,
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    request: {
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    },
    resendEmailBtn: {
        marginTop: sh * 0.010,
        width: sw * 0.4610,
        height: sh * 0.0403,
        borderRadius: 20,
        backgroundColor: BRIGHT_BLUE,
        justifyContent: 'center',   // 🔥 vertical alignment
        alignItems: 'center'        // 🔥 horizontal alignment
    },
    resendEmailBtnTxt: {
        fontSize: sh * 0.0153,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK
    }
})
