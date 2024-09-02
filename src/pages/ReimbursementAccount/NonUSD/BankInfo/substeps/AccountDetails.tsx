import React, {useCallback} from 'react';
import {View} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormInputErrors, FormOnyxValues} from '@components/Form/types';
import Text from '@components/Text';
import TextInput from '@components/TextInput';
import useLocalize from '@hooks/useLocalize';
import useNonUSDReimbursementAccountStepFormSubmit from '@hooks/useNonUSDReimbursementAccountStepFormSubmit';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ValidationUtils from '@libs/ValidationUtils';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

type AccountDetailsProps = SubStepProps;

const {ACCOUNT_NUMBER, ROUTING_CODE} = INPUT_IDS.BANK_INFO_STEP;
const STEP_FIELDS = [ACCOUNT_NUMBER, ROUTING_CODE];

function AccountDetails({onNext, isEditing}: AccountDetailsProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const defaultValues = {
        [ACCOUNT_NUMBER]: nonUSDReimbursementAccountDraft?.[ACCOUNT_NUMBER] ?? '',
        [ROUTING_CODE]: nonUSDReimbursementAccountDraft?.[ROUTING_CODE] ?? '',
    };

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

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')}
            onSubmit={handleSubmit}
            validate={validate}
            style={[styles.mh5, styles.flexGrow1]}
        >
            <View>
                <Text style={[styles.textHeadlineLineHeightXXL, styles.mb6]}>{translate('bankInfoStep.whatAreYour')}</Text>
                <View style={[styles.flex2, styles.mb6]}>
                    <InputWrapper
                        InputComponent={TextInput}
                        inputID={ACCOUNT_NUMBER}
                        label={translate('bankInfoStep.accountNumber')}
                        aria-label={translate('bankInfoStep.accountNumber')}
                        role={CONST.ROLE.PRESENTATION}
                        shouldSaveDraft={!isEditing}
                        defaultValue={defaultValues[ACCOUNT_NUMBER]}
                    />
                </View>
                <View style={[styles.flex2, styles.mb6]}>
                    <InputWrapper
                        InputComponent={TextInput}
                        inputID={ROUTING_CODE}
                        label={translate('bankInfoStep.routingNumber')}
                        aria-label={translate('bankInfoStep.routingNumber')}
                        role={CONST.ROLE.PRESENTATION}
                        shouldSaveDraft={!isEditing}
                        defaultValue={defaultValues[ROUTING_CODE]}
                    />
                </View>
            </View>
        </FormProvider>
    );
}

AccountDetails.displayName = 'AccountDetails';

export default AccountDetails;
