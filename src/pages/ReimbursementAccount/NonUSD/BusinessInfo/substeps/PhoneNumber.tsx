import React, {useState} from 'react';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import PushRowWithModal from '@components/PushRowWithModal';
import Text from '@components/Text';
import TextInput from '@components/TextInput';
import useLocalize from '@hooks/useLocalize';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

type PhoneNumberProps = SubStepProps;

const BUSINESS_INFO_STEP_KEY = INPUT_IDS.BUSINESS_INFO_STEP;

function PhoneNumber({onNext, isEditing}: PhoneNumberProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [selectedCountryCode, setSelectedCountryCode] = useState('PL');

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
            <Text style={[styles.textHeadlineLineHeightXXL, styles.mh5, styles.mb3]}>{translate('businessInfoStep.whatsTheBusinessPhone')}</Text>
            <PushRowWithModal
                optionsList={CONST.COUNTRY_PHONE_NUMBER_CODES}
                selectedOption={selectedCountryCode}
                onOptionChange={setSelectedCountryCode}
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
            />
        </FormProvider>
    );
}

PhoneNumber.displayName = 'PhoneNumber';

export default PhoneNumber;
