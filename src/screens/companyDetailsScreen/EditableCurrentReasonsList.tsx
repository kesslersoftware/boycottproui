import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { CurrentReason } from '../../types/users/CurrentReason';

interface Props {
    items: CurrentReason[];
    highlightedIds: Set<string>;
    toggleHighlight: (id: string) => void;
}

export default function EditableCurrentReasonsList({ items, highlightedIds, toggleHighlight }: Props) {
    return (
        <View>
            {items.map((item) => (
                <Pressable
                    key={item.company_cause_id}
                    onPress={() => toggleHighlight(item.company_cause_id)}
                    style={{
                        padding: 10,
                        marginVertical: 4,
                        backgroundColor: highlightedIds.has(item.company_cause_id) ? '#ffdada' : '#fff',
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: '#ccc'
                    }}
                >
                    <Text>{item.personal_reason ? 'Personal reason' : item.company_cause_id}</Text>
                </Pressable>
            ))}
        </View>
    );
}
