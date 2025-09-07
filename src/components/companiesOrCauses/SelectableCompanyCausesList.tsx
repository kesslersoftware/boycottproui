import React from 'react';
import { Pressable, Text, View, Keyboard } from 'react-native';
import { styles } from './SelectableCompanyCausesListStyles';
import { ListItem } from '../../types/types';

type Props = {
    items: ListItem[]
    clickedItems: boolean[]
    setClickedItems: (updated: boolean[]) => void
    heading: string
    reasonList?: boolean
    clearOnSelect?: boolean;
}

export default function SelectableCompanyCausesList({
                                                        items,
                                                        clickedItems,
                                                        setClickedItems,
                                                        heading,
                                                        reasonList = false,
                                                        clearOnSelect = false
                                                    }: Props) {
    const toggleItem = (index: number) => {
        Keyboard.dismiss();
        if (clearOnSelect) {
            setClickedItems(new Array(items.length).fill(false));
            const updated = new Array(items.length).fill(false);
            updated[index] = !updated[index];
            setClickedItems(updated);
        } else {
            const updated = [...clickedItems];
            updated[index] = !updated[index];
            setClickedItems(updated);
        }

    }

    return (
        <View style={[!reasonList && styles.listContainer,
        reasonList && styles.reasonContainer]}>
            <Text style={styles.listHeading}>{heading}</Text>
            {
                items.map((item, index) => (
                    <Pressable
                        key={index}
                        onPress={() => toggleItem(index)}
                        style={[
                            styles.listItemRow
                        ]}
                    >
                        {
                            !reasonList &&
                            <Text
                                style={[
                                    clickedItems[index] && styles.selectedRow,
                                    !clickedItems[index] && styles.notSelectedRow,
                                    styles.listItemDesc,
                                    item.numPeople !== undefined &&
                                    item.numPeople >= 0 ? styles.listItemDescWithPeople :
                                        styles.listItemDescFull
                                ]}
                            >
                                {item.description}
                            </Text>
                        }
                        {
                            reasonList &&
                            <Text
                                style={[
                                    clickedItems[index] && styles.selectedRow,
                                    !clickedItems[index] && styles.notSelectedRow,
                                    styles.listItemDesc,
                                    styles.reasonListDesc
                                ]}
                            >
                        {item.description}
                            </Text>
                        }
                        {item.numPeople !== undefined && !reasonList && (
                            <Text style={styles.numPeople}>{item.numPeople}</Text>
                        )}
                    </Pressable>
                ))
            }
        </View>
    )
}
