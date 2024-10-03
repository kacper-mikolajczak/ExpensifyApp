import React, {useCallback, useState} from 'react';
import {useOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormInputErrors, FormOnyxValues} from '@components/Form/types';
import PushRowWithModal from '@components/PushRowWithModal';
import Text from '@components/Text';
import TextInput from '@components/TextInput';
import useLocalize from '@hooks/useLocalize';
import useReimbursementAccountStepFormSubmit from '@hooks/useReimbursementAccountStepFormSubmit';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ValidationUtils from '@libs/ValidationUtils';
import * as FormActions from '@userActions/FormActions';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/ReimbursementAccountForm';

type PhoneNumberProps = SubStepProps;

const {COUNTRY_CODE, BUSINESS_CONTACT_NUMBER} = INPUT_IDS.ADDITIONAL_DATA.CORPAY;

const STEP_FIELDS = [COUNTRY_CODE, BUSINESS_CONTACT_NUMBER];

function PhoneNumber({onNext, isEditing}: PhoneNumberProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [reimbursementAccount] = useOnyx(ONYXKEYS.REIMBURSEMENT_ACCOUNT);
    const [reimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);

    const businessStepCountryCodeDraftValue = reimbursementAccount?.achData?.additionalData?.corpay?.[COUNTRY_CODE] ?? reimbursementAccountDraft?.[COUNTRY_CODE] ?? '';

    const countryStepCountryDraftValue = reimbursementAccountDraft?.[INPUT_IDS.ADDITIONAL_DATA.COUNTRY] ?? '';
    const countryCodeInitialValue =
        businessStepCountryCodeDraftValue !== '' && businessStepCountryCodeDraftValue !== countryStepCountryDraftValue ? businessStepCountryCodeDraftValue : countryStepCountryDraftValue;

    const phoneNumberDefaultValue = reimbursementAccount?.achData?.additionalData?.corpay?.[BUSINESS_CONTACT_NUMBER] ?? reimbursementAccountDraft?.[BUSINESS_CONTACT_NUMBER] ?? '';

    const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodeInitialValue);

    const handleSelectingCountryCode = (countryCode: string) => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM, {[COUNTRY_CODE]: countryCode});
        setSelectedCountryCode(countryCode);
    };

    const validate = useCallback((values: FormOnyxValues<typeof ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM>): FormInputErrors<typeof ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM> => {
        return ValidationUtils.getFieldRequiredErrors(values, STEP_FIELDS);
    }, []);

    const handleSubmit = useReimbursementAccountStepFormSubmit({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')}
            onSubmit={handleSubmit}
            validate={validate}
            style={[styles.flexGrow1]}
            submitButtonStyles={[styles.mh5]}
        >
            <Text style={[styles.textHeadlineLineHeightXXL, styles.mh5, styles.mb3]}>{translate('businessInfoStep.whatsTheBusinessPhone')}</Text>
            <PushRowWithModal
                optionsList={CONST.COUNTRY_PHONE_NUMBER_CODES}
                selectedOption={selectedCountryCode}
                onOptionChange={handleSelectingCountryCode}
                description={translate('businessInfoStep.countryCode')}
                modalHeaderTitle={translate('businessInfoStep.selectCountryCode')}
                searchInputTitle={translate('businessInfoStep.findCountryCode')}
            />
            <InputWrapper
                InputComponent={TextInput}
                label={translate('common.phoneNumber')}
                aria-label={translate('common.phoneNumber')}
                role={CONST.ROLE.PRESENTATION}
                inputMode={CONST.INPUT_MODE.TEL}
                inputID={BUSINESS_CONTACT_NUMBER}
                containerStyles={[styles.mt5, styles.mh5]}
                defaultValue={phoneNumberDefaultValue}
                shouldSaveDraft={!isEditing}
            />
        </FormProvider>
    );
}

PhoneNumber.displayName = 'PhoneNumber';

export default PhoneNumber;
