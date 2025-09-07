import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ListItem } from '../../types/types';
import { styles } from '../../components/companiesOrCauses/SelectableCompanyCausesListStyles';

type Props = {
    newReasons: ListItem[];
    onRemove: (id: string) => void;
};

export default function NewReasonsList({ newReasons, onRemove }: Props) {
    if (newReasons.length === 0) return null;

    return (
        <View style={styles.reasonContainer}>
            <Text style={styles.listHeading}>Reasons you want to add to the boycott</Text>
            {newReasons.map((item, index) => (
                <Pressable
                    key={item.id}
                    style={styles.listItemRow}
                    onPress={() => onRemove(item.id)}>
                    <Text style={[styles.listItemDesc, styles.listItemDescFull, styles.notSelectedRow,
                        styles.newReasonItem]}>
                        {item.description}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}
