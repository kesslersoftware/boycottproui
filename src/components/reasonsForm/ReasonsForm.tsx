import {ListItem} from "../../types/types";
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import {sharedStyles} from "../../../styles/sharedStyles";
import FormTextField from "../labelAndField/FormTextField";
import {
    DELETE_RED,
    SS_REASON_TOP_MARGIN,
    SS_SAVE_BTN_HEIGHT,
    SS_SAVE_BTN_TOP_MARGIN,
    SS_SAVE_BTN_WIDTH,
    SS_SEACRH_TOP_MARGIN,
    SUCCESS_GREEN, YELLOW
} from "../../../styles/constants";
import SelectableCompanyCausesList from "../companiesOrCauses/SelectableCompanyCausesList";
import CustomCheckbox from "../customCheckbox/CustomCheckbox";
import ConditionalButton from "../button/ConditionalButton";
import { addUserBoycott } from '../../api/users';
import { getAllCauses } from '../../api/causes';
import {AddUserBoycottForm} from "../../types/users/AddUserBoycottForm";
import {ResponseMessage} from "../../types/misc";
import NewReasonsList from "../../screens/companyDetailsScreen/NewReasonsList";
import {UpdateReasonsForm, User} from "../../types/users";
import {LocalBoycottStore} from "../../services/LocalBoycottStore";
import { postAnonymousStat } from "../../services/AnonymousStatsService";
import { LocalUserBoycott} from "../../types/users/LocalUserBoycott";
import { LocalUserCause} from "../../types/users/LocalUserCause";
type Mode = 'add' | 'update';

type Props = {
    user: User;
    companyId: string;
    companyName: string;
    onCancel: () => void;
    onSuccess?: (message: string) => void;
    onAuthError?: () => void;       // 🔹 new: parent handles 401 → logout + reset
    onError?: (msg: string) => void; // 🔹 new: parent handles visible error messages
    allCauses?: ListItem[];
    mode: Mode;
    setLoading: (value: boolean) => void;
    // update-specific props
    currentReasons?: ListItem[];
    clickedCurrentReasons?: boolean[];
    setClickedCurrentReasons?: (items: boolean[]) => void;
    submitBoycottUpdate?: (form: UpdateReasonsForm) => Promise<ResponseMessage>;
};

