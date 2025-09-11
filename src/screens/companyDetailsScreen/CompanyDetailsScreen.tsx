import {View, Text} from "react-native";
import HeaderBar from "../../components/headerBar/HeaderBar";
import Slogan from "../../components/slogan/Slogan";
import HomeBackButton from "../../components/homeBackButton/HomeBackButton";
import React, {useEffect, useState} from "react";
import CompanyCausesList from "../../components/companiesOrCauses/CompanyCausesList";
import CenteredButton from "../../components/button/CenteredButton";
import {
    COMPDTLS_RMV_BTN_HEIGHT,
    COMPDTLS_RMV_BTN_TOP_MARGIN,
    COMPDTLS_RMV_BTN_WIDTH,
    COMPDTLS_CHG_BTN_HEIGHT,
    COMPDTLS_CHG_BTN_TOP_MARGIN,
    COMPDTLS_CHG_BTN_WIDTH,
    DELETE_RED
} from "../../../styles/constants";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import {RootStackParamList} from "../../types/types";
import { useUser } from '../../context/UserContext';
import {deleteUserBoycott, getUserBoycott} from "../../api/users";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import {CompanyMetadata} from "../../types/users";
import {getCompanyById, getCompanyCauses, getCompanyByName} from "../../api/companies";
import { CompanyData, Controversy } from "../../types/companies/CompanyData";
import {CompanyCause} from "../../types/companies/CompanyCause";
import { Company } from "../../types/companies/Company";
import { formatDateTime } from '../../helpers/DateUtil';
import {ResponseMessage} from "../../types/misc";
import {submitBoycottUpdate} from "../../api/misc";
import { ListItem } from '../../types/types';
import { sharedStyles } from "../../../styles/sharedStyles";
import {getAllCauses} from "../../api/causes";
import ReasonsForm from "../../components/reasonsForm/ReasonsForm";
import {LocalBoycottStore} from "../../services/LocalBoycottStore";
import { postAnonymousStat } from "../../services/AnonymousStatsService";
import {CauseSummary} from "../../types/causes/CauseSummary";
import { LocalUserBoycott } from "../../types/users/LocalUserBoycott";
import { BoycottData } from "../../services/LocalBoycottStore";
import AiDescription from "../../components/aiDescription/AiDescription";
type CompanyDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CompanyDetails'>
type CompanyDetailsScreenRouteProp = RouteProp<RootStackParamList, 'CompanyDetails'>

interface ParsedCompanyData {
    stock_ticker: string;
    summary: string;
    controversies_or_issues: Controversy[];
}

const parseData = (companyData: CompanyData): ParsedCompanyData => {
    return {
        stock_ticker: companyData.stock_ticker || '',
        summary: companyData.summary || '',
        controversies_or_issues: companyData.controversies_or_issues || []
    };
};

