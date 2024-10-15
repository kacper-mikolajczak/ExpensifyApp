import {subYears} from 'date-fns';
import React, {useCallback} from 'react';
import {useOnyx} from 'react-native-onyx';
import DatePicker from '@components/DatePicker';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormInputErrors, FormOnyxValues} from '@components/Form/types';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useReimbursementAccountStepFormSubmit from '@hooks/useReimbursementAccountStepFormSubmit';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ValidationUtils from '@libs/ValidationUtils';
import WhyLink from '@pages/ReimbursementAccount/NonUSD/WhyLink';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';

type DateOfBirthProps = SubStepProps & {isUserEnteringHisOwnData: boolean; ownerBeingModifiedID: string};

const {DOB, PREFIX} = CONST.NON_USD_BANK_ACCOUNT.OWNERSHIP_INFO_STEP.OWNER_DATA;

function DateOfBirth({onNext, isEditing, isUserEnteringHisOwnData, ownerBeingModifiedID}: DateOfBirthProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [reimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT);

    const dateOfBirthInputID = `${PREFIX}_${ownerBeingModifiedID}_${DOB}` as const;
    const defaultDateOfBirth = reimbursementAccountDraft?.[dateOfBirthInputID] ?? '';

    const validate = useCallback(
        (values: FormOnyxValues<typeof ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM>): FormInputErrors<typeof ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM> => {
            return ValidationUtils.getFieldRequiredErrors(values, [dateOfBirthInputID]);
        },
        [dateOfBirthInputID],
    );

    const handleSubmit = useReimbursementAccountStepFormSubmit({
        fieldIds: [dateOfBirthInputID],
        onNext,
        shouldSaveDraft: isEditing,
    });

    const minDate = subYears(new Date(), CONST.DATE_BIRTH.MAX_AGE);
    const maxDate = subYears(new Date(), CONST.DATE_BIRTH.MIN_AGE_FOR_PAYMENT);

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')}
            onSubmit={handleSubmit}
            validate={validate}
            style={[styles.mh5, styles.flexGrow1]}
        >
            <Text style={[styles.textHeadlineLineHeightXXL]}>{translate(isUserEnteringHisOwnData ? 'ownershipInfoStep.whatsYourDOB' : 'ownershipInfoStep.whatsTheOwnersDOB')}</Text>
            <InputWrapper
                InputComponent={DatePicker}
                inputID={dateOfBirthInputID}
                label={translate('common.dob')}
                containerStyles={[styles.mt6]}
                placeholder={translate('common.dateFormat')}
                minDate={minDate}
                maxDate={maxDate}
                defaultValue={defaultDateOfBirth}
                shouldSaveDraft={!isEditing}
            />
            <WhyLink containerStyles={[styles.mt6]} />
        </FormProvider>
    );
}

DateOfBirth.displayName = 'DateOfBirth';

export default DateOfBirth;
