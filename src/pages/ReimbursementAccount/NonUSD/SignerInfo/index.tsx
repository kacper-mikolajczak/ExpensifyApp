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
import Navigation from '@navigation/Navigation';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import DirectorCheck from './DirectorCheck';
import EnterEmail from './EnterEmail';
import HangTight from './HangTight';
import Confirmation from './substeps/Confirmation';
import DateOfBirth from './substeps/DateOfBirth';
import JobTitle from './substeps/JobTitle';
import Name from './substeps/Name';
import UploadDocuments from './substeps/UploadDocuments';

type SignerInfoProps = {
    /** Handles back button press */
    onBackButtonPress: () => void;

    /** Handles submit button press */
    onSubmit: () => void;
};

const SUBSTEP = CONST.NON_USD_BANK_ACCOUNT.SIGNER_INFO_STEP.SUBSTEP;

const bodyContent: Array<ComponentType<SubStepProps>> = [Name, JobTitle, DateOfBirth, UploadDocuments, Confirmation];

function SignerInfo({onBackButtonPress, onSubmit}: SignerInfoProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const [reimbursementAccount] = useOnyx(ONYXKEYS.REIMBURSEMENT_ACCOUNT);
    const policyID = reimbursementAccount?.achData?.policyID ?? '-1';
    const [policy] = useOnyx(`${ONYXKEYS.COLLECTION.POLICY}${policyID}`);
    const currency = policy?.outputCurrency ?? '';

    const [currentSubStep, setCurrentSubStep] = useState<number>(SUBSTEP.IS_DIRECTOR);
    const [isUserDirector, setIsUserDirector] = useState(false);

    const submit = () => {
        if (currency === 'AUD') {
            setCurrentSubStep(SUBSTEP.ENTER_EMAIL);
        } else {
            onSubmit();
        }
    };

    const handleNextSubStep = (value: boolean) => {
        if (currentSubStep !== SUBSTEP.IS_DIRECTOR) {
            return;
        }

        // user is director
        if (value) {
            setIsUserDirector(value);
            setCurrentSubStep(SUBSTEP.SIGNER_DETAILS_FORM);
            return;
        }

        setIsUserDirector(value);
        setCurrentSubStep(SUBSTEP.ENTER_EMAIL);
    };

    const {componentToRender: SignerDetailsForm, isEditing, screenIndex, nextScreen, prevScreen, moveTo, goToTheLastStep} = useSubStep({bodyContent, startFrom: 0, onFinished: submit});

    const handleBackButtonPress = () => {
        if (isEditing) {
            goToTheLastStep();
            return;
        }

        if (currentSubStep === SUBSTEP.IS_DIRECTOR) {
            onBackButtonPress();
        } else if (currentSubStep === SUBSTEP.ENTER_EMAIL && isUserDirector) {
            setCurrentSubStep(SUBSTEP.SIGNER_DETAILS_FORM);
        } else if (currentSubStep === SUBSTEP.SIGNER_DETAILS_FORM && screenIndex > 0) {
            prevScreen();
        } else if (currentSubStep === SUBSTEP.HANG_TIGHT) {
            Navigation.goBack();
        } else {
            setCurrentSubStep((subStep) => subStep - 1);
        }
    };

    const handleEmailSubmit = () => {
        setCurrentSubStep(SUBSTEP.HANG_TIGHT);
    };

    return (
        <ScreenWrapper
            testID={SignerInfo.displayName}
            includeSafeAreaPaddingBottom={false}
            shouldEnablePickerAvoiding={false}
            shouldEnableMaxHeight
        >
            <HeaderWithBackButton
                onBackButtonPress={handleBackButtonPress}
                title={translate('signerInfoStep.signerInfo')}
            />
            <View style={[styles.ph5, styles.mb5, styles.mt3, {height: CONST.NON_USD_BANK_ACCOUNT.STEP_HEADER_HEIGHT}]}>
                <InteractiveStepSubHeader
                    startStepIndex={4}
                    stepNames={CONST.NON_USD_BANK_ACCOUNT.STEP_NAMES}
                />
            </View>

            {currentSubStep === SUBSTEP.IS_DIRECTOR && (
                <DirectorCheck
                    title={translate('signerInfoStep.areYouDirector')}
                    defaultValue={isUserDirector}
                    onSelectedValue={handleNextSubStep}
                />
            )}

            {currentSubStep === SUBSTEP.SIGNER_DETAILS_FORM && (
                <SignerDetailsForm
                    isEditing={isEditing}
                    onNext={nextScreen}
                    onMove={moveTo}
                />
            )}

            {currentSubStep === SUBSTEP.ENTER_EMAIL && (
                <EnterEmail
                    onSubmit={handleEmailSubmit}
                    isUserDirector={isUserDirector}
                />
            )}

            {currentSubStep === SUBSTEP.HANG_TIGHT && <HangTight tempSubmit={onSubmit} />}
        </ScreenWrapper>
    );
}

SignerInfo.displayName = 'SignerInfo';

export default SignerInfo;
