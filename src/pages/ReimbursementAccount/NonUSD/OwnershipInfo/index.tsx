import {Str} from 'expensify-common';
import type {ComponentType} from 'react';
import React, {useState} from 'react';
import {View} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import InteractiveStepSubHeader from '@components/InteractiveStepSubHeader';
import ScreenWrapper from '@components/ScreenWrapper';
import useLocalize from '@hooks/useLocalize';
import useSubStep from '@hooks/useSubStep';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import * as FormActions from '@userActions/FormActions';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';
import OwnerCheck from './OwnerCheck';
import Address from './OwnerDetailsFormSubSteps/Address';
import Confirmation from './OwnerDetailsFormSubSteps/Confirmation';
import DateOfBirth from './OwnerDetailsFormSubSteps/DateOfBirth';
import Last4SSN from './OwnerDetailsFormSubSteps/Last4SSN';
import Name from './OwnerDetailsFormSubSteps/Name';
import OwnershipPercentage from './OwnerDetailsFormSubSteps/OwnershipPercentage';
import OwnersList from './OwnersList';
import UploadOwnershipChart from './UploadOwnershipChart';

type OwnershipInfoProps = {
    /** Handles back button press */
    onBackButtonPress: () => void;

    /** Handles submit button press */
    onSubmit: () => void;
};

const OWNERSHIP_INFO_STEP_KEY = INPUT_IDS.OWNERSHIP_INFO_STEP;
const {FIRST_NAME, LAST_NAME, OWNERSHIP_PERCENTAGE, DOB, SSN_LAST_4, STREET, CITY, STATE, ZIP_CODE, COUNTRY} = CONST.NON_USD_BANK_ACCOUNT.OWNERSHIP_INFO_STEP.OWNER_DATA;
const SUBSTEP = CONST.NON_USD_BANK_ACCOUNT.OWNERSHIP_INFO_STEP.SUBSTEP;

type OwnerDetailsFormProps = SubStepProps & {
    ownerBeingModifiedID: string;
    setOwnerBeingModifiedID?: (id: string) => void;
    isUserEnteringHisOwnData: boolean;
    totalOwnedPercentage: Record<string, number>;
    setTotalOwnedPercentage: (ownedPercentage: Record<string, number>) => void;
};

const bodyContent: Array<ComponentType<OwnerDetailsFormProps>> = [Name, OwnershipPercentage, DateOfBirth, Address, Last4SSN, Confirmation];

