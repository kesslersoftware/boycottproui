import {View, Text} from "react-native";
import HeaderBar from "../../helpers/headerBar/HeaderBar";
import React, {useEffect, useState} from "react";
import HomeBackButton from "../../helpers/homeBackButton/HomeBackButton";
import Slogan from "../../helpers/slogan/Slogan";
import ToggleSection from "../../helpers/toggle/ToggleSection";
import type {SelectableListItem} from "../../helpers/companiesOrCauses/SelectableCompanyCausesList";
import {
    DELETE_RED,
    RES_REGISTER_BTN_HEIGHT, RES_REGISTER_BTN_TOP_MARGIN,
    RES_REGISTER_BTN_WIDTH, SS_REASON_TOP_MARGIN, SS_SAVE_BTN_HEIGHT, SS_SAVE_BTN_TOP_MARGIN, SS_SAVE_BTN_WIDTH,
    SS_SEACRH_TOP_MARGIN, SS_TOGGLE_TOP_MARGIN, SUCCESS_GREEN
} from "../../../styles/constants";
import FormTextField from "../../helpers/labelAndField/FormTextField";
import { companyData } from '../../../assets/companies'
import { causeData } from '../../../assets/causes'
import { sharedStyles } from "../../../styles/sharedStyles";
import SelectableCompanyCausesList from "../../helpers/companiesOrCauses/SelectableCompanyCausesList";
import ConditionalButton from "../../helpers/button/ConditionalButton";
import {styles} from "./SearchScreenStyles";
import CustomCheckbox from "../../helpers/customCheckbox/CustomCheckbox";
import type {User,UserBoycott} from "../../../types/DataModels"
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../../types/types";

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>
type SearchScreenRouteProp = RouteProp<RootStackParamList, 'Search'>

