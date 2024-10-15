import React, {useCallback} from 'react';
import {useOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormInputErrors, FormOnyxValues} from '@components/Form/types';
import Text from '@components/Text';
import TextInput from '@components/TextInput';
import useLocalize from '@hooks/useLocalize';
import useReimbursementAccountStepFormSubmit from '@hooks/useReimbursementAccountStepFormSubmit';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ValidationUtils from '@libs/ValidationUtils';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';

type OwnershipPercentageProps = SubStepProps & {
    isUserEnteringHisOwnData: boolean;
    ownerBeingModifiedID: string;
    totalOwnedPercentage: Record<string, number>;
    setTotalOwnedPercentage: (ownedPercentage: Record<string, number>) => void;
};

const {OWNERSHIP_PERCENTAGE, PREFIX} = CONST.NON_USD_BANK_ACCOUNT.OWNERSHIP_INFO_STEP.OWNER_DATA;

function OwnershipPercentage({onNext, isEditing, isUserEnteringHisOwnData, ownerBeingModifiedID, totalOwnedPercentage, setTotalOwnedPercentage}: OwnershipPercentageProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [reimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);

    const ownershipPercentageInputID = `${PREFIX}_${ownerBeingModifiedID}_${OWNERSHIP_PERCENTAGE}` as const;
    const defaultOwnershipPercentage = reimbursementAccountDraft?.[ownershipPercentageInputID] ?? '';

    const validate = useCallback(
        (values: FormOnyxValues<typeof ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM>): FormInputErrors<typeof ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM> => {
            const errors = ValidationUtils.getFieldRequiredErrors(values, [ownershipPercentageInputID]);

            if (values[ownershipPercentageInputID] && !ValidationUtils.isValidOwnershipPercentage(values[ownershipPercentageInputID], totalOwnedPercentage, ownerBeingModifiedID)) {
                errors[ownershipPercentageInputID] = translate('bankAccount.error.ownershipPercentage');
            }

            setTotalOwnedPercentage({
                ...totalOwnedPercentage,
                [ownerBeingModifiedID]: Number(values[ownershipPercentageInputID]),
            });

            return errors;
        },
        [ownerBeingModifiedID, ownershipPercentageInputID, setTotalOwnedPercentage, totalOwnedPercentage, translate],
    );

    const handleSubmit = useReimbursementAccountStepFormSubmit({
        fieldIds: [ownershipPercentageInputID],
        onNext,
        shouldSaveDraft: isEditing,
    });

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')}
            onSubmit={handleSubmit}
            validate={validate}
            style={[styles.mh5, styles.flexGrow1]}
        >
            <Text style={[styles.textHeadlineLineHeightXXL]}>{translate(isUserEnteringHisOwnData ? 'ownershipInfoStep.whatsYoursPercentage' : 'ownershipInfoStep.whatPercentage')}</Text>
            <InputWrapper
                InputComponent={TextInput}
                label={translate('ownershipInfoStep.ownership')}
                aria-label={translate('ownershipInfoStep.ownership')}
                role={CONST.ROLE.PRESENTATION}
                inputID={ownershipPercentageInputID}
                containerStyles={[styles.mt6]}
                defaultValue={defaultOwnershipPercentage}
                shouldSaveDraft={!isEditing}
            />
        </FormProvider>
    );
}

OwnershipPercentage.displayName = 'OwnershipPercentage';

export default OwnershipPercentage;
