import React from 'react';
import {View} from 'react-native';
import Button from '@components/Button';
import FormProvider from '@components/Form/FormProvider';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import ONYXKEYS from '@src/ONYXKEYS';

type UploadDocumentsProps = SubStepProps;

function UploadDocuments({onNext}: UploadDocumentsProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const handleSubmit = () => {
        onNext();
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
                <Button
                    medium
                    style={[styles.mb6]}
                    text={translate('signerInfoStep.chooseFile')}
                />
                <Text style={[styles.mutedTextLabel, styles.mb3]}>{translate('signerInfoStep.proofOf')}</Text>
                <Button
                    medium
                    style={[styles.mb6]}
                    text={translate('signerInfoStep.chooseFile')}
                />
            </View>
        </FormProvider>
    );
}

UploadDocuments.displayName = 'UploadDocuments';

export default UploadDocuments;
