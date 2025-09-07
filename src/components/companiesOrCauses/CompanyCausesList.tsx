import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from "../../types/types";
import {styles} from "./CompanyCausesListStyles";
import { ListItem } from '../../types/types';

type Props = {
    isCompany?: boolean
    heading: string
    items: ListItem[]
}

export default function CompanyCausesList({ isCompany = true, heading, items }: Props) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const handlePress = (item: ListItem) => {
        if (isCompany) {
            navigation.navigate('CompanyDetails', { company_id: item.id });
        } else {
            if(item.id != null && item.id.length > 0) {
                navigation.navigate('CauseDetails', { cause_id: item.id });
            } else {
                console.log("can't view cause details for a personal reason");
            }
        }
    };
    return (
        <View style={styles.listContainer}>
            <Text style={styles.listHeading}>{heading}</Text>
            {items.map((item, index) => (
                <Pressable key={index} onPress={() => handlePress(item)} style={styles.listItemRow}>
                    <Text
                        style={[
                            styles.listItemDesc,
                            item.numPeople !== undefined && item.numPeople >= 0
                                ? styles.listItemDescWithPeople
                                : styles.listItemDescFull,
                        ]}
                    >
                        {item.description}
                    </Text>
                    {item.numPeople !== undefined && (
                        <Text style={styles.numPeople}>{item.numPeople}</Text>
                    )}
                </Pressable>
            ))}
        </View>
    );
}
