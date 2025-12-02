import {View, Text} from "react-native";
import {styles} from "./CauseDetailsScreenStyles";
import {sharedStyles} from "../../../styles/sharedStyles";
import HeaderBar from "../../components/headerBar/HeaderBar";
import React, {useEffect, useState} from "react";
import Slogan from "../../components/slogan/Slogan";
import HomeBackButton from "../../components/homeBackButton/HomeBackButton";
import CompanyCausesList from "../../components/companiesOrCauses/CompanyCausesList";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";
import { useUser } from '../../context/UserContext';
import { formatDateTime } from '../../helpers/DateUtil';
import {Cause} from "../../types/causes/Cause";
import {addUserCause, deleteUserCause, getUserBoycottsByCause, getUserCauseById} from "../../api/users";
import {getCauseCompanies, getCauseDetails} from "../../api/causes";
import {CauseCompanyStats} from "../../types/causecompanystats/CauseCompanyStats";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import {CauseMetadata} from "../../types/causes/CauseMetadata";
import { ListItem } from '../../types/types';
import ConditionalButton from "../../components/button/ConditionalButton";
import {RES_REGISTER_BTN_HEIGHT, RES_REGISTER_BTN_TOP_MARGIN, RES_REGISTER_BTN_WIDTH, BTN_TEXT_BACK} from "../../../styles/constants";
import {AddCausesForm} from "../../types/users/AddCausesForm";
import {ResponseMessage} from "../../types/misc";
import {Reason} from "../../types/users/Reason";
import { UserCause } from "src/types/users";
import {LocalBoycottStore} from "../../services/LocalBoycottStore";
import { postAnonymousStat } from "../../services/AnonymousStatsService";
import { BoycottData } from "../../services/LocalBoycottStore";
import {CompanySummary} from "../../types/companies/CompanySummary";
import { LocalUserCause } from "../../types/users/LocalUserCause";
type CauseDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CauseDetails'>
type CauseDetailsScreenRouteProp = RouteProp<RootStackParamList, 'CauseDetails'>

