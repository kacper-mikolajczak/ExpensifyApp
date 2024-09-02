import React, {useCallback} from 'react';
import {useOnyx} from 'react-native-onyx';
import CheckboxWithLabel from '@components/CheckboxWithLabel';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormInputErrors, FormOnyxValues} from '@components/Form/types';
import Text from '@components/Text';
import TextLink from '@components/TextLink';
import useLocalize from '@hooks/useLocalize';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ValidationUtils from '@libs/ValidationUtils';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

const {AUTHORIZED, CERTIFY, TERMS} = INPUT_IDS.AGREEMENT_STEP;
const STEP_FIELDS = [AUTHORIZED, CERTIFY, TERMS];

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
    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);

    const defaultValues = {
        [AUTHORIZED]: nonUSDReimbursementAccountDraft?.[AUTHORIZED] ?? false,
        [CERTIFY]: nonUSDReimbursementAccountDraft?.[CERTIFY] ?? false,
        [TERMS]: nonUSDReimbursementAccountDraft?.[TERMS] ?? false,
    };

    const validate = useCallback(
        (values: FormOnyxValues<typeof ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM>): FormInputErrors<typeof ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM> => {
            const errors = ValidationUtils.getFieldRequiredErrors(values, STEP_FIELDS);

            if (!ValidationUtils.isRequiredFulfilled(values[AUTHORIZED])) {
                errors[AUTHORIZED] = translate('agreementsStep.error.authorized');
            }

            if (!ValidationUtils.isRequiredFulfilled(values[CERTIFY])) {
                errors[CERTIFY] = translate('agreementsStep.error.certify');
            }

            if (!ValidationUtils.isRequiredFulfilled(values[TERMS])) {
                errors[TERMS] = translate('common.error.acceptTerms');
            }

            return errors;
        },
        [translate],
    );

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM}
            onSubmit={onNext}
            validate={validate}
            submitButtonText={translate('agreementsStep.accept')}
            style={[styles.mh5, styles.flexGrow1]}
            enabledWhenOffline={false}
        >
            <Text style={[styles.textHeadlineLineHeightXXL]}>{translate('agreementsStep.pleaseConfirm')}</Text>
            <InputWrapper
                InputComponent={CheckboxWithLabel}
                accessibilityLabel={translate('agreementsStep.iAmAuthorized')}
                inputID={AUTHORIZED}
                style={styles.mt6}
                LabelComponent={IsAuthorizedToUseBankAccountLabel}
                defaultValue={defaultValues[AUTHORIZED]}
                shouldSaveDraft
            />
            <InputWrapper
                InputComponent={CheckboxWithLabel}
                accessibilityLabel={translate('agreementsStep.iCertify')}
                inputID={CERTIFY}
                style={styles.mt6}
                LabelComponent={CertifyTrueAndAccurateLabel}
                defaultValue={defaultValues[CERTIFY]}
                shouldSaveDraft
            />
            <InputWrapper
                InputComponent={CheckboxWithLabel}
                accessibilityLabel={`${translate('common.iAcceptThe')} ${translate('agreementsStep.termsAndConditions')}`}
                inputID={TERMS}
                style={styles.mt6}
                LabelComponent={TermsAndConditionsLabel}
                defaultValue={defaultValues[TERMS]}
                shouldSaveDraft
            />
        </FormProvider>
    );
}

Confirmation.displayName = 'Confirmation';

export default Confirmation;
