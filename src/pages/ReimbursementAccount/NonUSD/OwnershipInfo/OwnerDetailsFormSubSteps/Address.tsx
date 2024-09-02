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
import WhyLink from '@pages/ReimbursementAccount/NonUSD/WhyLink';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';

type NameProps = SubStepProps & {isUserEnteringHisOwnData: boolean; ownerBeingModifiedID: string};

const {STREET, CITY, STATE, ZIP_CODE, COUNTRY, PREFIX} = CONST.NON_USD_BANK_ACCOUNT.OWNERSHIP_INFO_STEP.OWNER_DATA;

function Name({onNext, isEditing, isUserEnteringHisOwnData, ownerBeingModifiedID}: NameProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);

    const inputKeys = {
        street: `${PREFIX}_${ownerBeingModifiedID}_${STREET}`,
        city: `${PREFIX}_${ownerBeingModifiedID}_${CITY}`,
        state: `${PREFIX}_${ownerBeingModifiedID}_${STATE}`,
        zipCode: `${PREFIX}_${ownerBeingModifiedID}_${ZIP_CODE}`,
        country: `${PREFIX}_${ownerBeingModifiedID}_${COUNTRY}`,
    } as const;
    const countryInputKey: `owner_${string}_${string}` = `${PREFIX}_${ownerBeingModifiedID}_${COUNTRY}`;

    const defaultValues = {
        street: nonUSDReimbursementAccountDraft?.[inputKeys.street] ?? '',
        city: nonUSDReimbursementAccountDraft?.[inputKeys.city] ?? '',
        state: nonUSDReimbursementAccountDraft?.[inputKeys.state] ?? '',
        zipCode: nonUSDReimbursementAccountDraft?.[inputKeys.zipCode] ?? '',
        country: nonUSDReimbursementAccountDraft?.[inputKeys.country] ?? '',
    };

    const shouldDisplayStateSelector = defaultValues.country === CONST.COUNTRY.US || defaultValues.country === CONST.COUNTRY.CA;

    const stepFields = [inputKeys.street, inputKeys.city, inputKeys.state, inputKeys.zipCode, countryInputKey];
    const stepFieldsWithoutState = [inputKeys.street, inputKeys.city, inputKeys.zipCode, countryInputKey];

    const handleSubmit = useNonUSDReimbursementAccountStepFormSubmit({
        fieldIds: stepFields,
        onNext,
        shouldSaveDraft: isEditing,
    });

    const validate = useCallback(
        (values: FormOnyxValues<typeof ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM>): FormInputErrors<typeof ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM> => {
            const errors = ValidationUtils.getFieldRequiredErrors(values, shouldDisplayStateSelector ? stepFields : stepFieldsWithoutState);

            if (values.street && !ValidationUtils.isValidAddress(values.street)) {
                errors.street = translate('bankAccount.error.addressStreet');
            }

            return errors;
        },
        [shouldDisplayStateSelector, stepFields, stepFieldsWithoutState, translate],
    );

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')}
            onSubmit={handleSubmit}
            validate={validate}
            style={[styles.flexGrow1]}
            submitButtonStyles={[styles.mh5]}
        >
            <Text style={[styles.textHeadlineLineHeightXXL, styles.mh5]}>
                {translate(isUserEnteringHisOwnData ? 'ownershipInfoStep.whatsYourAddress' : 'ownershipInfoStep.whatsTheOwnersAddress')}
            </Text>
            <AddressFormFields
                inputKeys={inputKeys}
                defaultValues={defaultValues}
                shouldSaveDraft={!isEditing}
                streetTranslationKey="common.companyAddress"
                containerStyles={[styles.mh5]}
                shouldDisplayCountrySelector
                shouldDisplayStateSelector={shouldDisplayStateSelector}
            />
            <WhyLink containerStyles={[styles.mt6, styles.mh5]} />
        </FormProvider>
    );
}

Name.displayName = 'Name';

export default Name;
