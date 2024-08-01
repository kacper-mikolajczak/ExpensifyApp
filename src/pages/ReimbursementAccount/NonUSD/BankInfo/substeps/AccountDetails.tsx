import React from 'react';
import {View} from 'react-native';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import Text from '@components/Text';
import TextInput from '@components/TextInput';
import useLocalize from '@hooks/useLocalize';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

type AccountDetailsProps = SubStepProps;

const ACCOUNT_DETAILS_STEP_KEY = INPUT_IDS.BANK_INFO_STEP;

function AccountDetails({onNext, isEditing}: AccountDetailsProps) {
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
            style={[styles.mh5, styles.flexGrow1]}
        >
            <View>
                <Text style={[styles.textHeadlineLineHeightXXL, styles.mb6]}>{translate('bankInfoStep.whatAreYour')}</Text>
                <View style={[styles.flex2, styles.mb6]}>
                    <InputWrapper
                        InputComponent={TextInput}
                        inputID={ACCOUNT_DETAILS_STEP_KEY.ACCOUNT_NUMBER}
                        label={translate('bankInfoStep.accountNumber')}
                        aria-label={translate('bankInfoStep.accountNumber')}
                        role={CONST.ROLE.PRESENTATION}
                        shouldSaveDraft={!isEditing}
                    />
                </View>
                <View style={[styles.flex2, styles.mb6]}>
                    <InputWrapper
                        InputComponent={TextInput}
                        inputID={ACCOUNT_DETAILS_STEP_KEY.ROUTING_CODE}
                        label={translate('bankInfoStep.routingNumber')}
                        aria-label={translate('bankInfoStep.routingNumber')}
                        role={CONST.ROLE.PRESENTATION}
                        shouldSaveDraft={!isEditing}
                    />
                </View>
            </View>
        </FormProvider>
    );
}

AccountDetails.displayName = 'AccountDetails';

export default AccountDetails;
