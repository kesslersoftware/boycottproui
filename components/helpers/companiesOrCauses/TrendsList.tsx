import React from 'react'
import { FlatList, View, Text, Pressable } from 'react-native'
import { styles } from './TrendsListStyles'
import {sw} from "../screenDimensionsutilitiy";

type Props = {
    items: { name: string; rank?: number }[]
    onDelete: (name: string) => void
}

export default function TrendsList({ items, onDelete }: Props) {
    const renderItem = ({ item }: { item: { name: string; rank: number } }) => (
        <View style={styles.listItemRow}>
            {item.rank!=null && <View style={styles.listItemRank}>
                <Text style={styles.rankNumber}>{item.rank}</Text>
            </View>}
            <Text style={[
                    styles.listItemDesc,
                    item.rank!= undefined ? styles.listItemWithIndex : styles.listItemWithoutIndex
                    ]}>{item.name}</Text>
            <Pressable style={styles.deleteBtn} onPress={() => onDelete(item.name)}>
                <Text style={styles.deleteIcon}>✕</Text>
            </Pressable>
        </View>
    )

    return (
        <View style={styles.listContainer}>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.name}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}
