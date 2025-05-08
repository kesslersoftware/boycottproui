import React from 'react'
import { View, Text } from 'react-native'
import {styles} from "./CompanyCausesListStyles";

export type ListItem = {
    description: string
    numPeople?: number
}

type Props = {
    heading: string
    items: ListItem[]
}

export default function CompanyCausesList({ heading, items }: Props) {
    return (
        <View style={styles.listContainer}>
            <Text style={styles.listHeading}>{heading}</Text>
            {items.map((item, index) => (
                <View key={index} style={styles.listItemRow}>
                    <Text
                        style={[
                            styles.listItemDesc,
                            item.numPeople ? styles.listItemDescWithPeople : styles.listItemDescFull
                        ]}
                    >
                        {item.description}
                    </Text>
                    {item.numPeople !== undefined && (
                        <Text style={styles.numPeople}>{item.numPeople}</Text>
                    )}
                </View>
            ))}
        </View>
    )
}
