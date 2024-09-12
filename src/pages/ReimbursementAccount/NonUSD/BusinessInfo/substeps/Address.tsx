import React, {useCallback} from 'react';
import {useOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import type {FormInputErrors, FormOnyxValues} from '@components/Form/types';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useNonUSDReimbursementAccountStepFormSubmit from '@hooks/useNonUSDReimbursementAccountStepFormSubmit';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ValidationUtils from '@libs/ValidationUtils';
import AddressFormFields from '@pages/ReimbursementAccount/AddressFormFields';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

type AddressProps = SubStepProps;

const {STREET, CITY, STATE, ZIP_CODE, COUNTRY} = INPUT_IDS.BUSINESS_INFO_STEP;

const INPUT_KEYS = {
    street: STREET,
    city: CITY,
    state: STATE,
    zipCode: ZIP_CODE,
    country: COUNTRY,
};
const STEP_FIELDS = [STREET, CITY, STATE, ZIP_CODE, COUNTRY];
const STEP_FIELDS_WITHOUT_STATE = [STREET, CITY, ZIP_CODE, COUNTRY];

function Address({onNext, isEditing}: AddressProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);

    // TODO look into default country
    const businessStepCountryDraftValue = nonUSDReimbursementAccountDraft?.[COUNTRY] ?? '';
    const countryStepCountryDraftValue = nonUSDReimbursementAccountDraft?.[INPUT_IDS.COUNTRY_STEP.COUNTRY] ?? '';
    const countryInitialValue =
        businessStepCountryDraftValue !== '' && businessStepCountryDraftValue !== countryStepCountryDraftValue ? businessStepCountryDraftValue : countryStepCountryDraftValue;

    const defaultValues = {
        [STREET]: nonUSDReimbursementAccountDraft?.[STREET] ?? '',
        [CITY]: nonUSDReimbursementAccountDraft?.[CITY] ?? '',
        [STATE]: nonUSDReimbursementAccountDraft?.[STATE] ?? '',
        [ZIP_CODE]: nonUSDReimbursementAccountDraft?.[ZIP_CODE] ?? '',
        [COUNTRY]: nonUSDReimbursementAccountDraft?.[COUNTRY] ?? countryInitialValue,
    };

    const shouldDisplayStateSelector = defaultValues[COUNTRY] === CONST.COUNTRY.US || defaultValues[COUNTRY] === CONST.COUNTRY.CA || defaultValues[COUNTRY] === '';

    const validate = useCallback(
        (values: FormOnyxValues<typeof ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM>): FormInputErrors<typeof ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM> => {
            const errors = ValidationUtils.getFieldRequiredErrors(values, shouldDisplayStateSelector ? STEP_FIELDS : STEP_FIELDS_WITHOUT_STATE);

            if (values.street && !ValidationUtils.isValidAddress(values.street)) {
                errors.street = translate('bankAccount.error.addressStreet');
            }

            if (values.zipCode && !ValidationUtils.isValidZipCode(values.zipCode)) {
                errors.zipCode = translate('bankAccount.error.zipCode');
            }

            return errors;
        },
        [shouldDisplayStateSelector, translate],
    );

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
            validate={validate}
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
                shouldDisplayCountrySelector
                shouldDisplayStateSelector={shouldDisplayStateSelector}
            />
        </FormProvider>
    );
}

Address.displayName = 'Address';

export default Address;
