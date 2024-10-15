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
import WhyLink from '@pages/ReimbursementAccount/NonUSD/WhyLink';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';

type Last4SSNProps = SubStepProps & {isUserEnteringHisOwnData: boolean; ownerBeingModifiedID: string};

const {SSN_LAST_4, PREFIX} = CONST.NON_USD_BANK_ACCOUNT.OWNERSHIP_INFO_STEP.OWNER_DATA;

function Last4SSN({onNext, isEditing, isUserEnteringHisOwnData, ownerBeingModifiedID}: Last4SSNProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [reimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);

    const last4SSNInputID = `${PREFIX}_${ownerBeingModifiedID}_${SSN_LAST_4}` as const;
    const defaultLast4SSN = reimbursementAccountDraft?.[last4SSNInputID] ?? '';

    const validate = useCallback(
        (values: FormOnyxValues<typeof ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM>): FormInputErrors<typeof ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM> => {
            const errors = ValidationUtils.getFieldRequiredErrors(values, [last4SSNInputID]);

            if (values[last4SSNInputID] && !ValidationUtils.isValidSSNLastFour(values[last4SSNInputID])) {
                errors[last4SSNInputID] = translate('bankAccount.error.ssnLast4');
            }

            return errors;
        },
        [last4SSNInputID, translate],
    );

    const handleSubmit = useReimbursementAccountStepFormSubmit({
        fieldIds: [last4SSNInputID],
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
            <Text style={[styles.textHeadlineLineHeightXXL]}>{translate(isUserEnteringHisOwnData ? 'ownershipInfoStep.whatsYourLast' : 'ownershipInfoStep.whatAreTheLast')}</Text>
            <InputWrapper
                InputComponent={TextInput}
                label={translate('ownershipInfoStep.last4')}
                aria-label={translate('ownershipInfoStep.last4')}
                role={CONST.ROLE.PRESENTATION}
                inputID={last4SSNInputID}
                containerStyles={[styles.mt6]}
                defaultValue={defaultLast4SSN}
                shouldSaveDraft={!isEditing}
            />
            <WhyLink containerStyles={[styles.mt6]} />
        </FormProvider>
    );
}

Last4SSN.displayName = 'Last4SSN';

export default Last4SSN;
