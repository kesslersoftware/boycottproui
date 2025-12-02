import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from './StatsSectionStyles';

type Props = {
    header: string;
    buttonText: string;
    onButtonPress: () => void;
    children: React.ReactNode;
};

export default function StatsSection({ header, buttonText, onButtonPress, children }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.headerText}>{header}</Text>
                <Pressable style={styles.button} onPress={onButtonPress}>
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </Pressable>
            </View>
            <View style={styles.contentArea}>
                {children}
            </View>
        </View>
    );
}
