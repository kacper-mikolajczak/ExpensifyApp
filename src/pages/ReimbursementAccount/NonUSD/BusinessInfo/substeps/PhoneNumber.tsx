import React, {useState} from 'react';
import {useOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import PushRowWithModal from '@components/PushRowWithModal';
import Text from '@components/Text';
import TextInput from '@components/TextInput';
import useLocalize from '@hooks/useLocalize';
import useNonUSDReimbursementAccountStepFormSubmit from '@hooks/useNonUSDReimbursementAccountStepFormSubmit';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import * as FormActions from '@userActions/FormActions';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

type PhoneNumberProps = SubStepProps;

const BUSINESS_INFO_STEP_KEY = INPUT_IDS.BUSINESS_INFO_STEP;

const STEP_FIELDS = [BUSINESS_INFO_STEP_KEY.COUNTRY_CODE, BUSINESS_INFO_STEP_KEY.PHONE];

function PhoneNumber({onNext, isEditing}: PhoneNumberProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);

    const businessStepCountryCodeDraftValue = nonUSDReimbursementAccountDraft?.[BUSINESS_INFO_STEP_KEY.COUNTRY_CODE] ?? '';
    const countryStepCountryDraftValue = nonUSDReimbursementAccountDraft?.[INPUT_IDS.COUNTRY_STEP.COUNTRY] ?? '';
    const countryCodeInitialValue =
        businessStepCountryCodeDraftValue !== '' && businessStepCountryCodeDraftValue !== countryStepCountryDraftValue ? businessStepCountryCodeDraftValue : countryStepCountryDraftValue;

    const phoneNumberDefaultValue = nonUSDReimbursementAccountDraft?.[BUSINESS_INFO_STEP_KEY.PHONE];

    const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodeInitialValue);

    const handleSelectingCountryCode = (countryCode: string) => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM, {[BUSINESS_INFO_STEP_KEY.COUNTRY_CODE]: countryCode});
        setSelectedCountryCode(countryCode);
    };

    const handleSubmit = useNonUSDReimbursementAccountStepFormSubmit({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')}
            onSubmit={handleSubmit}
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
                inputID={BUSINESS_INFO_STEP_KEY.PHONE}
                containerStyles={[styles.mt5, styles.mh5]}
                defaultValue={phoneNumberDefaultValue}
                shouldSaveDraft={!isEditing}
            />
        </FormProvider>
    );
}

PhoneNumber.displayName = 'PhoneNumber';

export default PhoneNumber;