export default function CauseDetailsScreen() {
    const successColor = '#155724';
    const errorColor = '#ff0000';
    // navigation constants
    const navigation = useNavigation<CauseDetailsScreenNavigationProp>();
    const route = useRoute<CauseDetailsScreenRouteProp>();
    const { user, setUser } = useUser();
    const { cause_id, back_navigation } = route.params;
    const [causeName,setCauseName] = useState<string>("");
    const [items,setItems] = useState<ListItem[]>([]);
    const [myItems,setMyItems] = useState<ListItem[]>([]);
    const [causeDetails, setCauseDetails] = useState<CauseMetadata | null>(null);
    const [followingSince,setFollowingSince] = useState<string>("");
    const [cause, setCause] = useState<Cause | null>(null);
    const [loading, setLoading] = useState(true);
    const heading = "list of companies";
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
    const fetchCauseDetails = async () => {
        setLoading(true);
        let step1success = false;
        let topCompaniesPerCause:CauseCompanyStats[] = [];
        try {
            setLoading(true);
            const cause: Cause = await getCauseDetails(cause_id);
            setCause(cause);
            setCauseName(cause.cause_desc);
            topCompaniesPerCause = await getCauseCompanies(cause_id);
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
        }
        if(step1success) {
            if(user!.paying_user) {
                try {
                    const userCausesRecord = await getUserCauseById(cause_id);
                    if(userCausesRecord.timestamp!=null) {
                        setFollowingSince(userCausesRecord!.timestamp!);
                    } else {
                        setFollowingSince("");
                    }
                    const companiesBoycottedForCause: CauseMetadata =
                        await getUserBoycottsByCause(cause_id);
                    setCauseDetails(companiesBoycottedForCause);
                    if(companiesBoycottedForCause.companies != null) {
                        setMyItems(companiesBoycottedForCause.companies.map((boycott) => ({
                            id: boycott.company_id,
                            description: boycott.company_name
                        })));
                    }
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
                    const allCauses = data.user_causes;
                    let userCausesRecord: UserCause = {
                        user_id: user!.user_id,
                        cause_id: cause_id,
                        cause_desc: '',
                        timestamp: null
                    };
                    const filteredCauses = allCauses.filter(rec =>
                        rec.cause_id === cause_id);
                    if(filteredCauses.length>0) {
                        userCausesRecord.cause_desc = filteredCauses.at(0)!.cause_desc;
                        userCausesRecord.timestamp = filteredCauses.at(0)!.timestamp;
                    }
                    if(userCausesRecord.timestamp!=null) {
                        setFollowingSince(userCausesRecord!.timestamp!);
                    } else {
                        setFollowingSince("");
                    }
                    const companies: CompanySummary[] = data.user_boycotts.filter(rec =>
                        rec.cause_id === cause_id)
                        .map(rec => {
                            return {
                                company_id: rec.company_id,
                                company_name: rec.company_name
                            };
                        })
                    const companiesBoycottedForCause: CauseMetadata = {
                        cause_id: cause_id,
                        cause_desc: cause.cause_desc,
                        companies: companies
                    };
                    setCauseDetails(companiesBoycottedForCause);
                    if(companiesBoycottedForCause.companies != null) {
                        setItems(topCompaniesPerCause.map((boycottedCompany) => ({
                            id: boycottedCompany.company_id,
                            description: boycottedCompany.company_name,
                            numPeople: boycottedCompany.boycott_count,
                        })));
                    }
                } catch (e: any) {
                    // local storage failure: never log out; show persistent error
                    const msg = e?.message || 'Could not load your boycotts. Please try again.';
                    setVisibleError(msg);
                } finally {
                    setLoading(false);
                }
            }
        } else {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCauseDetails();
    }, []);
    const handleAddCauses = async () => {
        let message: ResponseMessage = {
            status: 200,
            message: '',
            devMsg: ''
        };
        setLoading(true);
        const selectedCauses: Reason[] = []
        selectedCauses.push({
            cause_id: cause!.cause_id!,
            cause_desc: cause!.cause_desc!,
        });
        const form: AddCausesForm  = {
            user_id: user!.user_id!,
            causes: selectedCauses
        };
        if(user!.paying_user) {
            try {
                message = await addUserCause(form);
                reset();
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
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    return;
                } else {
                    setVisibleError(message);
                }
            } finally {
                setLoading(false); // hide spinner
            }
        } else {
            try {
                const data = await LocalBoycottStore.load();
                const userCauses: LocalUserCause[] = data.user_causes; // get from local storage
                for(let cause of selectedCauses) {
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
                reset();
                await setStatusMessageAndColor(message.message, successColor);
            } catch (e: any) {
                // local storage failure: never log out; show persistent error
                const msg = e?.message || 'Something went wrong. Please try again.';
                setVisibleError(msg);
            } finally {
                setLoading(false);
            }
        }
    }
    const handleRemoveCause = async () => {
        let message: ResponseMessage = {
            status: 200,
            message: '',
            devMsg: ''
        };
        setLoading(true);
        if(user!.paying_user) {
           try {
               message = await deleteUserCause(cause_id);
               reset();
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
                const data: BoycottData = await LocalBoycottStore.load();
                data.user_causes = data.user_causes.filter(rec => rec.cause_id != cause_id);
                await LocalBoycottStore.save(data);
                await postAnonymousStat("cause", {
                    cause_id: cause_id,
                    increment: false
                });
                reset();
                await setStatusMessageAndColor(message.message, successColor);
            } catch (e: any) {
                // local storage failure: never log out; show persistent error
                const msg = e?.message || 'Could not load your boycotts. Please try again.';
                setVisibleError(msg);
            } finally {
                setLoading(false);
            }
        }
    };
    function reset() {
        fetchCauseDetails();
    }
    return(
        <View style={sharedStyles.containerSettings}>

                <HeaderBar/>
                { loading && <LoadingOverlay />}
                { !loading &&
                    <>
                        <View style={sharedStyles.homeAndSloganView}>
                            <HomeBackButton label={BTN_TEXT_BACK} onPress={() =>
                                navigation.goBack()} />
                            <Slogan />
                        </View>
                        {
                            visibleError.length > 0 &&
                            <>
                                <Text style={sharedStyles.errorText}>
                                    {visibleError}
                                </Text>
                            </>
                        }
                        <View style={sharedStyles.titleContainer}>
                            <Text style={sharedStyles.title}>Cause Details</Text>
                        </View>
                        <Text style={sharedStyles.nameText}>{causeName}</Text>
                        {
                            followingSince.length > 0 &&
                            <View>
                                <Text style={sharedStyles.centeredText}>
                                    You’ve been following this cause since: </Text>
                                <Text style={sharedStyles.centeredText}>{ formatDateTime(
                                    followingSince) }</Text>
                            </View>
                        }
                        {
                            myItems.length > 1 &&
                            <View>
                                <Text style={sharedStyles.centeredText}>Companies you are boycotting because of this cause:</Text>
                            </View>
                        }
                        {
                            myItems.length === 1 &&
                            <View>
                                <Text style={sharedStyles.centeredText}>Company you are boycotting because of this cause:</Text>
                            </View>
                        }
                        {
                            myItems.length > 0 &&
                            <View>
                                <CompanyCausesList isCompany={true} heading = {heading} items = {myItems}/>
                            </View>
                        }
                        {
                            items.length > 0 &&
                            <View>
                                <Text style={sharedStyles.centeredText}>top companies being boycotted because of this cause:</Text>
                                <CompanyCausesList isCompany={true} heading = {heading} items = {items}/>
                            </View>
                        }
                        {
                            items.length === 0 && myItems.length === 0 &&
                            <View>
                                <Text style={sharedStyles.centeredText}>There are currently no boycotts for this cause</Text>
                            </View>
                        }
                        {
                            followingSince.length === 0 &&
                            <ConditionalButton
                                text = "follow cause"
                                widthPercent = {RES_REGISTER_BTN_WIDTH}
                                heightPercent = {RES_REGISTER_BTN_HEIGHT}
                                marginTopPercent = {RES_REGISTER_BTN_TOP_MARGIN}
                                onPress = {handleAddCauses}
                                hasItems = {true}
                            />
                        }
                        {
                            followingSince.length > 0 &&
                            <ConditionalButton
                                text = "stop following cause"
                                widthPercent = {RES_REGISTER_BTN_WIDTH}
                                heightPercent = {RES_REGISTER_BTN_HEIGHT}
                                marginTopPercent = {RES_REGISTER_BTN_TOP_MARGIN}
                                onPress = {handleRemoveCause}
                                hasItems = {true}
                            />
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