export default function ReasonsForm({
                                        user,
                                        companyId,
                                        companyName,
                                        onCancel,
                                        onSuccess,
                                        onAuthError,
                                        onError,
                                        allCauses,
                                        mode,
                                        setLoading = () => false,
                                        currentReasons = [],
                                        clickedCurrentReasons = [],
                                        setClickedCurrentReasons = () => {},
                                        submitBoycottUpdate,
                                    }: Props) {
    const [causes, setCauses] = useState<ListItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<ListItem[]>([]);
    const [clickedResults, setClickedResults] = useState<boolean[]>([]);
    const [checked, setChecked] = useState(false);
    const [personalReason, setPersonalReason] = useState('');
    const [newReasons, setNewReasons] = useState<ListItem[]>([]);
    const isAddMode = mode === 'add';
    const hasReasonsToBoycott = isAddMode
        ? newReasons.length > 0 || (checked && personalReason.trim().length > 0)
        : clickedCurrentReasons.some(Boolean) || newReasons.length > 0 || (checked && personalReason.trim().length > 0);
    const disable = clickedResults.some(Boolean);

    useEffect(() => {
        const initializeCauses = async () => {
            if (allCauses?.length) {
                setCauses(allCauses);
            } else {
                try {
                    const raw = await getAllCauses();
                    const mapped = raw.map((c: any) => ({
                        id: c.cause_id,
                        description: c.cause_desc,
                        numPeople: c.follower_count,
                    }));
                    setCauses(mapped);
                } catch (e: any) {
                    // api.ts throws parsed JSON or {status, message}
                    const status = e?.status ?? e?.statusCode;
                    const message =
                        e?.message ||
                        e?.error ||
                        'Something went wrong. Please try again.';
                    if (status === 401) {
                        if (onAuthError) onAuthError();   // parent will clear user + reset nav
                        return;
                    } else {
                        if (onError) onError(message);    // parent will show ErrorSection
                    }
                } finally {
                    setLoading(false);
                }
            }
        };
        initializeCauses();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
        } else {
            const filtered = causes
                .filter(reason =>
                    reason.description.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
                    !newReasons.some(r => r.id === reason.id)
                )
                .slice(0, 5);
            setSearchResults(filtered);
        }
    }, [searchTerm, causes]);

    useEffect(() => {
        if (clickedResults.length !== searchResults.length) {
            setClickedResults(Array(searchResults.length).fill(false));
        }
    }, [searchResults]);

    const handleAddNewReasons = () => {
        const selected = searchResults.filter((_, idx) => clickedResults[idx]);
        const updatedReasons = [...newReasons];

        selected.forEach(r => {
            if (!updatedReasons.some(existing => existing.id === r.id)) {
                updatedReasons.push(r);
            }
        });
        setNewReasons(updatedReasons);
        setClickedResults([]);
        setSearchResults([]);
        setSearchTerm('');
    };


    const handleRemoveNewReason = (id: string) => {
        setNewReasons(newReasons.filter(r => r.id !== id));
    };

    const handleAddReasons = async () => {
        setLoading(true);
        const selected = searchResults.filter((_, idx) => clickedResults[idx]);
        const form: AddUserBoycottForm = {
            user_id: user.user_id,
            company_id: companyId,
            company_name: companyName,
            reasons: newReasons.map(r => ({ cause_id: r.id, cause_desc: r.description })),
            personal_reason: checked ? personalReason : null,
        };
        if(user.paying_user) {
            try {
                const response = await addUserBoycott(form);
                if (onSuccess) onSuccess(response.message);
            } catch (e: any) {
                // api.ts throws parsed JSON or {status, message}
                const status = e?.status ?? e?.statusCode;
                const message =
                    e?.message ||
                    e?.error ||
                    'Something went wrong. Please try again.';
                if (status === 401) {
                    if (onAuthError) onAuthError();   // parent will clear user + reset nav
                    return;
                } else {
                    if (onError) onError(message);    // parent will show ErrorSection
                }
            } finally {
                setLoading(false);
            }
        } else {
            try {
                // get any boycotts already for this company from local storage
                const data = await LocalBoycottStore.load();
                const boycotts: LocalUserBoycott[] = data.user_boycotts; // logic to find in local storage
                const userCauses: LocalUserCause[] = data.user_causes; // logic to find in local storage
                const boycottsForThisCompany = boycotts.filter(rec =>
                    rec.company_id == companyId);
                // check to make sure there isn't already a boycott for this company for this cause
                // OR personal reason
                const alreadyFound: boolean = boycottsForThisCompany.length > 0;
                if(!alreadyFound) {
                    await postAnonymousStat("company", {
                        company_id: companyId,
                        increment: true
                    });
                }
                for(let reason of form.reasons) {
                    let alreadyFoundForReason = false;
                    if(boycottsForThisCompany.length>0) {
                        for(let boycott of boycottsForThisCompany) {
                            if(form.reasons.filter(rec => rec!.cause_id == boycott.cause_id).length>0) {
                                alreadyFoundForReason = true;
                            }
                        }
                    }
                    if(!alreadyFoundForReason) {
                        // logic to add user_boycotts to local storage
                        boycotts.push({
                            company_id: companyId,
                            company_name: companyName,
                            cause_id: reason.cause_id,
                            cause_desc: reason.cause_desc,
                            timestamp: new Date().toISOString()
                        });
                        // if this user is not already following this cause
                        if(userCauses.filter(rec => rec.cause_id == reason.cause_id)
                            .length==0) {
                            userCauses.push({
                                cause_id: reason.cause_id,
                                cause_desc: reason.cause_desc,
                                timestamp: new Date().toISOString()
                            });
                            await postAnonymousStat("cause", {
                                cause_id: reason.cause_id,
                                increment: true
                            });
                        }
                        await postAnonymousStat("cause_company", {
                            cause_id: reason.cause_id,
                            company_id: companyId,
                            cause_desc: reason.cause_desc,
                            company_name: companyName,
                            increment: true
                        });
                    }
                    else {
                        //console.log("already found the reason");
                    }
                }
                // now do any personal reason
                if(form.personal_reason!=null && form.personal_reason.length>0) {
                    boycotts.push({
                        company_id: companyId,
                        company_name: companyName,
                        personal_reason: form.personal_reason,
                        timestamp: new Date().toISOString()
                    });
                }
                data.user_boycotts = boycotts;
                data.user_causes = userCauses;
                await LocalBoycottStore.save(data);
                //await LocalBoycottStore.clear();
                if (onSuccess) onSuccess("boycott added successfully");
            } catch (e: any) {
                // local storage failure: never log out; show persistent error
                const msg = e?.message || 'Something went wrong. Please try again.';
                if (onError) onError(msg);
            } finally {
                setLoading(false);
            }
        }
    };

    const processChange = async () => {
        if (!submitBoycottUpdate) return;
        let message: ResponseMessage = { status: 200, message: '', devMsg: '' };
        setLoading(true);
        console.log("currentReasons",currentReasons);
        console.log("newReasons",newReasons);
        console.log("",);
        console.log("",);
        const form: UpdateReasonsForm = {
            user_id: user.user_id,
            company_id: companyId,
            company_name: companyName,
            currentReasons: currentReasons.map((rec, index) => ({
                company_cause_id: rec.id.length === 0
                    ? rec.description + "#" + companyId
                    : companyId + "#" + rec.id,
                personal_reason: rec.id.length === 0,
                remove: clickedCurrentReasons[index],
            })),
            newReasons: newReasons.map(r => ({
                cause_id: r.id,
                cause_desc: r.description,
            })),
            personal_reason: checked ? personalReason : null,
        };
        if(user.paying_user) {
            try {
                message = await submitBoycottUpdate(form);
                if (onSuccess) onSuccess(message.message);
            } catch (e: any) {
                // api.ts throws parsed JSON or {status, message}
                const status = e?.status ?? e?.statusCode;
                const message =
                    e?.message ||
                    e?.error ||
                    'Something went wrong. Please try again.';
                if (status === 401) {
                    if (onAuthError) onAuthError();   // parent will clear user + reset nav
                    return;
                } else {
                    if (onError) onError(message);    // parent will show ErrorSection
                }
            } finally {
                setLoading(false);
            }
        } else {
            try {
                // very complex: updating a boycott
                // consists of removing currentReasons and then adding newReasons
                // get all current user_causes from local storage
                const data = await LocalBoycottStore.load();
                let boycotts: LocalUserBoycott[] = data.user_boycotts; // logic to find in local storage
                const userCauses: LocalUserCause[] = data.user_causes; // logic to find in local storage
                // currentReasons from local storage
                for(let currentReason of form.currentReasons) {
                    // remove from local storage
                    // we have to take the company_cause_id from each currentReason
                    // and extract
                    // update cause_company_stats
                    if(currentReason.remove) {
                        if(!currentReason.personal_reason) {
                            const company_id = currentReason.company_cause_id.slice(0,
                                currentReason.company_cause_id.indexOf("#"));
                            const cause_id = currentReason.company_cause_id.slice(
                                currentReason.company_cause_id.indexOf("#")+1);
                            // keep the boycotts for other companies and the ones for this company and not this cause
                            boycotts = boycotts.filter(rec => rec.company_id === company_id &&
                                rec.cause_id != cause_id || rec.company_id != company_id);
                            await postAnonymousStat("cause_company", {
                                cause_id: cause_id,
                                company_id: company_id,
                                company_name: companyName,
                                increment: false
                            });
                        } else {
                            const personal_reason = currentReason.company_cause_id.slice(0,
                                currentReason.company_cause_id.indexOf("#"));
                            const company_id = currentReason.company_cause_id.slice(
                                currentReason.company_cause_id.indexOf("#")+1);
                            // keep the boycotts for other companies and the ones for this company and not this personal_reason
                            boycotts = boycotts.filter(rec => rec.company_id === company_id &&
                                rec.personal_reason != personal_reason || rec.company_id != company_id);
                        }
                    }
                    // dropping a boycott doesn't need to remove user_causes or change to the causes table
                }
                // now add newReasons
                for(let newReason of form.newReasons) {
                    // addNewReasons to local storage
                    // first check to make sure there isn't one already
                    const tempBoycotts = boycotts.filter(rec =>
                        rec.company_id === companyId && rec.cause_id!=null && rec.cause_id === newReason.cause_id);
                    if(tempBoycotts.length==0) {
                        boycotts.push({
                            company_id: companyId,
                            company_name: companyName,
                            cause_id: newReason.cause_id,
                            cause_desc: newReason.cause_desc,
                            timestamp: new Date().toISOString()
                        })
                        // update cause_company_stats
                        await postAnonymousStat("cause_company", {
                            cause_id: newReason.cause_id,
                            company_id: companyId,
                            cause_desc: newReason.cause_desc,
                            company_name: companyName,
                            increment: true
                        });
                        // if it is a newly followed cause
                        if(userCauses.filter(item => newReason.cause_id == item.cause_id).length==0) {
                            // insertUserCause into local storage
                            userCauses.push({
                                cause_id: newReason.cause_id,
                                cause_desc: newReason.cause_desc,
                                timestamp: new Date().toISOString()
                            })
                            // incrementCauseFollowerCount
                            await postAnonymousStat("cause", {
                                cause_id: newReason.cause_id,
                                increment: true
                            });
                        }
                    }
                }
                // do the new personal reason
                if(form.personal_reason!=null&&form.personal_reason.length>0) {
                    boycotts.push({
                        company_id: companyId,
                        company_name: companyName,
                        personal_reason: form.personal_reason,
                        timestamp: new Date().toISOString()
                    });
                }
                // now resave the data
                data.user_boycotts = boycotts;
                data.user_causes = userCauses;
                await LocalBoycottStore.save(data);
                // if they just deleted all of the currentReasons and didn't add any newReasons
                // then they basically removed the boycott
                if(boycotts.length==0) {
                    await postAnonymousStat("company", {
                        company_id: companyId,
                        increment: false
                    });
                }
                if (onSuccess) onSuccess("boycott updated successfully.");
            } catch (e: any) {
                // local storage failure: never log out; show persistent error
                const msg = e?.message || 'Something went wrong. Please try again.';
                if (onError) onError(msg);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <View style={sharedStyles.boycottContainer}>
        {
            !isAddMode && (
            <>
                <Text style={sharedStyles.centeredText}>reasons to boycott</Text>
                <SelectableCompanyCausesList
                    items={currentReasons}
                    clickedItems={clickedCurrentReasons}
                    setClickedItems={setClickedCurrentReasons}
                    heading="reasons to boycott"
                    reasonList={true}
                />
            </>
            )
        }
        <Text style={sharedStyles.centeredText}>add more reasons to boycott</Text>
        <NewReasonsList
            newReasons={newReasons}
            onRemove={handleRemoveNewReason}
        />
        <FormTextField
            labelText={isAddMode ? 'why are you boycotting?' : 'search for more reasons'}
            labelMarginTop={SS_SEACRH_TOP_MARGIN}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="what reasons"
            hideLabel={false}
            width={0.82}
            paddingHorizontal={0.0}
        />
        <SelectableCompanyCausesList
            items={searchResults}
            clickedItems={clickedResults}
            setClickedItems={setClickedResults}
            heading="List of Causes"
            reasonList={true}
        />
        <View style={sharedStyles.checkboxContainer}>
            <CustomCheckbox
                checked={checked}
                setCheck={() => setChecked(!checked)}
                text="personal reasons"
                leftMargin={0.0}
                topMargin={0.01}
            />
        </View>
        {
            checked && (
            <FormTextField
                labelText=""
                labelMarginTop={SS_REASON_TOP_MARGIN}
                value={personalReason}
                onChangeText={setPersonalReason}
                placeholder="what reason"
                hideLabel={true}
                width={0.82}
                paddingHorizontal={0.0}
            />
            )
        }
        {
            clickedResults.some(Boolean) && (
            <View style={sharedStyles.addBtn}>
                <ConditionalButton
                    text="add"
                    color={YELLOW}
                    widthPercent={SS_SAVE_BTN_WIDTH}
                    heightPercent={SS_SAVE_BTN_HEIGHT}
                    marginTopPercent={SS_SAVE_BTN_TOP_MARGIN}
                    onPress={handleAddNewReasons}
                    hasItems={clickedResults.some(Boolean)}
                />
            </View>
            )
        }
        {
            hasReasonsToBoycott && (
                <View style={sharedStyles.saveBtnContainer}>
                    <View style={sharedStyles.saveBtn}>
                        <ConditionalButton
                            text="save"
                            color={SUCCESS_GREEN}
                            widthPercent={SS_SAVE_BTN_WIDTH}
                            heightPercent={SS_SAVE_BTN_HEIGHT}
                            marginTopPercent={SS_SAVE_BTN_TOP_MARGIN}
                            onPress={isAddMode ? handleAddReasons : processChange}
                            hasItems={!disable&&hasReasonsToBoycott}
                        />
                    </View>
                </View>
            )
        }

        <View style={sharedStyles.cancelBtn}>
            <ConditionalButton
                text="cancel"
                color={DELETE_RED}
                widthPercent={SS_SAVE_BTN_WIDTH}
                heightPercent={SS_SAVE_BTN_HEIGHT}
                marginTopPercent={SS_SAVE_BTN_TOP_MARGIN}
                onPress={onCancel}
                hasItems={true}
            />
        </View>
    </View>
    )
}
