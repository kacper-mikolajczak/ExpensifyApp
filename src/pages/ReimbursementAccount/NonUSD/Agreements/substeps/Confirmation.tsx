import React from 'react';
import CheckboxWithLabel from '@components/CheckboxWithLabel';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import Text from '@components/Text';
import TextLink from '@components/TextLink';
import useLocalize from '@hooks/useLocalize';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

const AGREEMENTS_STEP_KEY = INPUT_IDS.AGREEMENT_STEP;

function IsAuthorizedToUseBankAccountLabel() {
    const {translate} = useLocalize();
    return <Text>{translate('agreementsStep.iAmAuthorized')}</Text>;
}

function CertifyTrueAndAccurateLabel() {
    const {translate} = useLocalize();
    return <Text>{translate('agreementsStep.iCertify')}</Text>;
}

function TermsAndConditionsLabel() {
    const {translate} = useLocalize();
    return (
        <Text>
            {translate('common.iAcceptThe')}
            <TextLink href="">{`${translate('agreementsStep.termsAndConditions')}`}</TextLink>
        </Text>
    );
}

function Confirmation({onNext}: SubStepProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM}
            onSubmit={onNext}
            submitButtonText={translate('agreementsStep.accept')}
            style={[styles.mh5, styles.flexGrow1]}
            enabledWhenOffline={false}
        >
            <Text style={[styles.textHeadlineLineHeightXXL]}>{translate('agreementsStep.pleaseConfirm')}</Text>
            <InputWrapper
                InputComponent={CheckboxWithLabel}
                accessibilityLabel={translate('agreementsStep.iAmAuthorized')}
                inputID={AGREEMENTS_STEP_KEY.AUTHORIZED}
                style={styles.mt6}
                LabelComponent={IsAuthorizedToUseBankAccountLabel}
                shouldSaveDraft
            />
            <InputWrapper
                InputComponent={CheckboxWithLabel}
                accessibilityLabel={translate('agreementsStep.iCertify')}
                inputID={AGREEMENTS_STEP_KEY.CERTIFY}
                style={styles.mt6}
                LabelComponent={CertifyTrueAndAccurateLabel}
                shouldSaveDraft
            />
            <InputWrapper
                InputComponent={CheckboxWithLabel}
                accessibilityLabel={`${translate('common.iAcceptThe')} ${translate('agreementsStep.termsAndConditions')}`}
                inputID={AGREEMENTS_STEP_KEY.TERMS}
                style={styles.mt6}
                LabelComponent={TermsAndConditionsLabel}
                shouldSaveDraft
            />
        </FormProvider>
    );
}

Confirmation.displayName = 'Confirmation';

export default Confirmation;
