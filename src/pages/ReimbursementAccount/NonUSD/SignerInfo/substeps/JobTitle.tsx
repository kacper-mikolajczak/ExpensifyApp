import React from 'react';
import {useOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import Text from '@components/Text';
import TextInput from '@components/TextInput';
import useLocalize from '@hooks/useLocalize';
import useNonUSDReimbursementAccountStepFormSubmit from '@hooks/useNonUSDReimbursementAccountStepFormSubmit';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

type JobTitleProps = SubStepProps;

const {JOB_TITLE} = INPUT_IDS.SIGNER_INFO_STEP;

function JobTitle({onNext, isEditing}: JobTitleProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const defaultValue = nonUSDReimbursementAccountDraft?.[JOB_TITLE] ?? '';

    const handleSubmit = useNonUSDReimbursementAccountStepFormSubmit({
        fieldIds: [JOB_TITLE],
        onNext,
        shouldSaveDraft: isEditing,
    });

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')}
            onSubmit={handleSubmit}
            style={[styles.mh5, styles.flexGrow1]}
        >
            <Text style={[styles.textHeadlineLineHeightXXL]}>{translate('signerInfoStep.whatsYourJobTitle')}</Text>
            <InputWrapper
                InputComponent={TextInput}
                label={translate('signerInfoStep.jobTitle')}
                aria-label={translate('signerInfoStep.jobTitle')}
                role={CONST.ROLE.PRESENTATION}
                inputID={JOB_TITLE}
                containerStyles={[styles.mt6]}
                defaultValue={defaultValue}
                shouldSaveDraft={!isEditing}
            />
        </FormProvider>
    );
}

JobTitle.displayName = 'JobTitle';

export default JobTitle;
