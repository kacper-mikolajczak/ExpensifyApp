import {subYears} from 'date-fns';
import React from 'react';
import DatePicker from '@components/DatePicker';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

type DateOfBirthProps = SubStepProps & {isUserEnteringHisOwnData: boolean};

const OWNERSHIP_INFO_STEP_KEY = INPUT_IDS.OWNERSHIP_INFO_STEP;

function DateOfBirth({onNext, isEditing, isUserEnteringHisOwnData}: DateOfBirthProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const handleSubmit = () => {
        onNext();
    };

    const minDate = subYears(new Date(), CONST.DATE_BIRTH.MAX_AGE);
    const maxDate = subYears(new Date(), CONST.DATE_BIRTH.MIN_AGE_FOR_PAYMENT);

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')}
            onSubmit={handleSubmit}
            style={[styles.mh5, styles.flexGrow1]}
        >
            <Text style={[styles.textHeadlineLineHeightXXL]}>{translate(isUserEnteringHisOwnData ? 'ownershipInfoStep.whatsYourDOB' : 'ownershipInfoStep.whatsTheOwnersDOB')}</Text>
            <InputWrapper
                InputComponent={DatePicker}
                inputID={OWNERSHIP_INFO_STEP_KEY.DOB}
                label={translate('common.dob')}
                containerStyles={[styles.mt6]}
                placeholder={translate('common.dateFormat')}
                minDate={minDate}
                maxDate={maxDate}
                shouldSaveDraft={!isEditing}
            />
        </FormProvider>
    );
}

DateOfBirth.displayName = 'DateOfBirth';

export default DateOfBirth;
