import React, {useState} from 'react';
import {View} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import Button from '@components/Button';
import FormProvider from '@components/Form/FormProvider';
import Text from '@components/Text';
import UploadFile from '@components/UploadFile';
import useLocalize from '@hooks/useLocalize';
import useNonUSDReimbursementAccountStepFormSubmit from '@hooks/useNonUSDReimbursementAccountStepFormSubmit';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
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
        setUploadedID('');
    };

    const handleSelectProofOfAddressFile = (fileName: string) => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM, {[PROOF_OF_ADDRESS]: fileName});
        setUploadedProofOfAddress(fileName);
    };

    const handleRemoveProofOfAddressFile = () => {
        setUploadedProofOfAddress('');
    };

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate('common.next')}
            onSubmit={handleSubmit}
            style={[styles.mh5, styles.flex1]}
        >
            <View>
                <Text style={[styles.textHeadlineLineHeightXXL, styles.mb6]}>{translate('signerInfoStep.uploadID')}</Text>
                <Text style={[styles.mutedTextLabel, styles.mb3]}>{translate('signerInfoStep.id')}</Text>
                <UploadFile
                    buttonText={translate('signerInfoStep.chooseFile')}
                    uploadedFileName={uploadedID}
                    onUpload={handleSelectIDFile}
                    onRemove={handleRemoveIDFile}
                    acceptedFileTypes={[...CONST.NON_USD_BANK_ACCOUNT.ALLOWED_FILE_TYPES]}
                    maxFileSize={CONST.NON_USD_BANK_ACCOUNT.MAX_FILE_SIZE_MB}
                />
                <Text style={[styles.mutedTextLabel, styles.mb3, styles.mt6]}>{translate('signerInfoStep.proofOf')}</Text>
                <UploadFile
                    buttonText={translate('signerInfoStep.chooseFile')}
                    uploadedFileName={uploadedProofOfAddress}
                    onUpload={handleSelectProofOfAddressFile}
                    onRemove={handleRemoveProofOfAddressFile}
                    acceptedFileTypes={[...CONST.NON_USD_BANK_ACCOUNT.ALLOWED_FILE_TYPES]}
                    maxFileSize={CONST.NON_USD_BANK_ACCOUNT.MAX_FILE_SIZE_MB}
                />
                <WhyLink containerStyles={[styles.mt6]} />
            </View>
        </FormProvider>
    );
}

UploadDocuments.displayName = 'UploadDocuments';

export default UploadDocuments;
