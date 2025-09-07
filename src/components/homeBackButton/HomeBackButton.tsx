import React from 'react'
import { Pressable, Text } from 'react-native'
import { styles } from './HomeBackButtonStyles'

type Props = {
    label: string
    onPress: () => void
}

export default function HomeBackButton({ label, onPress }: Props) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{label}</Text>
        </Pressable>
    )
}
