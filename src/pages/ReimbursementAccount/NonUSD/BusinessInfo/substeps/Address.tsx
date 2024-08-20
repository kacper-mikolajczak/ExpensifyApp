import React, {useState} from 'react';
import {useOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import PushRowWithModal from '@components/PushRowWithModal';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useNonUSDReimbursementAccountStepFormSubmit from '@hooks/useNonUSDReimbursementAccountStepFormSubmit';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import AddressFormFields from '@pages/ReimbursementAccount/AddressFormFields';
import * as FormActions from '@userActions/FormActions';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

type NameProps = SubStepProps;

const BUSINESS_INFO_STEP_KEY = INPUT_IDS.BUSINESS_INFO_STEP;

const INPUT_KEYS = {
    street: BUSINESS_INFO_STEP_KEY.STREET,
    city: BUSINESS_INFO_STEP_KEY.CITY,
    state: BUSINESS_INFO_STEP_KEY.STATE,
    zipCode: BUSINESS_INFO_STEP_KEY.ZIP_CODE,
};
const STEP_FIELDS = [BUSINESS_INFO_STEP_KEY.STREET, BUSINESS_INFO_STEP_KEY.CITY, BUSINESS_INFO_STEP_KEY.STATE, BUSINESS_INFO_STEP_KEY.ZIP_CODE, BUSINESS_INFO_STEP_KEY.COUNTRY];

function Name({onNext, isEditing}: NameProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);

    const defaultValues = {
        [BUSINESS_INFO_STEP_KEY.STREET]: nonUSDReimbursementAccountDraft?.[BUSINESS_INFO_STEP_KEY.STREET] ?? '',
        [BUSINESS_INFO_STEP_KEY.CITY]: nonUSDReimbursementAccountDraft?.[BUSINESS_INFO_STEP_KEY.CITY] ?? '',
        [BUSINESS_INFO_STEP_KEY.STATE]: nonUSDReimbursementAccountDraft?.[BUSINESS_INFO_STEP_KEY.STATE] ?? '',
        [BUSINESS_INFO_STEP_KEY.ZIP_CODE]: nonUSDReimbursementAccountDraft?.[BUSINESS_INFO_STEP_KEY.ZIP_CODE] ?? '',
    };

    // TODO look into default country
    const businessStepCountryDraftValue = nonUSDReimbursementAccountDraft?.[BUSINESS_INFO_STEP_KEY.COUNTRY] ?? '';
    const countryStepCountryDraftValue = nonUSDReimbursementAccountDraft?.[INPUT_IDS.COUNTRY_STEP.COUNTRY] ?? '';
    const countryInitialValue =
        businessStepCountryDraftValue !== '' && businessStepCountryDraftValue !== countryStepCountryDraftValue ? businessStepCountryDraftValue : countryStepCountryDraftValue;
    const [selectedCountry, setSelectedCountry] = useState(countryInitialValue);
    const shouldDisplayStateSelector = selectedCountry === 'US' || selectedCountry === 'CA';

    const handleSelectingCountry = (country: string) => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM, {[BUSINESS_INFO_STEP_KEY.COUNTRY]: country});
        setSelectedCountry(country);
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
            <Text style={[styles.textHeadlineLineHeightXXL, styles.mh5]}>{translate('businessInfoStep.enterTheNameOfYourBusiness')}</Text>
            <AddressFormFields
                inputKeys={INPUT_KEYS}
                shouldSaveDraft={!isEditing}
                streetTranslationKey="common.companyAddress"
                containerStyles={[styles.mh5]}
                defaultValues={defaultValues}
                shouldDisplayStateSelector={shouldDisplayStateSelector}
            />
            <PushRowWithModal
                optionsList={CONST.ALL_COUNTRIES}
                selectedOption={selectedCountry}
                onOptionChange={handleSelectingCountry}
                description={translate('common.country')}
                modalHeaderTitle={translate('countryStep.selectCountry')}
                searchInputTitle={translate('countryStep.findCountry')}
            />
        </FormProvider>
    );
}

Name.displayName = 'Name';

export default Name;
