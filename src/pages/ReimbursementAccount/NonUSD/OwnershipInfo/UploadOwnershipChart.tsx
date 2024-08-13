import React from 'react';
import {View} from 'react-native';
import Button from '@components/Button';
import FormProvider from '@components/Form/FormProvider';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import ONYXKEYS from '@src/ONYXKEYS';

type UploadOwnershipChartProps = {
    onSubmit: () => void;
};

function UploadOwnershipChart({onSubmit}: UploadOwnershipChartProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const handleSubmit = () => {
        onSubmit();
    };

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate('common.confirm')}
            onSubmit={handleSubmit}
            style={[styles.mh5, styles.flex1]}
        >
            <View>
                <Text style={[styles.textHeadlineLineHeightXXL, styles.mb3]}>{translate('ownershipInfoStep.addCertified')}</Text>
                <Text style={[styles.mutedTextLabel, styles.mb6]}>{translate('ownershipInfoStep.regulationRequiresChart')}</Text>
                <Button
                    medium
                    text={translate('ownershipInfoStep.uploadEntity')}
                />
            </View>
        </FormProvider>
    );
}

UploadOwnershipChart.displayName = 'UploadOwnershipChart';

export default UploadOwnershipChart;
