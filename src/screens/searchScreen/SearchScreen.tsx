import {View, Text} from "react-native";
import HeaderBar from "../../components/headerBar/HeaderBar";
import React, {useEffect, useState} from "react";
import HomeBackButton from "../../components/homeBackButton/HomeBackButton";
import Slogan from "../../components/slogan/Slogan";
import ToggleSection from "../../components/toggle/ToggleSection";
import { ListItem } from '../../types/types';
import {
    RES_REGISTER_BTN_HEIGHT, RES_REGISTER_BTN_TOP_MARGIN,
    RES_REGISTER_BTN_WIDTH, SS_SEACRH_TOP_MARGIN, SS_TOGGLE_TOP_MARGIN, YELLOW
} from "../../../styles/constants";
import FormTextField from "../../components/labelAndField/FormTextField";
import { sharedStyles } from "../../../styles/sharedStyles";
import SelectableCompanyCausesList from "../../components/companiesOrCauses/SelectableCompanyCausesList";
import ConditionalButton from "../../components/button/ConditionalButton";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";
import { useUser } from '../../context/UserContext';
import {ResponseMessage} from "../../types/misc";
import {addUserCause} from "../../api/users";
import ReasonsForm from "../../components/reasonsForm/ReasonsForm";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import {AddCausesForm} from "../../types/users/AddCausesForm";
import { postAnonymousStat } from "../../services/AnonymousStatsService"
import { LocalBoycottStore } from "../../services/LocalBoycottStore";
import {LocalUserCause} from "../../types/users/LocalUserCause";
import { useIsFocused } from '@react-navigation/native';


type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>
type SearchScreenRouteProp = RouteProp<RootStackParamList, 'Search'>

