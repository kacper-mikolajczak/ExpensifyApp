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

const SUBSTEP = CONST.NON_USD_BANK_ACCOUNT.OWNERSHIP_INFO_STEP.SUBSTEP;

type OwnerDetailsFormProps = SubStepProps & {ownerBeingModifiedID: string; setOwnerBeingModifiedID?: (id: string) => void; isUserEnteringHisOwnData: boolean};

const bodyContent: Array<ComponentType<OwnerDetailsFormProps>> = [Name, OwnershipPercentage, DateOfBirth, Address, Last4SSN, Confirmation];

function OwnershipInfo({onBackButtonPress, onSubmit}: OwnershipInfoProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const [ownerKeys, setOwnerKeys] = useState<string[]>([]);
    const [ownerBeingModifiedID, setOwnerBeingModifiedID] = useState('');
    const [isEditingCreatedOwner, setIsEditingCreatedOwner] = useState(false);
    const [isUserEnteringHisOwnData, setIsUserEnteringHisOwnData] = useState(false);
    const [isUserOwner, setIsUserOwner] = useState(false);
    const [isAnyoneElseOwner, setIsAnyoneElseOwner] = useState(false);
    const [currentSubStep, setCurrentSubStep] = useState<number>(SUBSTEP.IS_USER_OWNER);
    const companyName = nonUSDReimbursementAccountDraft?.[INPUT_IDS.BUSINESS_INFO_STEP.NAME] ?? '';

    const [reimbursementAccount] = useOnyx(ONYXKEYS.REIMBURSEMENT_ACCOUNT);
    const policyID = reimbursementAccount?.achData?.policyID ?? '-1';
    const [policy] = useOnyx(`${ONYXKEYS.COLLECTION.POLICY}${policyID}`);
    const currency = policy?.outputCurrency ?? '';

    const canAddMoreOwners = true;

    const submit = () => {
        onSubmit();
    };

    const addOwner = (ownerID: string) => {
        const newOwners = [...ownerKeys, ownerID];

        setOwnerKeys(newOwners);
    };

    const handleOwnerDetailsFormSubmit = () => {
        const shouldAddMoreOwners = !ownerKeys.find((ownerID) => ownerID === ownerBeingModifiedID) && canAddMoreOwners;

        if (shouldAddMoreOwners) {
            addOwner(ownerBeingModifiedID);
        }

        const isLastOwnerThatCanBeAdded = false;
        setCurrentSubStep(isEditingCreatedOwner || isLastOwnerThatCanBeAdded ? SUBSTEP.OWNERS_LIST : SUBSTEP.ARE_THERE_MORE_OWNERS);
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
                if (currency === 'AUD') {
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
                />
            )}

            {currentSubStep === SUBSTEP.ARE_THERE_MORE_OWNERS && (
                <OwnerCheck
                    title={translate('ownershipInfoStep.areThereOther', {companyName})}
                    defaultValue={isUserOwner}
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
                    isAnyoneElseOwner={isAnyoneElseOwner}
                />
            )}
        </ScreenWrapper>
    );
}

OwnershipInfo.displayName = 'OwnershipInfo';

export default OwnershipInfo;
