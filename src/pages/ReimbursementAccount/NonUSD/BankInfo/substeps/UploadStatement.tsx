import React from 'react';
import {View} from 'react-native';
import Button from '@components/Button';
import FormProvider from '@components/Form/FormProvider';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import ONYXKEYS from '@src/ONYXKEYS';

type UploadStatementProps = SubStepProps;

function UploadStatement({onNext, isEditing}: UploadStatementProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const handleSubmit = () => {
        onNext();
    };

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')}
            onSubmit={handleSubmit}
            style={[styles.mh5, styles.flex1]}
        >
            <View>
                <Text style={[styles.textHeadlineLineHeightXXL, styles.mb3]}>{translate('bankInfoStep.uploadYourLatest')}</Text>
                <Text style={[styles.mutedTextLabel, styles.mb6]}>{translate('bankInfoStep.pleaseUpload', {lastFourDigits: '1234'})}</Text>
                <Text style={[styles.mutedTextLabel, styles.mb3]}>{translate('bankInfoStep.bankStatement')}</Text>
                <Button
                    medium
                    text={translate('bankInfoStep.chooseFile')}
                />
            </View>
        </FormProvider>
    );
}

UploadStatement.displayName = 'UploadStatement';

export default UploadStatement;
