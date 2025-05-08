import {View, Text} from "react-native";
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import Slogan from "../../helpers/slogan/Slogan";
import {sharedStyles} from "../../../styles/sharedStyles";
import HomeBackButton from "../../helpers/homeBackButton/HomeBackButton";
import React, {useState} from "react";
import { ListItem } from '../../helpers/companiesOrCauses/CompanyCausesList'
import CompanyCausesList from "../../helpers/companiesOrCauses/CompanyCausesList";
import CenteredButton from "../../helpers/button/CenteredButton";
import {
    COMPDTLS_RMV_BTN_HEIGHT,
    COMPDTLS_RMV_BTN_TOP_MARGIN,
    COMPDTLS_RMV_BTN_WIDTH, COMPDTLS_VIEW_CAUSE_BTN_HEIGHT, COMPDTLS_VIEW_CAUSE_BTN_TOP_MARGIN,
    COMPDTLS_VIEW_CAUSE_BTN_WIDTH
} from "../../../styles/constants";

const myCompanies=[
    { description: 'Company A', numPeople: 1421 },
    { description: 'Company B', numPeople: 879 },
    { description: 'Company C', numPeople: 453 }
];
const companies=[
        { description: 'Company A', numPeople: 1421 },
        { description: 'Company B', numPeople: 879 },
        { description: 'Company C', numPeople: 453 }
    ];
const heading="list of causes";

export default function CompanyDetailsScreen() {
    const [companyName,setCompanyName] = useState<string>("McDonalds");
    const [items,setItems] = useState<ListItem[]>(companies);

    return(
        <View style={sharedStyles.containerSettings}>
            <HeaderBar/>
            <View style={sharedStyles.homeAndSloganView}>
                <HomeBackButton label="back" onPress={() => console.log('Go back')} />
                <Slogan />
            </View>
            <View style={sharedStyles.titleContainer}>
                <Text style={sharedStyles.title}>Company Details</Text>
            </View>
            <Text style={sharedStyles.nameText}>{companyName}</Text>
            <Text style={sharedStyles.centeredText}>You’ve been boycotting this company since: </Text>
            <Text style={sharedStyles.centeredText}>March 24th, 2024</Text>
            <Text style={sharedStyles.centeredText}>Your reason for boycotting:</Text>
            <Text style={sharedStyles.centeredText}>Animal rights abuses</Text>
            <Text style={sharedStyles.centeredText}>Top reasons others are boycotting this company:</Text>
            <CompanyCausesList heading = {heading} items = {items}/>
            <CenteredButton
                text="remove from boycotts"
                widthPercent={COMPDTLS_RMV_BTN_WIDTH}
                heightPercent={COMPDTLS_RMV_BTN_HEIGHT}
                marginTopPercent={COMPDTLS_RMV_BTN_TOP_MARGIN}
                onPress={() => console.log('remove from boycotts pressed')}
            />
            <CenteredButton
                text="view cause details"
                widthPercent={COMPDTLS_VIEW_CAUSE_BTN_WIDTH}
                heightPercent={COMPDTLS_VIEW_CAUSE_BTN_HEIGHT}
                marginTopPercent={COMPDTLS_VIEW_CAUSE_BTN_TOP_MARGIN}
                onPress={() => console.log('view cause details pressed')}
            />
        </View>
    );
}
