import React, {useCallback, useMemo} from 'react';
import {useOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import type {FormInputErrors, FormOnyxValues} from '@components/Form/types';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useReimbursementAccountStepFormSubmit from '@hooks/useReimbursementAccountStepFormSubmit';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ValidationUtils from '@libs/ValidationUtils';
import AddressFormFields from '@pages/ReimbursementAccount/AddressFormFields';
import WhyLink from '@pages/ReimbursementAccount/NonUSD/WhyLink';
import CONST from '@src/CONST';
import type {Country} from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';

type NameProps = SubStepProps & {isUserEnteringHisOwnData: boolean; ownerBeingModifiedID: string};

const {STREET, CITY, STATE, ZIP_CODE, COUNTRY, PREFIX} = CONST.NON_USD_BANK_ACCOUNT.OWNERSHIP_INFO_STEP.OWNER_DATA;

function Name({onNext, isEditing, isUserEnteringHisOwnData, ownerBeingModifiedID}: NameProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [reimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);

    const countryInputKey: `beneficialOwner_${string}_${string}` = `${PREFIX}_${ownerBeingModifiedID}_${COUNTRY}`;
    const inputKeys = {
        street: `${PREFIX}_${ownerBeingModifiedID}_${STREET}`,
        city: `${PREFIX}_${ownerBeingModifiedID}_${CITY}`,
        state: `${PREFIX}_${ownerBeingModifiedID}_${STATE}`,
        zipCode: `${PREFIX}_${ownerBeingModifiedID}_${ZIP_CODE}`,
        country: countryInputKey,
    } as const;

    const defaultValues = {
        street: reimbursementAccountDraft?.[inputKeys.street] ?? '',
        city: reimbursementAccountDraft?.[inputKeys.city] ?? '',
        state: reimbursementAccountDraft?.[inputKeys.state] ?? '',
        zipCode: reimbursementAccountDraft?.[inputKeys.zipCode] ?? '',
        country: (reimbursementAccountDraft?.[inputKeys.country] ?? '') as Country | '',
    };

    const shouldDisplayStateSelector = defaultValues.country === CONST.COUNTRY.US || defaultValues.country === CONST.COUNTRY.CA;

    const stepFields = useMemo(
        () => [inputKeys.street, inputKeys.city, inputKeys.state, inputKeys.zipCode, countryInputKey],
        [countryInputKey, inputKeys.city, inputKeys.state, inputKeys.street, inputKeys.zipCode],
    );
    const stepFieldsWithoutState = useMemo(
        () => [inputKeys.street, inputKeys.city, inputKeys.zipCode, countryInputKey],
        [countryInputKey, inputKeys.city, inputKeys.street, inputKeys.zipCode],
    );

    const handleSubmit = useReimbursementAccountStepFormSubmit({
        fieldIds: stepFields,
        onNext,
        shouldSaveDraft: isEditing,
    });

    const validate = useCallback(
        (values: FormOnyxValues<typeof ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM>): FormInputErrors<typeof ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM> => {
            const errors = ValidationUtils.getFieldRequiredErrors(values, shouldDisplayStateSelector ? stepFields : stepFieldsWithoutState);

            if (values[inputKeys.street] && !ValidationUtils.isValidAddress(values[inputKeys.street])) {
                errors[inputKeys.street] = translate('bankAccount.error.addressStreet');
            }

            if (values[inputKeys.zipCode] && !ValidationUtils.isValidZipCode(values[inputKeys.zipCode])) {
                errors[inputKeys.zipCode] = translate('bankAccount.error.zipCode');
            }

            return errors;
        },
        [inputKeys.street, inputKeys.zipCode, shouldDisplayStateSelector, stepFields, stepFieldsWithoutState, translate],
    );

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM}
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
