import React, {useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormInputErrors, FormOnyxValues} from '@components/Form/types';
import PushRowWithModal from '@components/PushRowWithModal';
import Text from '@components/Text';
import TextInput from '@components/TextInput';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import type {BankInfoSubStepProps} from '@pages/ReimbursementAccount/NonUSD/BankInfo/types';
import * as FormActions from '@userActions/FormActions';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';

function AccountHolderDetails({onNext, isEditing, corpayFields}: BankInfoSubStepProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const [selectedCountry, setSelectedCountry] = useState<string>('');

    const accountHolderDetailsFields = useMemo(() => {
        return corpayFields.filter((field) => field.id.includes(CONST.NON_USD_BANK_ACCOUNT.BANK_INFO_STEP_ACCOUNT_HOLDER_KEY_PREFIX));
    }, [corpayFields]);

    const handleSubmit = () => {
        onNext();
    };

    const handleSelectingCountry = (country: string) => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM, {accountHolderCountry: country});
        setSelectedCountry(country);
    };

    const validate = useCallback(
        (values: FormOnyxValues<typeof ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM>): FormInputErrors<typeof ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM> => {
            const errors: FormInputErrors<typeof ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM> = {};

            accountHolderDetailsFields.forEach((field) => {
                const fieldID = field.id as keyof FormOnyxValues<typeof ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM>;

                if (field.isRequired && !values[fieldID]) {
                    errors[fieldID] = translate('common.error.fieldRequired');
                }

                field.validationRules.forEach((rule) => {
                    if (new RegExp(rule.regEx).test(values[fieldID] ? String(values[fieldID]) : '')) {
                        return;
                    }

                    errors[fieldID] = rule.errorMessage;
                });
            });

            return errors;
        },
        [accountHolderDetailsFields, translate],
    );

    const inputs = useMemo(() => {
        return accountHolderDetailsFields.map((field) => {
            if (field.id === 'accountHolderCountry') {
                return (
                    <View style={[styles.mb6, styles.mhn5]}>
                        <InputWrapper
                            InputComponent={PushRowWithModal}
                            optionsList={CONST.ALL_COUNTRIES}
                            selectedOption={selectedCountry}
                            onOptionChange={handleSelectingCountry}
                            description={field.label}
                            modalHeaderTitle={translate('countryStep.selectCountry')}
                            searchInputTitle={translate('countryStep.findCountry')}
                            value={selectedCountry}
                            inputID={field.id}
                        />
                    </View>
                );
            }

            return (
                <View style={[styles.flex2, styles.mb6]}>
                    <InputWrapper
                        InputComponent={TextInput}
                        inputID={field.id}
                        label={field.label}
                        aria-label={field.label}
                        role={CONST.ROLE.PRESENTATION}
                        shouldSaveDraft={!isEditing}
                    />
                </View>
            );
        });
    }, [accountHolderDetailsFields, styles.flex2, styles.mb6, styles.mhn5, isEditing, selectedCountry, translate]);

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')}
            validate={validate}
            onSubmit={handleSubmit}
            style={[styles.mh5, styles.flexGrow1]}
        >
            <View>
                <Text style={[styles.textHeadlineLineHeightXXL, styles.mb6]}>{translate('bankInfoStep.whatAreYour')}</Text>
                {inputs}
            </View>
        </FormProvider>
    );
}

AccountHolderDetails.displayName = 'AccountHolderDetails';

export default AccountHolderDetails;
