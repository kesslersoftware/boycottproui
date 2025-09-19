import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controversy } from '../../types/companies/CompanyData';
import { sh, sw } from '../screenDimensionsutilitiy';
import { APP_BACKGROUND, BODY_TEXT_DARK, FORM_FIELD_BORDER } from '../../../styles/constants';

interface AiDescriptionProps {
    stock_ticker: string;
    summary: string;
    controversies_or_issues: Controversy[];
}

const AiDescription: React.FC<AiDescriptionProps> = ({ 
    stock_ticker, 
    summary, 
    controversies_or_issues 
}) => {
    return (
        <View style={styles.container}>
            {/* Header with Stock Ticker */}
            {stock_ticker && (
                <View style={styles.tickerContainer}>
                    <Text style={styles.tickerLabel}>Stock Symbol:</Text>
                    <Text style={styles.tickerValue}>{stock_ticker}</Text>
                </View>
            )}

            {/* Company Summary */}
            {summary && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Company Overview</Text>
                    <Text style={styles.summaryText}>{summary}</Text>
                </View>
            )}

            {/* Controversies Section */}
            {controversies_or_issues && controversies_or_issues.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Recent Issues & Controversies
                    </Text>
                    {controversies_or_issues.map((controversy, index) => (
                        <View key={index} style={styles.controversyItem}>
                            <Text style={styles.controversyTitle}>
                                {controversy.title}
                            </Text>
                            <Text style={styles.controversyDesc}>
                                {controversy.desc}
                            </Text>
                            {controversy.date && (
                                <Text style={styles.controversyDate}>
                                    {new Date(controversy.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: sw * 0.898,
        marginTop: sh * 0.016,
        marginLeft: sw * 0.051,
        backgroundColor: APP_BACKGROUND,
        borderColor: FORM_FIELD_BORDER,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: sw * 0.03,
        paddingVertical: sh * 0.02,
    },
    tickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: sh * 0.015,
        paddingBottom: sh * 0.01,
        borderBottomWidth: 1,
        borderBottomColor: FORM_FIELD_BORDER,
    },
    tickerLabel: {
        fontSize: sh * 0.016,
        fontFamily: 'Inter',
        fontWeight: '600',
        color: BODY_TEXT_DARK,
        marginRight: sw * 0.02,
    },
    tickerValue: {
        fontSize: sh * 0.018,
        fontFamily: 'Inter',
        fontWeight: '800',
        color: '#2563EB', // Professional blue
        letterSpacing: 1,
    },
    section: {
        marginBottom: sh * 0.02,
    },
    sectionTitle: {
        fontSize: sh * 0.018,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: BODY_TEXT_DARK,
        marginBottom: sh * 0.01,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    summaryText: {
        fontSize: sh * 0.015,
        fontFamily: 'Inter',
        fontWeight: '400',
        color: BODY_TEXT_DARK,
        lineHeight: sh * 0.022,
        textAlign: 'justify',
    },
    controversyItem: {
        backgroundColor: '#FEF3F3', // Light red background
        borderLeftWidth: 3,
        borderLeftColor: '#DC2626', // Red accent
        paddingHorizontal: sw * 0.03,
        paddingVertical: sh * 0.012,
        marginBottom: sh * 0.01,
        borderRadius: 6,
    },
    controversyTitle: {
        fontSize: sh * 0.016,
        fontFamily: 'Inter',
        fontWeight: '700',
        color: '#991B1B', // Dark red
        marginBottom: sh * 0.005,
    },
    controversyDesc: {
        fontSize: sh * 0.014,
        fontFamily: 'Inter',
        fontWeight: '400',
        color: BODY_TEXT_DARK,
        lineHeight: sh * 0.020,
        marginBottom: sh * 0.008,
    },
    controversyDate: {
        fontSize: sh * 0.012,
        fontFamily: 'Inter',
        fontWeight: '500',
        color: '#6B7280', // Gray
        fontStyle: 'italic',
    },
});

export default AiDescription;