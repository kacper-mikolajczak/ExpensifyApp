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

type NameProps = SubStepProps & {isUserEnteringHisOwnData: boolean; ownerBeingModifiedID: string};

const {FIRST_NAME, LAST_NAME, PREFIX} = CONST.NON_USD_BANK_ACCOUNT.OWNERSHIP_INFO_STEP.OWNER_DATA;

function Name({onNext, isEditing, isUserEnteringHisOwnData, ownerBeingModifiedID}: NameProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);

    const firstNameInputID = `${PREFIX}_${ownerBeingModifiedID}_${FIRST_NAME}` as const;
    const lastNameInputID = `${PREFIX}_${ownerBeingModifiedID}_${LAST_NAME}` as const;
    const stepFields = [firstNameInputID, lastNameInputID];
    const defaultFirstName = nonUSDReimbursementAccountDraft?.[firstNameInputID] ?? '';
    const defaultLastName = nonUSDReimbursementAccountDraft?.[lastNameInputID] ?? '';

    const handleSubmit = useNonUSDReimbursementAccountStepFormSubmit({
        fieldIds: stepFields,
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
            <Text style={[styles.textHeadlineLineHeightXXL]}>{translate(isUserEnteringHisOwnData ? 'ownershipInfoStep.whatsYourName' : 'ownershipInfoStep.whatsTheOwnersName')}</Text>
            <InputWrapper
                InputComponent={TextInput}
                label={translate('ownershipInfoStep.legalFirstName')}
                aria-label={translate('ownershipInfoStep.legalFirstName')}
                role={CONST.ROLE.PRESENTATION}
                inputID={firstNameInputID}
                containerStyles={[styles.mt6]}
                defaultValue={defaultFirstName}
                shouldSaveDraft={!isEditing}
            />
            <InputWrapper
                InputComponent={TextInput}
                label={translate('ownershipInfoStep.legalLastName')}
                aria-label={translate('ownershipInfoStep.legalLastName')}
                role={CONST.ROLE.PRESENTATION}
                inputID={lastNameInputID}
                containerStyles={[styles.mt6]}
                defaultValue={defaultLastName}
                shouldSaveDraft={!isEditing}
            />
        </FormProvider>
    );
}

Name.displayName = 'Name';

export default Name;