export default function SearchScreen() {
    const successColor = '#155724';
    const errorColor = '#ff0000';
    // navigation constants
    const navigation = useNavigation<SearchScreenNavigationProp>();
    const isFocused = useIsFocused();
    const back_navigation = 'Search';
    const route = useRoute<SearchScreenRouteProp>();
    const { user, setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [ addMode, setAddMode] = useState<boolean>(false);
    // toggle button, which way is it going?
    const [isToggleOn, setIsToggleOn] = useState(false);
    // these are the full lists of companies and causes, they are loaded at
    // page initalization and should never change
    // also, the reasons section uses the causes list
    const [causes,setCauses] = useState<ListItem[]>([]);
    const [companies, setCompanies] = useState<ListItem[]>([]);
    // these are the smaller lists that get filtered from the lists above as the user
    // types letters in the search field
    const [filteredCauses, setFilteredCauses] = useState<ListItem[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<ListItem[]>([])
    const [filteredReasons,setFilteredReasons] = useState<ListItem[]>([])
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
    const hasSingleSelection = clickedItems.filter(Boolean).length === 1;
    // the hasSelection boolean determines if the "add to boycotts" or "follow causes" button is enabled
    // the hasReasonsToBoycott determines if the "add reasons" button is enabled
    const hasSelection = clickedItems.some(Boolean);
    const [visibleError, setVisibleError] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState('');
    const [ messageColor, setMessageColor ] = useState(successColor);
    const sleep = (ms: number) =>
        new Promise(resolve => setTimeout(resolve, ms));
    const setStatusMessageAndColor = async (message: string, color: string) => {
        setStatusMessage(message);
        setMessageColor(color);
        await sleep(3000);
        setStatusMessage('');
    }
    // these actions are for when the user has clicked the "add to boycotts" or "follow causes"
    // or "for these reasons" buttons
    const initiateAddBoycott = () => {
        setAddMode(true);
        setOpenReasonSearch(true);
        setReasonSearchTerm("");
        setFilteredReasons([]);
    }
    const handleAddCauses = async () => {
        let message: ResponseMessage = {
            status: 200,
            message: '',
            devMsg: ''
        };
        setLoading(true);
        const selectedCauses = filteredCauses.filter((_, idx) => clickedItems[idx]);
        const causes = selectedCauses.map(rec => {
            return {
                cause_id: rec.id,
                cause_desc: rec.description
            }
        });
        const form: AddCausesForm  = {
            user_id: user!.user_id!,
            causes: causes
        };
        if(user!.paying_user) {
            try {
                message = await addUserCause(form);
                await reset();
                await setStatusMessageAndColor(message.message, successColor);
            } catch (e: any) {
                // api.ts throws parsed JSON or {status, message}
                const status = e?.status ?? e?.statusCode;
                const message =
                    e?.message ||
                    e?.error ||
                    'Something went wrong. Please try again.';
                if (status === 401) {
                    // clear local user if you want
                    await setUser(undefined);          // from your UserContext
                    navigation.reset({index: 0, routes: [{name: 'Login'}]});
                    return;
                } else {
                    setVisibleError(message);
                }
            } finally {
                setLoading(false);
            }
        } else {
            try {
                const data = await LocalBoycottStore.load();
                const userCauses: LocalUserCause[] = data.user_causes; // get from local storage
                for(let cause of causes) {
                    if(userCauses.filter(rec => rec.cause_id === cause.cause_id).length==0) {
                        // logic to add user_causes record
                        userCauses.push({
                            cause_id: cause.cause_id,
                            cause_desc: cause.cause_desc,
                            timestamp: new Date().toISOString()
                        });
                        await postAnonymousStat("cause", {
                            cause_id: cause.cause_id,
                            increment: true
                        });
                        // no logic for cause_company_stats
                    }
                }
                data.user_causes = userCauses;
                await LocalBoycottStore.save(data);
                await reset();
                await setStatusMessageAndColor(message.message, successColor);
            } catch (e: any) {
                // local storage failure: never log out; show persistent error
                const msg = e?.message || 'Could not load your boycotts. Please try again.';
                setVisibleError(msg);
            } finally {
                setLoading(false);
            }
        }
    }
    const reset = async () => {
        setAddMode(false);
        setChecked(false);
        setShowField(false);
        setOpenReasonSearch(false);
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
    const fetchAllCompaniesAndCauses = async () => {
        try {
            setLoading(true);
            const allCompanies = await LocalBoycottStore.getAllCompanies();
            const allCauses = await LocalBoycottStore.getAllCauses();
            const convertedCompanies: ListItem[] = allCompanies.map(company => {
                    return {
                        id: company.company_id,
                        description: company.company_name,
                        numPeople: company.boycott_count
                    }
                });
            setCompanies(convertedCompanies);
            const convertedCauses: ListItem[] = allCauses.map(cause => {
                return {
                    id: cause.cause_id,
                    description: cause.cause_desc,
                    numPeople: cause.follower_count
                }
            });
            setCauses(convertedCauses);
        } catch (e: any) {
            // api.ts throws parsed JSON or {status, message}
            const status = e?.status ?? e?.statusCode;
            const message =
                e?.message ||
                e?.error ||
                'Something went wrong. Please try again.';
            if (status === 401) {
                // clear local user if you want
                await setUser(undefined);          // from your UserContext
                navigation.reset({index: 0, routes: [{name: 'Login'}]});
                return;
            } else {
                setVisibleError(message);
            }
        } finally {
            setLoading(false);
        }
    };
        fetchAllCompaniesAndCauses();
    }, []);
    useEffect(() => {
        if (isFocused) {
            try {
                setLoading(true);
                setIsToggleOn(false);
                reset();
            } catch (error) {
                console.error('Failed to fetch top trends:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [isFocused]);
    const gotoCauseDetails = () => {
        const cause_id = filteredCauses.filter((_, idx) =>
            clickedItems[idx]).map(rec => {
                return rec.id
        }).at(0)!;
        navigation.navigate('CauseDetails',
            { cause_id, back_navigation })
    };
    const gotoCompanyDetails = () => {
        const company_id = filteredCompanies.filter((_, idx) =>
            clickedItems[idx]).map(rec => {
            return rec.id
        }).at(0)!;
        navigation.navigate('CompanyDetails',
            { company_id, back_navigation })
    };
    // these are the functions that filter the parent lists into their smaller lists
    // they are triggered whenever the parent lists or their corresponding search terms
    // change in value(i.e, the user is typing or the page refreshes
    useEffect(() => {
        if(companySearchTerm.length>0) {
            const filtered = companies.filter(company =>
                company.description.toLowerCase().startsWith(companySearchTerm.toLowerCase())
            )
            setFilteredCompanies(filtered);
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
        if(checked) {
            setShowField(true);
        } else {
            setShowField(false);
            setPersonalReasonField("");
        }
    },[checked])
    const resetAfterSuccess = async (message: string) => {
        await reset();
        setStatusMessageAndColor(message, successColor);
    };
    return(
        <View style = {sharedStyles.containerSettings}>
            <HeaderBar/>
            { loading && <LoadingOverlay />}
            {
                !loading &&
                <>
                    <View style = {sharedStyles.homeAndSloganView}>
                        <HomeBackButton label = "home" onPress = {() => navigation.goBack()} />
                        <Slogan />
                    </View>
                    <View style = {sharedStyles.titleContainer}>
                        <Text style = {sharedStyles.title}>Search</Text>
                    </View>
                    {
                        visibleError.length > 0 &&
                        <>
                            <Text style={sharedStyles.errorText}>
                                {visibleError}
                            </Text>
                        </>
                    }
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
                        !isToggleOn &&
                        <View>
                            {
                                !openReasonSearch &&
                                <SelectableCompanyCausesList
                                    items = {filteredCompanies.slice(0,10)}
                                    clickedItems = {clickedItems}
                                    setClickedItems = {setClickedItems}
                                    heading = "List of Companies"
                                    clearOnSelect = {true}
                                />
                            }
                            {   hasCompanies && !openReasonSearch &&
                                hasSelection &&
                                <ConditionalButton
                                    text = "add to boycotts"
                                    widthPercent = {RES_REGISTER_BTN_WIDTH}
                                    heightPercent = {RES_REGISTER_BTN_HEIGHT}
                                    marginTopPercent = {RES_REGISTER_BTN_TOP_MARGIN}
                                    onPress = {initiateAddBoycott}
                                    hasItems = {hasSelection}
                                />
                            }
                            {   hasSingleSelection && !addMode && !openReasonSearch &&
                                <ConditionalButton
                                    text = "company details"
                                    color = {YELLOW}
                                    widthPercent = {RES_REGISTER_BTN_WIDTH}
                                    heightPercent = {RES_REGISTER_BTN_HEIGHT}
                                    marginTopPercent = {RES_REGISTER_BTN_TOP_MARGIN}
                                    onPress = {gotoCompanyDetails}
                                    hasItems = {hasSelection}
                                />
                            }
                            {
                                openReasonSearch && user &&
                                (
                                    <ReasonsForm
                                        user={user}
                                        mode="add"
                                        setLoading = {setLoading}
                                        companyId={filteredCompanies.find((_, i) => clickedItems[i])?.id || ''}
                                        companyName={filteredCompanies.find((_, i) => clickedItems[i])?.description || ''}
                                        onCancel={reset}
                                        onSuccess={resetAfterSuccess}
                                        onAuthError={async () => {
                                            await setUser(undefined);
                                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                                        }}
                                        onError={(msg) => setVisibleError(msg)}
                                    />
                                )
                            }
                        </View>
                    }
                    {
                        isToggleOn &&
                        <View>
                            <FormTextField
                                labelText = ""
                                labelMarginTop = {SS_SEACRH_TOP_MARGIN}
                                value = {causeSearchTerm}
                                onChangeText = {setCauseSearchTerm}
                                placeholder = "search for a cause"
                                hideLabel = {true}
                            />
                            <SelectableCompanyCausesList
                                items = {filteredCauses.slice(0,10)}
                                clickedItems = {clickedItems}
                                setClickedItems = {setClickedItems}
                                heading = "List of Causes"
                                clearOnSelect = {false}
                            />
                            {   hasSelection &&
                                <ConditionalButton
                                    text = "add to causes"
                                    widthPercent = {RES_REGISTER_BTN_WIDTH}
                                    heightPercent = {RES_REGISTER_BTN_HEIGHT}
                                    marginTopPercent = {RES_REGISTER_BTN_TOP_MARGIN}
                                    onPress = {handleAddCauses}
                                    hasItems = {hasSelection}
                                />
                            }
                            {   hasSingleSelection &&
                                <ConditionalButton
                                    text = "cause details"
                                    color = {YELLOW}
                                    widthPercent = {RES_REGISTER_BTN_WIDTH}
                                    heightPercent = {RES_REGISTER_BTN_HEIGHT}
                                    marginTopPercent = {RES_REGISTER_BTN_TOP_MARGIN}
                                    onPress = {gotoCauseDetails}
                                    hasItems = {hasSelection}
                                />
                            }
                        </View>
                    }
                </>
            }
            {
                statusMessage !== '' &&
                <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center',
                    backgroundColor: '#D4EDDA', padding: 10, borderRadius: 8 }}>
                    <Text style={{ color: { messageColor } }}>{statusMessage}</Text>
                </View>
            }
        </View>
    );
}
