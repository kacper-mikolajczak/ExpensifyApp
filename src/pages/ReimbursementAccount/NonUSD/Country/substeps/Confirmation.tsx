import React, {useCallback, useEffect, useState} from 'react';
import {useOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormInputErrors, FormOnyxValues} from '@components/Form/types';
import MenuItemWithTopDescription from '@components/MenuItemWithTopDescription';
import PressableWithoutFeedback from '@components/Pressable/PressableWithoutFeedback';
import PushRowWithModal from '@components/PushRowWithModal';
import SafeAreaConsumer from '@components/SafeAreaConsumer';
import ScrollView from '@components/ScrollView';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import Navigation from '@libs/Navigation/Navigation';
import * as ValidationUtils from '@libs/ValidationUtils';
import * as FormActions from '@userActions/FormActions';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

const mapCurrencyToCountry = (currency: string): string => {
    switch (currency) {
        case CONST.CURRENCY.USD:
            return 'US';
        case CONST.CURRENCY.AUD:
            return 'AU';
        case CONST.CURRENCY.CAD:
            return 'CA';
        case CONST.CURRENCY.GBP:
            return 'GB';
        case CONST.CURRENCY.NZD:
            return 'NZ';
        default:
            return '';
    }
};

function Confirmation({onNext}: SubStepProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [reimbursementAccount] = useOnyx(ONYXKEYS.REIMBURSEMENT_ACCOUNT);
    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);

    const policyID = reimbursementAccount?.achData?.policyID ?? '-1';
    const [policy] = useOnyx(`${ONYXKEYS.COLLECTION.POLICY}${policyID}`);
    const currency = policy?.outputCurrency ?? '';

    const shouldAllowChange = currency === CONST.CURRENCY.EUR;
    const currencyMappedToCountry = mapCurrencyToCountry(currency);

    // extra check to determine if draft country is european is needed to cover (non EUR => EUR currency change)
    const countryDraftValue = nonUSDReimbursementAccountDraft?.[INPUT_IDS.COUNTRY_STEP.COUNTRY] ?? '';
    const [selectedCountry, setSelectedCountry] = useState(countryDraftValue);

    const disableSubmit = !(currency in CONST.CURRENCY);

    const handleSettingsPress = () => {
        Navigation.navigate(ROUTES.WORKSPACE_PROFILE.getRoute(policyID));
    };

    const handleSelectingCountry = (country: string) => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM, {[INPUT_IDS.COUNTRY_STEP.COUNTRY]: country});
        setSelectedCountry(country);
    };

    const validate = useCallback(
        (values: FormOnyxValues<typeof ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM>): FormInputErrors<typeof ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM> => {
            return ValidationUtils.getFieldRequiredErrors(values, [INPUT_IDS.COUNTRY_STEP.COUNTRY]);
        },
        [],
    );

    useEffect(() => {
        if (currency === CONST.CURRENCY.EUR) {
            return;
        }

        setSelectedCountry(currencyMappedToCountry);
    }, [countryDraftValue, currency, currencyMappedToCountry]);

    return (
        <SafeAreaConsumer>
            {({safeAreaPaddingBottomStyle}) => (
                <ScrollView
                    style={styles.pt0}
                    contentContainerStyle={[styles.flexGrow1, safeAreaPaddingBottomStyle]}
                >
                    <Text style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mb3]}>{translate('countryStep.confirmBusinessBank')}</Text>
                    <MenuItemWithTopDescription
                        description={translate('common.currency')}
                        title={currency}
                        interactive={false}
                    />
                    <Text style={[styles.ph5, styles.mb3, styles.mutedTextLabel]}>
                        {`${translate('countryStep.yourBusiness')} ${translate('countryStep.youCanChange')}`}
                        {` `}
                        <PressableWithoutFeedback
                            accessibilityRole="button"
                            accessibilityLabel={translate('common.settings')}
                            accessible
                            onPress={handleSettingsPress}
                        >
                            <Text style={[styles.label, styles.textBlue]}>{translate('common.settings').toLowerCase()}</Text>
                        </PressableWithoutFeedback>
                        .
                    </Text>
                    <FormProvider
                        formID={ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM}
                        submitButtonText={translate('common.confirm')}
                        validate={validate}
                        onSubmit={onNext}
                        style={[styles.flexGrow1]}
                        submitButtonStyles={[styles.mh5]}
                        isSubmitDisabled={disableSubmit}
                    >
                        <InputWrapper
                            InputComponent={PushRowWithModal}
                            optionsList={CONST.ALL_COUNTRIES}
                            selectedOption={selectedCountry}
                            onOptionChange={handleSelectingCountry}
                            description={translate('common.country')}
                            modalHeaderTitle={translate('countryStep.selectCountry')}
                            searchInputTitle={translate('countryStep.findCountry')}
                            shouldAllowChange={shouldAllowChange}
                            value={selectedCountry}
                            inputID={INPUT_IDS.COUNTRY_STEP.COUNTRY}
                        />
                    </FormProvider>
                </ScrollView>
            )}
        </SafeAreaConsumer>
    );
}

Confirmation.displayName = 'Confirmation';

export default Confirmation;
