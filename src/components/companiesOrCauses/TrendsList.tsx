import React from 'react'
import { FlatList, View, Text, Pressable } from 'react-native'
import { styles } from './TrendsListStyles'
import {sw} from "../screenDimensionsutilitiy";

export type Item = {
    cause_id?: string,
    company_id?: string,
    cause_desc?: string,
    company_name?: string,
    follower_count?: number,
    boycott_count?: number,
    rank?: number
}

type Props = {
    items: Item[]
    onSelectCompany?: (company_id: string) => void
    onSelectCause?: (cause_id: string) => void
    onDeleteCompany?: (company_id: string) => void
    onDeleteCause?: (cause_id: string) => void
    showDelete?: boolean
}
export function deDuplicate(items: Item[]): Item[] {
    const seen = new Set<string>();
    const result: Item[] = [];
    for (const item of items) {
        const key = item.company_id
            ? `company-${item.company_id}`
            : item.cause_id
                ? `cause-${item.cause_id}`
                : null;
        if (key && !seen.has(key)) {
            seen.add(key);
            result.push(item);
        }
    }
    return result;
}


export default function TrendsList({   items,
                                       onSelectCompany,
                                       onSelectCause,
                                       onDeleteCompany,
                                       onDeleteCause,
                                       showDelete=false }: Props) {

    const renderItem = ({ item }: { item: Item }) => {
        const isCompany = item.company_id != null;
        const isCause = item.cause_id != null;

        const handlePress = () => {
            if (isCompany && onSelectCompany) {
                onSelectCompany(item.company_id!);
            } else if (isCause && onSelectCause) {
                onSelectCause(item.cause_id!);
            }
        };

        return (
            <Pressable onPress={handlePress}>
                <View style={styles.listItemRow}>
                    {item.rank != null && (
                        <View style={styles.listItemRank}>
                            <Text style={styles.rankNumber}>{item.rank}</Text>
                        </View>
                    )}

                    {isCompany && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[
                                styles.listItemDesc,
                                item.rank != undefined ? styles.listItemWithIndex : styles.listItemWithoutIndex
                            ]}>
                                {item.company_name}
                            </Text>
                            {showDelete && (
                                <Pressable
                                    style={[styles.deleteBtn, { marginLeft: sw * 0.01 }]}
                                    onPress={() => onDeleteCompany?.(item.company_id!)}
                                >
                                    <Text style={styles.deleteIcon}>✕</Text>
                                </Pressable>
                            )}
                        </View>
                    )}

                    {isCause && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[
                                styles.listItemDesc,
                                item.rank != undefined ? styles.listItemWithIndex : styles.listItemWithoutIndex
                            ]}>
                                {item.cause_desc}
                            </Text>
                            {showDelete && (
                                <Pressable
                                    style={[styles.deleteBtn, { marginLeft: sw * 0.01 }]}
                                    onPress={() => onDeleteCause?.(item.cause_id!)}
                                >
                                    <Text style={styles.deleteIcon}>✕</Text>
                                </Pressable>
                            )}
                        </View>
                    )}
                </View>
            </Pressable>
        );
    };


    return (
        <View style={styles.listContainer}>
            <FlatList
                data={deDuplicate(items)}
                renderItem={renderItem}
                keyExtractor={item =>
                    item.company_id ? `company-${item.company_id}` : `cause-${item.cause_id}`
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}