export default function SearchScreen() {
    // navigation constants
    const navigation = useNavigation<SearchScreenNavigationProp>();
    const route = useRoute<SearchScreenRouteProp>();
    const user = route.params.user;
    // toggle button, which way is it going?
    const [isToggleOn, setIsToggleOn] = useState(false);
    // these are the full lists of companies and causes, they are loaded at
    // page initalization and should never change
    // also, the reasons section uses the causes list
    const [causes,setCauses] = useState<SelectableListItem[]>([]);
    const [companies, setCompanies] = useState<SelectableListItem[]>([]);
    // these are the smaller lists that get filtered from the lists above as the user
    // types letters in the search field
    const [filteredCauses, setFilteredCauses] = useState<SelectableListItem[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<SelectableListItem[]>([])
    const [filteredReasons,setFilteredReasons] = useState<SelectableListItem[]>([])
    // these are the variables representing what the user has typed in the search fields
    const [companySearchTerm,setCompanySearchTerm] = useState<string>("");
    const [causeSearchTerm,setCauseSearchTerm] = useState<string>("");
    const [reasonSearchTerm,setReasonSearchTerm] = useState<string>("");
    const [personalReasonField, setPersonalReasonField] = useState<string>("");
    // these represent what items in the filtered lists have been selected
    // clickedItems is used for both company and cause searches, while clickedReasons
    // is used for filteredReasons reasons
    const [clickedItems, setClickedItems] = useState<boolean[]>(
        Array(filteredCompanies.length).fill(false));
    const [clickedReasons, setClickedReasons] = useState<boolean[]>(
        Array(filteredReasons.length).fill(false));
    // this is a boolean to determine if a sub view should display when the user has
    // selected companies to boycott
    const [openReasonSearch,setOpenReasonSearch] = useState<boolean>(false);
    // this is for the reasons checkbox and the reason field
    const [checked, setChecked] = useState(false);
    const [showField, setShowField] = useState(false);
    // these booleans determine if the "add to boycotts" or "follow causes" buttons display
    const hasCompanies = filteredCompanies.length > 0;
    const hasCauses = filteredCauses.length > 0;
    const hasReasons = filteredReasons.length > 0 || checked;
    // the hasSelection boolean determines if the "add to boycotts" or "follow causes" button is enabled
    // the hasReasonsToBoycott determines if the "add reasons" button is enabled
    const hasSelection = clickedItems.some(Boolean);
    const hasReasonsToBoycott = !checked && clickedReasons.some(Boolean) || personalReasonField.length>0;
    // these actions are for when the user has clicked the "add to boycotts" or "follow causes"
    // or "for these reasons" buttons
    const handleAddCompanies = () => {
        const selectedCompanies = filteredCompanies.filter((_, idx) => clickedItems[idx]);
        // process `selected` items here
        setOpenReasonSearch(true);
        setReasonSearchTerm("");
        setFilteredReasons([]);
    }
    const handleAddCauses = () => {
        const selectedCauses = filteredCauses.filter((_, idx) => clickedItems[idx]);
        // process `selected` items here
        console.log('Selected causes:', selectedCauses);
    }
    const handleAddReasons = () => {
        const selectedReasons = filteredReasons.filter((_, idx) => clickedReasons[idx])
        // process `selected` items here
        console.log('Selected reasons:', selectedReasons);
        const selectedCompanies = filteredCompanies.filter((_, idx) => clickedItems[idx]);
        console.log('Selected companies:', selectedCompanies);
        console.log('personal reason:',personalReasonField);
        console.log("user:",user);
        const boycottRecords:UserBoycott[] = [];
        for (const company of selectedCompanies) {
            for (const reason of selectedReasons) {
                const boycottRecord: UserBoycott = {
                    user_id: user.user_id,
                    company_id: company.id.toString(),
                    cause_id: reason.id.toString(),
                    personal_reason: null,
                    timestamp: Date.now().toString()
                };
                boycottRecords.push(boycottRecord)
            }
        }

        if(checked) {
            for (const company of selectedCompanies) {
                const boycottRecord: UserBoycott = {
                    user_id: user.user_id,
                    company_id: company.id.toString(),
                    cause_id: null,
                    personal_reason: personalReasonField!,
                    timestamp: Date.now().toString()
                }
                boycottRecords.push(boycottRecord)
            }
        }
        for(const record of boycottRecords) {
            console.log("we are saving record:",record);
        }
    }
    const cancelOperation = () => {
        console.log('canceling operation');
        reset();
    }
    function reset() {
        setChecked(false);
        setShowField(false);
        setReasonSearchTerm("")
        setCauseSearchTerm("");
        setCompanySearchTerm("");
        setPersonalReasonField("");
        setFilteredReasons([]);
        setFilteredCauses([]);
        setFilteredCompanies([])
        setOpenReasonSearch(false);
        setClickedItems([]);
        setClickedReasons([]);

    }
    //
    useEffect(() => {
        setClickedItems(Array(filteredCompanies.length).fill(false))
    }, [filteredCompanies])
    useEffect(() => {
        setClickedItems(Array(filteredCauses.length).fill(false))
    }, [filteredCauses])
    useEffect(() => {
        setClickedReasons(Array(filteredReasons.length).fill(false))
    }, [filteredReasons])
    // these two are triggered whenever the page initializes
    useEffect(() => {
        const mappedCompanies: SelectableListItem[] = companyData.map(company => ({
            id: Number(company.company_id),
            description: company.company_name,
            numPeople: company.boycott_count
        }));
        setCompanies(mappedCompanies);
    }, []);
    useEffect(() => {
        console.log("user:",user);
        const mappedCauses: SelectableListItem[] = causeData.map(cause => ({
            id: Number(cause.cause_id),
            description: cause.cause_desc,
            numPeople: cause.follower_count
        }));
        setCauses(mappedCauses);
    }, []);
    // these are the functions that filter the parent lists into their smaller lists
    // they are triggered whenever the parent lists or their corresponding search terms
    // change in value(i.e, the user is typing or the page refreshes
    useEffect(() => {
        if(companySearchTerm.length>0) {
            const filtered = companies.filter(company =>
                company.description.toLowerCase().startsWith(companySearchTerm.toLowerCase())
            )
            setFilteredCompanies(filtered)
        } else {
            setFilteredCompanies([]);
        }
    }, [companySearchTerm, companies])
    useEffect(() => {
        if(causeSearchTerm.length>0) {
            const filtered = causes.filter(cause =>
                cause.description.toLowerCase().startsWith(causeSearchTerm.toLowerCase())
            ).slice(0,5)
            setFilteredCauses(filtered)
        } else {
            setFilteredCauses([]);
        }
    }, [causeSearchTerm, causes])
    useEffect(() => {
        if(reasonSearchTerm.length>0) {
            const filtered = causes.filter(reason =>
                reason.description.toLowerCase().startsWith(reasonSearchTerm.toLowerCase())
            ).slice(0,5)
            setFilteredReasons(filtered)
        } else {
            setFilteredReasons([]);
        }
    }, [reasonSearchTerm, causes])
    // this is triggered whenever the toggle button changes
    useEffect(() => {
            reset();
    },[isToggleOn])
    useEffect(() => {
        //console.log("checkbox is checked");
        if(checked) {
            setShowField(true);
        } else {
            setShowField(false);
            setPersonalReasonField("");
        }
    },[checked])
    return(
        <View style = {sharedStyles.containerSettings}>
            <View>
                <HeaderBar/>
                <View style = {sharedStyles.homeAndSloganView}>
                    <HomeBackButton label = "home" onPress = {() => navigation.navigate('MainTabs')} />
                    <Slogan />
                </View>
                <View style = {sharedStyles.titleContainer}>
                    <Text style = {sharedStyles.title}>Search</Text>
                </View>
                {
                    !openReasonSearch &&
                    <ToggleSection isToggleOn = {isToggleOn} setIsToggleOn = {setIsToggleOn}
                                   footerText = {"what company would you like to boycott?"}
                                   otherFooterText = {"what cause would you like to join?"}
                                   marginTop = {SS_TOGGLE_TOP_MARGIN}
                                   includeFooter = {true}/>
                }
                {
                    !isToggleOn && !openReasonSearch &&
                    <FormTextField
                        labelText = ""
                        labelMarginTop = {SS_SEACRH_TOP_MARGIN}
                        value = {companySearchTerm}
                        onChangeText = {setCompanySearchTerm}
                        placeholder = "search for a company or brand"
                        hideLabel = {true}
                    />
                }
                {
                    isToggleOn &&
                    <FormTextField
                        labelText = ""
                        labelMarginTop = {SS_SEACRH_TOP_MARGIN}
                        value = {causeSearchTerm}
                        onChangeText = {setCauseSearchTerm}
                        placeholder = "search for a cause"
                        hideLabel = {true}
                    />
                }
                {
                    !isToggleOn &&
                    <View>
                        {
                            !openReasonSearch &&
                            <SelectableCompanyCausesList
                                items = {filteredCompanies}
                                clickedItems = {clickedItems}
                                setClickedItems = {setClickedItems}
                                heading = "List of Companies"
                            />
                        }
                        {   hasCompanies && !openReasonSearch &&
                            <ConditionalButton
                                text = "add to boycotts"
                                widthPercent = {RES_REGISTER_BTN_WIDTH}
                                heightPercent = {RES_REGISTER_BTN_HEIGHT}
                                marginTopPercent = {RES_REGISTER_BTN_TOP_MARGIN}
                                onPress = {handleAddCompanies}
                                hasItems = {hasSelection}
                            />
                        }
                        {
                            openReasonSearch &&
                            <View style = {styles.boycottContainer}>
                                <FormTextField
                                    labelText = "why are you boycotting?"
                                    labelMarginTop = {SS_SEACRH_TOP_MARGIN}
                                    value = {reasonSearchTerm}
                                    onChangeText = {setReasonSearchTerm}
                                    placeholder = "what causes"
                                    hideLabel = {false}
                                    width = {0.82}
                                    paddingHorizontal = {0.0}
                                />
                                <SelectableCompanyCausesList
                                    items = {filteredReasons}
                                    clickedItems = {clickedReasons}
                                    setClickedItems = {setClickedReasons}
                                    heading = "List of Causes"
                                    reasonList = {true}
                                />
                                <View style = {styles.checkboxContainer}>
                                    <CustomCheckbox
                                        checked = {checked}
                                        setChecked = {() => setChecked(!checked)}
                                        text = {"personal reasons"} leftMargin = {0.0}
                                    topMargin = {0.01}/>
                                </View>
                                {
                                    checked &&
                                    <FormTextField
                                        labelText = ""
                                        labelMarginTop = {SS_REASON_TOP_MARGIN}
                                        value = {personalReasonField}
                                        onChangeText = {setPersonalReasonField}
                                        placeholder = "what reason"
                                        hideLabel = {true}
                                        width = {0.82}
                                        paddingHorizontal = {0.0}
                                    />
                                }
                                {   hasReasons &&
                                    <View style = {styles.saveBtnContainer}>
                                        <View style = {styles.saveBtn}>
                                            <ConditionalButton
                                                text = "save"
                                                color = {SUCCESS_GREEN}
                                                widthPercent = {SS_SAVE_BTN_WIDTH}
                                                heightPercent = {SS_SAVE_BTN_HEIGHT}
                                                marginTopPercent = {SS_SAVE_BTN_TOP_MARGIN}
                                                onPress = {handleAddReasons}
                                                hasItems = {hasReasonsToBoycott}
                                            />
                                        </View>
                                        <View style = {styles.cancelBtn}>
                                            <ConditionalButton
                                                text = "cancel"
                                                color = {DELETE_RED}
                                                widthPercent = {SS_SAVE_BTN_WIDTH}
                                                heightPercent = {SS_SAVE_BTN_HEIGHT}
                                                marginTopPercent = {SS_SAVE_BTN_TOP_MARGIN}
                                                onPress = {cancelOperation}
                                                hasItems = {true}
                                            />
                                        </View>
                                    </View>
                               }
                            </View>
                        }
                    </View>
                }
                {
                    isToggleOn &&
                    <View>
                        <SelectableCompanyCausesList
                            items = {filteredCauses}
                            clickedItems = {clickedItems}
                            setClickedItems = {setClickedItems}
                            heading = "List of Causes"
                        />
                        {   hasCauses &&
                            <ConditionalButton
                                text = "add to causes"
                                widthPercent = {RES_REGISTER_BTN_WIDTH}
                                heightPercent = {RES_REGISTER_BTN_HEIGHT}
                                marginTopPercent = {RES_REGISTER_BTN_TOP_MARGIN}
                                onPress = {handleAddCauses}
                                hasItems = {hasSelection}
                            />
                        }
                    </View>
                }
            </View>
        </View>
    );
}
