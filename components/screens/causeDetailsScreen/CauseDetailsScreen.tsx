import {View, Text} from "react-native";
import {styles} from "../causeDetailsScreen/CauseDetailsScreenStyles";
import {sharedStyles} from "../../../styles/sharedStyles";
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import React, {useState} from "react";
import Slogan from "../../helpers/slogan/Slogan";
import HomeBackButton from "../../helpers/homeBackButton/HomeBackButton";
import CompanyCausesList, {ListItem} from "../../helpers/companiesOrCauses/CompanyCausesList";

const myCompanies=[
    { description: 'McDonalds'},
    { description: 'Tesla'},
    { description: 'Amazon'}
];
const companies=[
    { description: 'Company A', numPeople: 1421 },
    { description: 'Company B', numPeople: 879 },
    { description: 'Company C', numPeople: 453 }
];
const heading="list of companies";

export default function CauseDetailsScreen() {
    const [causeName,setCauseName] = useState<string>("Animal Rights");
    const [items,setItems] = useState<ListItem[]>(companies);
    const [myItems,setMyItems] = useState<ListItem[]>(myCompanies);
    return(
        <View style={sharedStyles.containerSettings}>
            <View>
                <HeaderBar/>
                <View style={sharedStyles.homeAndSloganView}>
                    <HomeBackButton label="back" onPress={() => console.log('Go back')} />
                    <Slogan />
                </View>
                <View style={sharedStyles.titleContainer}>
                    <Text style={sharedStyles.title}>Cause Details</Text>
                </View>
                <Text style={sharedStyles.nameText}>{causeName}</Text>
                <Text style={sharedStyles.centeredText}>You’ve been following this cause since: </Text>
                <Text style={sharedStyles.centeredText}>March 24th, 2024</Text>
                <Text style={sharedStyles.centeredText}>Companies you are boycotting because of this cause:</Text>
                <CompanyCausesList heading = {heading} items = {myItems}/>
                <Text style={sharedStyles.centeredText}>top companies being boycotted because of this cause:</Text>
                <CompanyCausesList heading = {heading} items = {items}/>
            </View>
        </View>
    );
}
