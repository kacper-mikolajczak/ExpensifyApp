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

type UploadDocumentsProps = SubStepProps;

const {ID, PROOF_OF_ADDRESS} = INPUT_IDS.SIGNER_INFO_STEP;
const STEP_FIELDS = [ID, PROOF_OF_ADDRESS];

function UploadDocuments({onNext, isEditing}: UploadDocumentsProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const defaultValues = {
        [ID]: nonUSDReimbursementAccountDraft?.[ID] ?? '',
        [PROOF_OF_ADDRESS]: nonUSDReimbursementAccountDraft?.[PROOF_OF_ADDRESS] ?? '',
    };

    const [uploadedID, setUploadedID] = useState(defaultValues[ID]);
    const [uploadedProofOfAddress, setUploadedProofOfAddress] = useState(defaultValues[PROOF_OF_ADDRESS]);

    const validate = useCallback(
        (values: FormOnyxValues<typeof ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM>): FormInputErrors<typeof ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM> => {
            return ValidationUtils.getFieldRequiredErrors(values, STEP_FIELDS);
        },
        [],
    );

    const handleSubmit = useNonUSDReimbursementAccountStepFormSubmit({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });

    const handleSelectIDFile = (fileName: string) => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM, {[ID]: fileName});
        setUploadedID(fileName);
    };

    const handleRemoveIDFile = () => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM, {[ID]: ''});
        setUploadedID('');
    };

    const handleSelectProofOfAddressFile = (fileName: string) => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM, {[PROOF_OF_ADDRESS]: fileName});
        setUploadedProofOfAddress(fileName);
    };

    const handleRemoveProofOfAddressFile = () => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM, {[PROOF_OF_ADDRESS]: ''});
        setUploadedProofOfAddress('');
    };

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate('common.next')}
            onSubmit={handleSubmit}
            validate={validate}
            style={[styles.mh5, styles.flex1]}
        >
            <View>
                <Text style={[styles.textHeadlineLineHeightXXL, styles.mb6]}>{translate('signerInfoStep.uploadID')}</Text>
                <Text style={[styles.mutedTextLabel, styles.mb3]}>{translate('signerInfoStep.id')}</Text>
                <InputWrapper
                    InputComponent={UploadFile}
                    buttonText={translate('signerInfoStep.chooseFile')}
                    uploadedFileName={uploadedID}
                    onUpload={handleSelectIDFile}
                    onRemove={handleRemoveIDFile}
                    acceptedFileTypes={[...CONST.NON_USD_BANK_ACCOUNT.ALLOWED_FILE_TYPES]}
                    value={uploadedID}
                    inputID={ID}
                />
                <Text style={[styles.mutedTextLabel, styles.mb3, styles.mt6]}>{translate('signerInfoStep.proofOf')}</Text>
                <InputWrapper
                    InputComponent={UploadFile}
                    buttonText={translate('signerInfoStep.chooseFile')}
                    uploadedFileName={uploadedProofOfAddress}
                    onUpload={handleSelectProofOfAddressFile}
                    onRemove={handleRemoveProofOfAddressFile}
                    acceptedFileTypes={[...CONST.NON_USD_BANK_ACCOUNT.ALLOWED_FILE_TYPES]}
                    value={uploadedProofOfAddress}
                    inputID={PROOF_OF_ADDRESS}
                />
                <WhyLink containerStyles={[styles.mt6]} />
            </View>
        </FormProvider>
    );
}

UploadDocuments.displayName = 'UploadDocuments';

export default UploadDocuments;
