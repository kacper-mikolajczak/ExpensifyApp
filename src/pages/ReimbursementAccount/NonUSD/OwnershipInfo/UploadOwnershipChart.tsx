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
import useThemeStyles from '@hooks/useThemeStyles';
import * as ValidationUtils from '@libs/ValidationUtils';
import * as FormActions from '@userActions/FormActions';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

type UploadOwnershipChartProps = {
    onSubmit: () => void;
};

const {ENTITY_CHART} = INPUT_IDS.OWNERSHIP_INFO_STEP;

function UploadOwnershipChart({onSubmit}: UploadOwnershipChartProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const defaultValue = nonUSDReimbursementAccountDraft?.[ENTITY_CHART] ?? '';

    const validate = useCallback(
        (values: FormOnyxValues<typeof ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM>): FormInputErrors<typeof ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM> => {
            return ValidationUtils.getFieldRequiredErrors(values, [ENTITY_CHART]);
        },
        [],
    );

    const handleSubmit = useNonUSDReimbursementAccountStepFormSubmit({
        fieldIds: [ENTITY_CHART],
        onNext: onSubmit,
        shouldSaveDraft: true,
    });

    const [uploadedOwnershipChartStatement, setUploadedOwnershipChartStatement] = useState(defaultValue);

    const handleSelectFile = (fileName: string) => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM, {[ENTITY_CHART]: fileName});
        setUploadedOwnershipChartStatement(fileName);
    };

    const handleRemoveFile = () => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM, {[ENTITY_CHART]: ''});
        setUploadedOwnershipChartStatement('');
    };

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate('common.confirm')}
            onSubmit={handleSubmit}
            validate={validate}
            style={[styles.mh5, styles.flex1]}
        >
            <View>
                <Text style={[styles.textHeadlineLineHeightXXL, styles.mb3]}>{translate('ownershipInfoStep.addCertified')}</Text>
                <Text style={[styles.mutedTextLabel, styles.mb6]}>{translate('ownershipInfoStep.regulationRequiresChart')}</Text>
                <InputWrapper
                    InputComponent={UploadFile}
                    buttonText={translate('ownershipInfoStep.uploadEntity')}
                    uploadedFileName={uploadedOwnershipChartStatement}
                    onUpload={handleSelectFile}
                    onRemove={handleRemoveFile}
                    acceptedFileTypes={[...CONST.NON_USD_BANK_ACCOUNT.ALLOWED_FILE_TYPES]}
                    maxFileSize={CONST.NON_USD_BANK_ACCOUNT.MAX_FILE_SIZE_MB}
                    value={uploadedOwnershipChartStatement}
                    inputID={ENTITY_CHART}
                />
                <Text style={[styles.mutedTextLabel, styles.mt6, styles.mb6]}>{translate('ownershipInfoStep.noteEntity')}</Text>
            </View>
        </FormProvider>
    );
}

UploadOwnershipChart.displayName = 'UploadOwnershipChart';

export default UploadOwnershipChart;
