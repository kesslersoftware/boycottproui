import {View, Text} from "react-native";
import {styles} from "../searchScreen/SearchScreenStyles";
import {sharedStyles} from "../../../styles/sharedStyles";
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import React, {useState} from "react";
import HomeBackButton from "../../helpers/homeBackButton/HomeBackButton";
import Slogan from "../../helpers/slogan/Slogan";
import ToggleSection from "../../helpers/toggle/ToggleSection";
import CompanyCausesList, {ListItem} from "../../helpers/companiesOrCauses/CompanyCausesList";
import {
    LS_LOGIN_USERNAME_TOP_MARGIN,
    RES_REGISTER_BTN_HEIGHT, RES_REGISTER_BTN_TOP_MARGIN,
    RES_REGISTER_BTN_WIDTH,
    SS_SEACRH_TOP_MARGIN, SS_TOGGLE_TOP_MARGIN
} from "../../../styles/constants";
import FormTextField from "../../helpers/labelAndField/FormTextField";
import CenteredButton from "../../helpers/button/CenteredButton";

const companies = [
    { description: 'Company A', numPeople: 1 },
    { description: 'Company B', numPeople: 2 },
    { description: 'Company C', numPeople: 3 },
];
const causes = [
    { description: 'Animal rights' },
    { description: 'Unfair labor practices'},
    { description: 'Environment' }
];
function handleDelete(name: string) {
    console.log('Delete', name)
};
function handleCompanySelection(name: string) {
    console.log('Delete', name)
};
export default function SearchScreen() {
    const [isToggleOn, setIsToggleOn] = useState(false)
    const [items,setItems] = useState<ListItem[]>([]);
    const [myItems,setMyItems] = useState<ListItem[]>([]);
    const [companySearchTerm,setCompanySearchTerm] = useState<string>("");
    const [causeSearchTerm,setCauseSearchTerm] = useState<string>("");
    return(
        <View style={sharedStyles.containerSettings}>
            <View>
                <HeaderBar/>
                <View style={sharedStyles.homeAndSloganView}>
                    <HomeBackButton label="home" onPress={() => console.log('Go Home')} />
                    <Slogan />
                </View>
                <View style={sharedStyles.titleContainer}>
                    <Text style={sharedStyles.title}>Search</Text>
                </View>
                <ToggleSection isToggleOn={isToggleOn} setIsToggleOn={setIsToggleOn}
                               footerText={"what company would you like to boycott?"}
                               otherFooterText={"what cause would you like to join?"}
                                marginTop={SS_TOGGLE_TOP_MARGIN}/>
                {
                    !isToggleOn &&
                    <FormTextField
                        labelText=""
                        labelMarginTop={SS_SEACRH_TOP_MARGIN}
                        value=""
                        onChangeText={setCompanySearchTerm}
                        placeholder="search for a company or brand"
                        hideLabel={true}
                    />
                }
                {
                    isToggleOn &&
                    <FormTextField
                        labelText=""
                        labelMarginTop={SS_SEACRH_TOP_MARGIN}
                        value=""
                        onChangeText={setCauseSearchTerm}
                        placeholder="search for a company or brand"
                        hideLabel={true}
                    />
                }
                {
                    !isToggleOn &&
                    <View>
                    <CompanyCausesList heading = "list of companies" items = {items}/>
                        <CenteredButton
                        text="add to boycotts"
                        widthPercent={RES_REGISTER_BTN_WIDTH}
                        heightPercent={RES_REGISTER_BTN_HEIGHT}
                        marginTopPercent={RES_REGISTER_BTN_TOP_MARGIN}
                        onPress={() => console.log('add to boycotts pressed')}
                        />
                    </View>
                }
                {
                    isToggleOn &&
                    <View>
                        <CompanyCausesList heading = "list of causes" items = {myItems}/>
                        <CenteredButton
                        text="add to causes"
                        widthPercent={RES_REGISTER_BTN_WIDTH}
                        heightPercent={RES_REGISTER_BTN_HEIGHT}
                        marginTopPercent={RES_REGISTER_BTN_TOP_MARGIN}
                        onPress={() => console.log('add to causes pressed')}
                        />
                    </View>
                }

            </View>
        </View>
    );
}
