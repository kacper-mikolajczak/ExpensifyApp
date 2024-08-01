import React, {useState} from 'react';
import CountryPicker from '@components/CountryPicker';
import FormProvider from '@components/Form/FormProvider';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import AddressFormFields from '@pages/ReimbursementAccount/AddressFormFields';
import type {Country} from '@src/CONST';
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
function Name({onNext, isEditing}: NameProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [selectedCountry, setSelectedCountry] = useState<Country>('PL');

    const handleSubmit = () => {
        onNext();
    };

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')}
            onSubmit={handleSubmit}
            style={[styles.flexGrow1]}
        >
            <Text style={[styles.textHeadlineLineHeightXXL, styles.mh5]}>{translate('businessInfoStep.enterTheNameOfYourBusiness')}</Text>
            <AddressFormFields
                inputKeys={INPUT_KEYS}
                shouldSaveDraft={!isEditing}
                streetTranslationKey="common.companyAddress"
                containerStyles={[styles.mh5]}
            />
            <CountryPicker
                selectedCountry={selectedCountry}
                onCountryChange={setSelectedCountry}
                countryList={CONST.ALL_COUNTRIES}
                isEditable
                wrapperStyles={[styles.mt3]}
            />
        </FormProvider>
    );
}

Name.displayName = 'Name';

export default Name;
