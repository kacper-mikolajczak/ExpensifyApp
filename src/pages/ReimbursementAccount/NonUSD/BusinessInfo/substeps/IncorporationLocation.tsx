import React, {useState} from 'react';
import {useOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import PushRowWithModal from '@components/PushRowWithModal';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useNonUSDReimbursementAccountStepFormSubmit from '@hooks/useNonUSDReimbursementAccountStepFormSubmit';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import * as FormActions from '@userActions/FormActions';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

type IncorporationLocationProps = SubStepProps;

const BUSINESS_INFO_STEP_KEY = INPUT_IDS.BUSINESS_INFO_STEP;
const STEP_FIELDS = [BUSINESS_INFO_STEP_KEY.INCORPORATION_COUNTRY];

function IncorporationLocation({onNext, isEditing}: IncorporationLocationProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);

    const businessStepCountryDraftValue = nonUSDReimbursementAccountDraft?.[BUSINESS_INFO_STEP_KEY.INCORPORATION_COUNTRY] ?? '';
    const countryStepCountryDraftValue = nonUSDReimbursementAccountDraft?.[INPUT_IDS.COUNTRY_STEP.COUNTRY] ?? '';
    const countryInitialValue =
        businessStepCountryDraftValue !== '' && businessStepCountryDraftValue !== countryStepCountryDraftValue ? businessStepCountryDraftValue : countryStepCountryDraftValue;

    const [selectedCountry, setSelectedCountry] = useState(countryInitialValue);

    const handleSubmit = useNonUSDReimbursementAccountStepFormSubmit({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });

    const handleSelectingCountry = (country: string) => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM, {[BUSINESS_INFO_STEP_KEY.INCORPORATION_COUNTRY]: country});
        setSelectedCountry(country);
    };

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')}
            onSubmit={handleSubmit}
            style={[styles.flexGrow1]}
            submitButtonStyles={[styles.mh5]}
        >
            <Text style={[styles.textHeadlineLineHeightXXL, styles.mh5, styles.mb3]}>{translate('businessInfoStep.whereWasTheBusinessIncorporated')}</Text>
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

IncorporationLocation.displayName = 'IncorporationLocation';

export default IncorporationLocation;