function OwnershipInfo({onBackButtonPress, onSubmit}: OwnershipInfoProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const [ownerKeys, setOwnerKeys] = useState<string[]>([]);
    const [ownerBeingModifiedID, setOwnerBeingModifiedID] = useState('currentUser');
    const [isEditingCreatedOwner, setIsEditingCreatedOwner] = useState(false);
    const [isUserEnteringHisOwnData, setIsUserEnteringHisOwnData] = useState(false);
    const [isUserOwner, setIsUserOwner] = useState(false);
    const [isAnyoneElseOwner, setIsAnyoneElseOwner] = useState(false);
    const [currentSubStep, setCurrentSubStep] = useState<number>(SUBSTEP.IS_USER_OWNER);
    const [totalOwnedPercentage, setTotalOwnedPercentage] = useState<Record<string, number>>({});
    const companyName = nonUSDReimbursementAccountDraft?.[INPUT_IDS.BUSINESS_INFO_STEP.NAME] ?? '';

    const [reimbursementAccount] = useOnyx(ONYXKEYS.REIMBURSEMENT_ACCOUNT);
    const policyID = reimbursementAccount?.achData?.policyID ?? '-1';
    const [policy] = useOnyx(`${ONYXKEYS.COLLECTION.POLICY}${policyID}`);
    const currency = policy?.outputCurrency ?? '';

    const totalOwnedPercentageSum = Object.values(totalOwnedPercentage).reduce((acc, value) => acc + value, 0);
    const canAddMoreOwners = totalOwnedPercentageSum <= 75;

    const submit = () => {
        const ownerFields = [FIRST_NAME, LAST_NAME, OWNERSHIP_PERCENTAGE, DOB, SSN_LAST_4, STREET, CITY, STATE, ZIP_CODE, COUNTRY];
        const owners = ownerKeys.map((ownerKey) =>
            ownerFields.reduce((acc, fieldName) => {
                acc[fieldName] = nonUSDReimbursementAccountDraft?.[`owner_${ownerKey}_${fieldName}`] ?? undefined;
                return acc;
            }, {} as Record<string, string | undefined>),
        );

        FormActions.setDraftValues(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM, {
            [OWNERSHIP_INFO_STEP_KEY.OWNS_MORE_THAN_25_PERCENT]: isUserOwner,
            [OWNERSHIP_INFO_STEP_KEY.HAS_OTHER_OWNERS]: isAnyoneElseOwner,
            [OWNERSHIP_INFO_STEP_KEY.OWNERS]: JSON.stringify(owners),
        });
        onSubmit();
    };

    const addOwner = (ownerID: string) => {
        const newOwners = [...ownerKeys, ownerID];

        setOwnerKeys(newOwners);
    };

    const handleOwnerDetailsFormSubmit = () => {
        const isFreshOwner = ownerKeys.find((ownerID) => ownerID === ownerBeingModifiedID && ownerID !== 'currentUser') === undefined;

        if (isFreshOwner) {
            addOwner(ownerBeingModifiedID);
        }

        let nextSubStep;
        if (isEditingCreatedOwner || !canAddMoreOwners) {
            nextSubStep = currency === CONST.CURRENCY.AUD ? SUBSTEP.OWNERSHIP_CHART : SUBSTEP.OWNERS_LIST;
        } else {
            nextSubStep = SUBSTEP.ARE_THERE_MORE_OWNERS;
        }

        setCurrentSubStep(nextSubStep);
        setIsEditingCreatedOwner(false);
    };

    const {
        componentToRender: OwnerDetailsForm,
        isEditing,
        screenIndex,
        nextScreen,
        prevScreen,
        moveTo,
        resetScreenIndex,
        goToTheLastStep,
    } = useSubStep<OwnerDetailsFormProps>({bodyContent, startFrom: 0, onFinished: handleOwnerDetailsFormSubmit});

    const prepareOwnerDetailsForm = () => {
        const ownerID = Str.guid();
        setOwnerBeingModifiedID(ownerID);
        resetScreenIndex();
        setCurrentSubStep(SUBSTEP.OWNER_DETAILS_FORM);
    };

    const handleOwnerEdit = (ownerID: string) => {
        setOwnerBeingModifiedID(ownerID);
        setIsEditingCreatedOwner(true);
        setCurrentSubStep(SUBSTEP.OWNER_DETAILS_FORM);
    };

    const handleOwnershipChartSubmit = () => {
        // upload chart
        setCurrentSubStep(SUBSTEP.OWNERS_LIST);
    };

    const handleOwnershipChartEdit = () => {
        setCurrentSubStep(SUBSTEP.OWNERSHIP_CHART);
    };

    const handleBackButtonPress = () => {
        if (isEditing) {
            goToTheLastStep();
            return;
        }

        if (currentSubStep === SUBSTEP.IS_USER_OWNER) {
            onBackButtonPress();
        } else if (currentSubStep === SUBSTEP.OWNERS_LIST && !canAddMoreOwners) {
            setCurrentSubStep(SUBSTEP.IS_ANYONE_ELSE_OWNER);
        } else if (currentSubStep === SUBSTEP.OWNERS_LIST && isAnyoneElseOwner) {
            setCurrentSubStep(SUBSTEP.ARE_THERE_MORE_OWNERS);
        } else if (currentSubStep === SUBSTEP.OWNERS_LIST && isUserOwner && !isAnyoneElseOwner) {
            setCurrentSubStep(SUBSTEP.IS_ANYONE_ELSE_OWNER);
        } else if (currentSubStep === SUBSTEP.IS_ANYONE_ELSE_OWNER) {
            setCurrentSubStep(SUBSTEP.IS_USER_OWNER);
        } else if (currentSubStep === SUBSTEP.OWNER_DETAILS_FORM && screenIndex > 0) {
            prevScreen();
        } else if (currentSubStep === SUBSTEP.OWNERSHIP_CHART && canAddMoreOwners) {
            setCurrentSubStep(SUBSTEP.ARE_THERE_MORE_OWNERS);
        } else if (currentSubStep === SUBSTEP.OWNERSHIP_CHART && !canAddMoreOwners) {
            setCurrentSubStep(SUBSTEP.OWNER_DETAILS_FORM);
        } else {
            setCurrentSubStep((subStep) => subStep - 1);
        }
    };

    const handleNextSubStep = (value: boolean) => {
        if (currentSubStep === SUBSTEP.IS_USER_OWNER) {
            if (value) {
                setIsUserOwner(value);
                setIsUserEnteringHisOwnData(value);
                setCurrentSubStep(SUBSTEP.OWNER_DETAILS_FORM);
                return;
            }

            setIsUserOwner(value);
            setIsUserEnteringHisOwnData(value);

            // User is an owner but there are 4 other owners already added, so we remove last one
            if (value && ownerKeys.length === 4) {
                setOwnerKeys((previousBeneficialOwners) => previousBeneficialOwners.slice(0, 3));
            }

            setCurrentSubStep(SUBSTEP.IS_ANYONE_ELSE_OWNER);
            return;
        }

        if (currentSubStep === SUBSTEP.IS_ANYONE_ELSE_OWNER) {
            setIsAnyoneElseOwner(value);
            setIsUserEnteringHisOwnData(false);

            if (!canAddMoreOwners && value) {
                setCurrentSubStep(SUBSTEP.OWNERS_LIST);
                return;
            }

            if (canAddMoreOwners && value) {
                prepareOwnerDetailsForm();
                return;
            }

            // User is not an owner and no one else is an owner
            if (!isUserOwner && !value) {
                if (currency === CONST.CURRENCY.AUD) {
                    setCurrentSubStep(SUBSTEP.OWNERSHIP_CHART);
                    return;
                }

                submit();
                return;
            }

            // User is an owner and no one else is an owner
            if (isUserOwner && !value) {
                prepareOwnerDetailsForm();
                return;
            }
        }

        // Are there more UBOs
        if (currentSubStep === SUBSTEP.ARE_THERE_MORE_OWNERS) {
            if (value) {
                setIsAnyoneElseOwner(true);
                prepareOwnerDetailsForm();
                return;
            }

            if (currency === 'AUD') {
                setCurrentSubStep(SUBSTEP.OWNERSHIP_CHART);
                return;
            }

            setCurrentSubStep(SUBSTEP.OWNERS_LIST);
            return;
        }

        // User reached the limit of UBOs
        if (currentSubStep === SUBSTEP.OWNER_DETAILS_FORM && !canAddMoreOwners) {
            setCurrentSubStep(SUBSTEP.OWNERS_LIST);
        }
    };

    return (
        <ScreenWrapper
            testID={OwnershipInfo.displayName}
            includeSafeAreaPaddingBottom={false}
            shouldEnablePickerAvoiding={false}
            shouldEnableMaxHeight
        >
            <HeaderWithBackButton
                onBackButtonPress={handleBackButtonPress}
                title={translate('ownershipInfoStep.ownerInfo')}
            />
            <View style={[styles.ph5, styles.mb5, styles.mt3, {height: CONST.NON_USD_BANK_ACCOUNT.STEP_HEADER_HEIGHT}]}>
                <InteractiveStepSubHeader
                    startStepIndex={3}
                    stepNames={CONST.NON_USD_BANK_ACCOUNT.STEP_NAMES}
                />
            </View>

            {currentSubStep === SUBSTEP.IS_USER_OWNER && (
                <OwnerCheck
                    title={translate('ownershipInfoStep.doYouOwn', {companyName})}
                    defaultValue={isUserOwner}
                    onSelectedValue={handleNextSubStep}
                />
            )}

            {currentSubStep === SUBSTEP.IS_ANYONE_ELSE_OWNER && (
                <OwnerCheck
                    title={translate('ownershipInfoStep.doesAnyoneOwn', {companyName})}
                    defaultValue={isAnyoneElseOwner}
                    onSelectedValue={handleNextSubStep}
                />
            )}

            {currentSubStep === SUBSTEP.OWNER_DETAILS_FORM && (
                <OwnerDetailsForm
                    isEditing={isEditing}
                    onNext={nextScreen}
                    onMove={moveTo}
                    ownerBeingModifiedID={ownerBeingModifiedID}
                    setOwnerBeingModifiedID={setOwnerBeingModifiedID}
                    isUserEnteringHisOwnData={isUserEnteringHisOwnData}
                    totalOwnedPercentage={totalOwnedPercentage}
                    setTotalOwnedPercentage={setTotalOwnedPercentage}
                />
            )}

            {currentSubStep === SUBSTEP.ARE_THERE_MORE_OWNERS && (
                <OwnerCheck
                    title={translate('ownershipInfoStep.areThereOther', {companyName})}
                    defaultValue={false}
                    onSelectedValue={handleNextSubStep}
                />
            )}

            {currentSubStep === SUBSTEP.OWNERSHIP_CHART && <UploadOwnershipChart onSubmit={handleOwnershipChartSubmit} />}

            {currentSubStep === SUBSTEP.OWNERS_LIST && (
                <OwnersList
                    handleConfirmation={submit}
                    handleOwnerEdit={handleOwnerEdit}
                    handleOwnershipChartEdit={handleOwnershipChartEdit}
                    ownerKeys={ownerKeys}
                />
            )}
        </ScreenWrapper>
    );
}

OwnershipInfo.displayName = 'OwnershipInfo';

export default OwnershipInfo;
