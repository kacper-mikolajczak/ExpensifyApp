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

type NameProps = SubStepProps;

const {FIRST_NAME, LAST_NAME} = INPUT_IDS.SIGNER_INFO_STEP;
const STEP_FIELDS = [FIRST_NAME, LAST_NAME];

function Name({onNext, isEditing}: NameProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const defaultValues = {
        [FIRST_NAME]: nonUSDReimbursementAccountDraft?.[FIRST_NAME] ?? '',
        [LAST_NAME]: nonUSDReimbursementAccountDraft?.[LAST_NAME] ?? '',
    };

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
            style={[styles.mh5, styles.flexGrow1]}
        >
            <Text style={[styles.textHeadlineLineHeightXXL]}>{translate('signerInfoStep.whatsYourName')}</Text>
            <InputWrapper
                InputComponent={TextInput}
                label={translate('signerInfoStep.legalFirstName')}
                aria-label={translate('signerInfoStep.legalFirstName')}
                role={CONST.ROLE.PRESENTATION}
                inputID={FIRST_NAME}
                containerStyles={[styles.mt6]}
                defaultValue={defaultValues[FIRST_NAME]}
                shouldSaveDraft={!isEditing}
            />
            <InputWrapper
                InputComponent={TextInput}
                label={translate('signerInfoStep.legalLastName')}
                aria-label={translate('signerInfoStep.legalLastName')}
                role={CONST.ROLE.PRESENTATION}
                inputID={LAST_NAME}
                containerStyles={[styles.mt6]}
                defaultValue={defaultValues[LAST_NAME]}
                shouldSaveDraft={!isEditing}
            />
        </FormProvider>
    );
}

Name.displayName = 'Name';

export default Name;
