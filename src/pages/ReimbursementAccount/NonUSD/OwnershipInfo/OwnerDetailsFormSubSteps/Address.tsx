import React, {useState} from 'react';
import FormProvider from '@components/Form/FormProvider';
import PushRowWithModal from '@components/PushRowWithModal';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import AddressFormFields from '@pages/ReimbursementAccount/AddressFormFields';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

type NameProps = SubStepProps & {isUserEnteringHisOwnData: boolean};

const OWNERSHIP_INFO_STEP_KEY = INPUT_IDS.OWNERSHIP_INFO_STEP;

const INPUT_KEYS = {
    street: OWNERSHIP_INFO_STEP_KEY.STREET,
    city: OWNERSHIP_INFO_STEP_KEY.CITY,
    state: OWNERSHIP_INFO_STEP_KEY.STATE,
    zipCode: OWNERSHIP_INFO_STEP_KEY.ZIP_CODE,
};
function Name({onNext, isEditing, isUserEnteringHisOwnData}: NameProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [selectedCountry, setSelectedCountry] = useState('PL');

    const handleSubmit = () => {
        onNext();
    };

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')}
            onSubmit={handleSubmit}
            style={[styles.flexGrow1]}
            submitButtonStyles={[styles.mh5]}
        >
            <Text style={[styles.textHeadlineLineHeightXXL, styles.mh5]}>
                {translate(isUserEnteringHisOwnData ? 'ownershipInfoStep.whatsYourAddress' : 'ownershipInfoStep.whatsTheOwnersAddress')}
            </Text>
            <AddressFormFields
                inputKeys={INPUT_KEYS}
                shouldSaveDraft={!isEditing}
                streetTranslationKey="common.companyAddress"
                containerStyles={[styles.mh5]}
            />
            <PushRowWithModal
                optionsList={CONST.ALL_COUNTRIES}
                selectedOption={selectedCountry}
                onOptionChange={setSelectedCountry}
                description={translate('common.country')}
                modalHeaderTitle={translate('ownershipInfoStep.selectCountry')}
                searchInputTitle={translate('ownershipInfoStep.findCountry')}
            />
        </FormProvider>
    );
}

Name.displayName = 'Name';

export default Name;
