import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormInputErrors, FormOnyxValues} from '@components/Form/types';
import Text from '@components/Text';
import UploadFile from '@components/UploadFile';
import useLocalize from '@hooks/useLocalize';
import useNonUSDReimbursementAccountStepFormSubmit from '@hooks/useNonUSDReimbursementAccountStepFormSubmit';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ValidationUtils from '@libs/ValidationUtils';
import WhyLink from '@pages/ReimbursementAccount/NonUSD/WhyLink';
import * as FormActions from '@userActions/FormActions';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

type UploadStatementProps = SubStepProps;

const {BANK_STATEMENT} = INPUT_IDS.BANK_INFO_STEP;

function UploadStatement({onNext, isEditing}: UploadStatementProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const defaultValue = nonUSDReimbursementAccountDraft?.[BANK_STATEMENT] ?? '';

    const validate = useCallback(
        (values: FormOnyxValues<typeof ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM>): FormInputErrors<typeof ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM> => {
            return ValidationUtils.getFieldRequiredErrors(values, [BANK_STATEMENT]);
        },
        [],
    );

    const handleSubmit = useNonUSDReimbursementAccountStepFormSubmit({
        fieldIds: [BANK_STATEMENT],
        onNext,
        shouldSaveDraft: isEditing,
    });

    const [uploadedBankStatement, setUploadedBankStatement] = useState(defaultValue);

    const handleSelectFile = (fileName: string) => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM, {[BANK_STATEMENT]: fileName});
        setUploadedBankStatement(fileName);
    };

    const handleRemoveFile = () => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM, {[BANK_STATEMENT]: ''});
        setUploadedBankStatement('');
    };

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')}
            onSubmit={handleSubmit}
            validate={validate}
            style={[styles.mh5, styles.flex1]}
        >
            <View>
                <Text style={[styles.textHeadlineLineHeightXXL, styles.mb3]}>{translate('bankInfoStep.uploadYourLatest')}</Text>
                <Text style={[styles.mutedTextLabel, styles.mb6]}>{translate('bankInfoStep.pleaseUpload', {lastFourDigits: '1234'})}</Text>
                <Text style={[styles.mutedTextLabel, styles.mb3]}>{translate('bankInfoStep.bankStatement')}</Text>
                <InputWrapper
                    InputComponent={UploadFile}
                    buttonText={translate('bankInfoStep.chooseFile')}
                    uploadedFileName={uploadedBankStatement}
                    onUpload={handleSelectFile}
                    onRemove={handleRemoveFile}
                    acceptedFileTypes={[...CONST.NON_USD_BANK_ACCOUNT.ALLOWED_FILE_TYPES]}
                    maxFileSize={CONST.NON_USD_BANK_ACCOUNT.MAX_FILE_SIZE_MB}
                    value={uploadedBankStatement}
                    inputID={BANK_STATEMENT}
                />
                <WhyLink containerStyles={[styles.mt6]} />
            </View>
        </FormProvider>
    );
}

UploadStatement.displayName = 'UploadStatement';

export default UploadStatement;