export default function CompanyDetailsScreen() {
    // navigation constants
    const successColor = '#155724';
    const errorColor = '#ff0000';
    const navigation = useNavigation<CompanyDetailsScreenNavigationProp>();
    const route = useRoute<CompanyDetailsScreenRouteProp>();
    const { user, setUser } = useUser();
    const { company_id, back_navigation } = route.params;
    const [items,setItems] = useState<ListItem[]>([]);
    const [company, setCompany] =
        useState<Company | null>(null);
    const [aiData, setAiData] = useState<ParsedCompanyData | null>(null);
    const [companyDetails, setCompanyDetails] = useState<CompanyMetadata | null>(null);
    const [ boycottReasons, setBoycottReasons] = useState<ListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');
    const [ messageColor, setMessageColor ] = useState(successColor);
    const [ addMode, setAddMode] = useState<boolean>(false);
    // change the reasons for boycotting
    const [ changeMode, setChangeMode] = useState<boolean>(false);
    const [currentReasons, setCurrentReasons] = useState<ListItem[]>([]);
    const [clickedCurrentReasons, setClickedCurrentReasons] = useState<boolean[]>(
        Array(currentReasons.length).fill(false));
    const [causes,setCauses] = useState<ListItem[]>([]);
    const editMode = addMode || changeMode;
    const heading = "list of causes";
    const [visibleError, setVisibleError] = useState<string>('');
    const sleep = (ms: number) =>
        new Promise(resolve => setTimeout(resolve, ms));
    const setStatusMessageAndColor = async (message: string, color: string) => {
        setStatusMessage(message);
        setMessageColor(color);
        await sleep(3000);
        setStatusMessage('');
    }
    const reset = async () => {
        setChangeMode(false);
        setAddMode(false);
        setCurrentReasons([]);
        setClickedCurrentReasons(Array(currentReasons.length).fill(false));
        //setClickedCurrentReasons([]);
        await fetchCompanyDetails();
    }
    const fetchCompanyDetails = async () => {
        setLoading(true);
        setVisibleError('');
        let step1passed = false;
        let fetchedCompany: Company | null = null;
        try {
            console.log("company_id = ",company_id);
            // Get company from LocalBoycottStore
            const allCompanies = await LocalBoycottStore.getAllCompanies();
            let company = allCompanies.find(c => c.company_id === company_id);
            if (!company) {
                throw new Error('Company not found in local storage');
            }
            // Check if description is blank and enhance it if needed
            if (!company.description || company.description.trim() === '') {
                try {
                    console.log("getting description for company: ", company.company_name);
                    const companyData = await getCompanyByName(company.company_name);
                    const parsedData = parseData(companyData);
                    
                    // Update the company object with enhanced description (summary)
                    company = {
                        ...company,
                        description: parsedData.summary
                    };
                    
                    // Store the full AI data separately
                    setAiData(parsedData);
                } catch (enhanceError) {
                    console.warn('Failed to enhance company description:', enhanceError);
                    // Continue with the original company data
                }
            }
            setCompany(company);
            fetchedCompany = company;
            step1passed = true;
        } catch (e: any) {
            const status = e?.status ?? e?.statusCode;
            const msg = e?.message || e?.error || 'Something went wrong. Please try again.';
            console.log("error message = ",msg);
            if (status === 401) {
                await setUser(undefined);
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                return;
            }
            setVisibleError(msg); // server/network error for paying user
        }
        let step2passed = false;
        if(step1passed) {
            console.log("user is a paying user?: " + user!.paying_user!);
            if (user!.paying_user!) {
                try {
                    const companyDetails: CompanyMetadata = await getUserBoycott(company_id);
                    setCompanyDetails(companyDetails);
                    if (companyDetails != null && companyDetails.reasons != null) {
                        setBoycottReasons(companyDetails!.reasons!.map((cause) => ({
                            id: cause.cause_id,
                            description: cause.cause_desc
                        })));
                    }
                    step2passed = true;
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
            } else {
                try {
                    const allCompanies: LocalUserBoycott[] = await LocalBoycottStore.getBoycotts();
                    const boycottsForThisCompany = allCompanies.filter(rec =>
                        rec.company_id === company_id);
                    let companyDetails: CompanyMetadata = {
                        company_id: company_id,
                        company_name: fetchedCompany!.company_name,
                        boycottingSince: undefined,
                        reasons: [],
                        boycotting: false
                    };
                    if (boycottsForThisCompany.length > 0) {
                        const reasons: CauseSummary[] = boycottsForThisCompany.map(rec => {
                            return {
                                cause_id: rec.cause_id,
                                cause_desc: rec.personal_reason != null && rec.personal_reason.length > 0 ?
                                    rec.personal_reason : rec.cause_desc,
                                personal_reason: rec.personal_reason != null && rec.personal_reason.length > 0
                            }
                        });
                        companyDetails.boycottingSince = boycottsForThisCompany
                            .map(b => b.timestamp)
                            .sort((a, b) =>
                                new Date(a).getTime() - new Date(b).getTime())[0];
                        companyDetails.reasons = reasons;
                        companyDetails.boycotting = true;
                    }
                    setCompanyDetails(companyDetails);
                    if (companyDetails.reasons != null) {
                        setBoycottReasons(companyDetails!.reasons!.map((cause) => ({
                            id: cause.cause_id != undefined ? cause.cause_id : "",
                            description: cause.cause_desc
                        })));
                    }
                    step2passed = true;
                } catch (e: any) {
                    // local storage failure: never log out; show persistent error
                    const msg = e?.message || 'Could not load your boycotts. Please try again.';
                    setVisibleError(msg);
                }
            }
        } else {
            setLoading(false); // hide spinner
        }
        if(step2passed) {
            try {
                const items:CompanyCause[] = await getCompanyCauses(company_id);
                setItems(items.map((cause) => ({
                    id: cause.cause_id,
                    description: cause.cause_desc,
                    numPeople: cause.boycott_count,
                })));
                const allCauses = await getAllCauses();
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
        } else {
            setLoading(false); // hide spinner
        }
    };
    useEffect(() => {
        fetchCompanyDetails();
    }, []);
    const handleRemove = async () => {
        let message: ResponseMessage = {
            status: 200,
            message: '',
            devMsg: ''
        };
        setLoading(true); // show spinner
        if(user!.paying_user) {
            try {
                message = await deleteUserBoycott(company_id);
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
                // logic to delete from local storage and retrieve a list of causeIds
                const data: BoycottData = await LocalBoycottStore.load();
                const boycottsForThisCompany = data.user_boycotts.filter(rec =>
                    rec.company_id === company_id);
                data.user_boycotts = data.user_boycotts.filter(rec =>
                    rec.company_id != company_id);
                await LocalBoycottStore.save(data);
                await postAnonymousStat("company", {
                    company_id: company_id,
                    increment: false
                });
                for (let boycott of boycottsForThisCompany) {
                    const cause_id = boycott.cause_id;
                    const cause_desc = boycott.cause_desc;
                    const company_name = boycott.company_name;
                    if(cause_id !== undefined) {
                        console.log("removing from cause_company_stats");
                        await postAnonymousStat("cause_company", {
                            cause_id: cause_id,
                            company_id: company_id,
                            cause_desc: cause_desc,
                            company_name: company_name,
                            increment: false
                        });
                    }
                }
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
    const initiateChangeMode = () => {
        setChangeMode(true);
        setCurrentReasons(boycottReasons);
        setClickedCurrentReasons(Array(boycottReasons.length).fill(false));
    };

    const initiateAddBoycott = () => {
        setAddMode(true);
    };
    const finishAndReset = async (message: string) => {
        reset();
        setStatusMessageAndColor(message, successColor);
    };
    return(
        <View style={sharedStyles.containerSettings}>
            <HeaderBar/>
            { loading && <LoadingOverlay />}
            { !loading && !editMode && !changeMode &&
                <>
                    <View style={sharedStyles.homeAndSloganView}>
                        <HomeBackButton label="back" onPress={() =>
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
                        <Text style={sharedStyles.title}>Company Details</Text>
                    </View>
                    <Text style={sharedStyles.nameText}>{company === null ? "" : company!.company_name}</Text>
                    {
                        !addMode && companyDetails != null && companyDetails.boycotting &&
                        <View>
                            <Text style={sharedStyles.centeredText}>
                                You’ve been boycotting this company since: </Text>
                            <Text style={sharedStyles.centeredText}>{ formatDateTime(
                                companyDetails!.boycottingSince!) }</Text>

                            {
                                companyDetails.reasons!.length>1 &&
                                <View>
                                    <Text style={sharedStyles.centeredText}>
                                        Your reasons for boycotting:</Text>
                                </View>
                            }
                            {
                                companyDetails.reasons!.length==1 &&
                                <View>
                                    <Text style={sharedStyles.centeredText}>
                                        Your reason for boycotting:</Text>
                                </View>
                            }
                            <CompanyCausesList isCompany={false} heading = {heading}
                                               items = {boycottReasons}/>
                        </View>
                    }
                    {
                        !addMode && items.length > 0 &&
                        <View>
                            <Text style={sharedStyles.centeredText}>
                                Top reasons others are boycotting this company:</Text>
                            <CompanyCausesList isCompany={false} heading = {heading} items = {items}/>
                        </View>
                    }
                    {
                        !addMode && aiData &&
                        <>
                            <Text style={sharedStyles.centeredText}>Company Summary & History</Text>
                            <AiDescription 
                                stock_ticker={aiData.stock_ticker}
                                summary={aiData.summary}
                                controversies_or_issues={aiData.controversies_or_issues}
                            />
                        </>
                    }
                    {
                        !addMode && !aiData && company?.description &&
                        <>
                            <Text style={sharedStyles.centeredText}>Company Summary & History</Text>
                            <View style={sharedStyles.descriptionContainer}>
                                <Text style={sharedStyles.description}>{company.description}</Text>
                            </View>
                        </>
                    }
                    {
                        companyDetails != null && companyDetails.boycotting &&
                        <View>
                            <CenteredButton
                                text="remove from boycotts"
                                widthPercent={COMPDTLS_RMV_BTN_WIDTH}
                                heightPercent={COMPDTLS_RMV_BTN_HEIGHT}
                                marginTopPercent={COMPDTLS_RMV_BTN_TOP_MARGIN}
                                onPress={handleRemove}
                            />
                            <CenteredButton
                                text="change boycott reasons"
                                widthPercent={COMPDTLS_CHG_BTN_WIDTH}
                                heightPercent={COMPDTLS_CHG_BTN_HEIGHT}
                                marginTopPercent={COMPDTLS_CHG_BTN_TOP_MARGIN}
                                onPress={initiateChangeMode}
                            />
                        </View>
                    }
                    {
                        !addMode && companyDetails != null && !companyDetails.boycotting &&
                        <View>
                            <CenteredButton
                                text="boycott this company"
                                color = {DELETE_RED}
                                widthPercent={COMPDTLS_CHG_BTN_WIDTH}
                                heightPercent={COMPDTLS_CHG_BTN_HEIGHT}
                                marginTopPercent={COMPDTLS_CHG_BTN_TOP_MARGIN}
                                onPress={initiateAddBoycott}
                            />
                        </View>
                    }
                </>
            }
            {
                addMode && user &&
                (
                    <ReasonsForm
                        mode="add"
                        setLoading = {setLoading}
                        user={user}
                        companyId={company!.company_id!}
                        companyName={company!.company_name!}
                        onCancel={reset}
                        onSuccess={finishAndReset}
                        onAuthError={async () => {
                            await setUser(undefined);
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        }}
                        onError={(msg) => setVisibleError(msg)}
                    />
                )
            }
            {
                !loading && changeMode && companyDetails?.boycotting &&
                <>
                    <ReasonsForm
                        mode="update"
                        setLoading = {setLoading}
                        user={user}
                        companyId={company!.company_id!}
                        companyName={company!.company_name!}
                        currentReasons={currentReasons}
                        clickedCurrentReasons={clickedCurrentReasons}
                        setClickedCurrentReasons={setClickedCurrentReasons}
                        submitBoycottUpdate={submitBoycottUpdate}
                        onCancel={reset}
                        onSuccess={finishAndReset}
                        onAuthError={async () => {
                            await setUser(undefined);
                            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                        }}
                        onError={(msg) => setVisibleError(msg)}
                    />
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
