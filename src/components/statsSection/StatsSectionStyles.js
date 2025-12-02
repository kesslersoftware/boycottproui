import { StyleSheet } from 'react-native';
import { sw, sh } from '../screenDimensionsutilitiy';
import { BODY_TEXT_DARK, FORM_FIELD_BORDER, BRIGHT_BLUE, APP_BACKGROUND } from '../../../styles/constants';

export const styles = StyleSheet.create({
    container: {
        width: sw * 0.96,
        marginHorizontal: sw * 0.02,
        marginBottom: sh * 0.02,
        backgroundColor: APP_BACKGROUND,
        borderWidth: 2,
        borderColor: FORM_FIELD_BORDER,
        borderRadius: 10,
        paddingVertical: sh * 0.01,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: sw * 0.03,
        paddingVertical: sh * 0.01,
    },
    headerText: {
        fontSize: sh * 0.022,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
    },
    button: {
        width: sh * 0.06,
        height: sh * 0.06,
        backgroundColor: BRIGHT_BLUE,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: sh * 0.011,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
        textAlign: 'center',
        lineHeight: sh * 0.014,
    },
    contentArea: {
        paddingHorizontal: sw * 0.06,
        paddingRight: sw * 0.03 + sh * 0.06,
    },
});
