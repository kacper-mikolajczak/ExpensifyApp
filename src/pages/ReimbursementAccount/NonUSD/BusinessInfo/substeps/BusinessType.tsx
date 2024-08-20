import React, {useState} from 'react';
import {useOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import PushRowWithModal from '@components/PushRowWithModal';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useNonUSDReimbursementAccountStepFormSubmit from '@hooks/useNonUSDReimbursementAccountStepFormSubmit';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import {applicantType, natureOfBusiness} from '@pages/ReimbursementAccount/NonUSD/BusinessInfo/mockedCorpayLists';
import * as FormActions from '@userActions/FormActions';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

type BusinessTypeProps = SubStepProps;

const BUSINESS_INFO_STEP_KEY = INPUT_IDS.BUSINESS_INFO_STEP;
const STEP_FIELDS = [BUSINESS_INFO_STEP_KEY.BUSINESS_CATEGORY, BUSINESS_INFO_STEP_KEY.BUSINESS_TYPE];

function BusinessType({onNext, isEditing}: BusinessTypeProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);

    const incorporationTypeDefaultValue = nonUSDReimbursementAccountDraft?.[BUSINESS_INFO_STEP_KEY.BUSINESS_TYPE] ?? '';
    const businessCategoryDefaultValue = nonUSDReimbursementAccountDraft?.[BUSINESS_INFO_STEP_KEY.BUSINESS_CATEGORY] ?? '';

    const [selectedIncorporationType, setSelectedIncorporationType] = useState(incorporationTypeDefaultValue);
    const [selectedBusinessCategory, setSelectedBusinessCategory] = useState(businessCategoryDefaultValue);

    const handleSelectingIncorporationType = (incorporationType: string) => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM, {[BUSINESS_INFO_STEP_KEY.BUSINESS_TYPE]: incorporationType});
        setSelectedIncorporationType(incorporationType);
    };

    const handleSelectingBusinessCategory = (businessCategory: string) => {
        FormActions.setDraftValues(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM, {[BUSINESS_INFO_STEP_KEY.BUSINESS_CATEGORY]: businessCategory});
        setSelectedBusinessCategory(businessCategory);
    };

    const handleSubmit = useNonUSDReimbursementAccountStepFormSubmit({
        fieldIds: STEP_FIELDS,
        onNext,
        shouldSaveDraft: isEditing,
    });

    const incorporationTypeListOptions = applicantType.reduce((accumulator, currentValue) => {
        accumulator[currentValue.name] = currentValue.stringValue;
        return accumulator;
    }, {} as Record<string, string>);
    const businessCategoryListOptions = natureOfBusiness.reduce((accumulator, currentValue) => {
        accumulator[currentValue.name] = currentValue.stringValue;
        return accumulator;
    }, {} as Record<string, string>);

    return (
        <FormProvider
            formID={ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM}
            submitButtonText={translate(isEditing ? 'common.confirm' : 'common.next')}
            onSubmit={handleSubmit}
            style={[styles.flexGrow1]}
            submitButtonStyles={[styles.mh5]}
        >
            <Text style={[styles.textHeadlineLineHeightXXL, styles.mh5, styles.mb3]}>{translate('businessInfoStep.whatTypeOfBusinessIsIt')}</Text>
            <PushRowWithModal
                optionsList={incorporationTypeListOptions}
                selectedOption={selectedIncorporationType}
                onOptionChange={handleSelectingIncorporationType}
                description={translate('businessInfoStep.incorporationTypeName')}
                modalHeaderTitle={translate('businessInfoStep.selectIncorporationType')}
                searchInputTitle={translate('businessInfoStep.findIncorporationType')}
            />
            <PushRowWithModal
                optionsList={businessCategoryListOptions}
                selectedOption={selectedBusinessCategory}
                onOptionChange={handleSelectingBusinessCategory}
                description={translate('businessInfoStep.businessCategory')}
                modalHeaderTitle={translate('businessInfoStep.selectBusinessCategory')}
                searchInputTitle={translate('businessInfoStep.findBusinessCategory')}
            />
        </FormProvider>
    );
}

BusinessType.displayName = 'BusinessType';

export default BusinessType;
