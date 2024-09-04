import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import Button from '@components/Button';
import MenuItemWithTopDescription from '@components/MenuItemWithTopDescription';
import SafeAreaConsumer from '@components/SafeAreaConsumer';
import ScrollView from '@components/ScrollView';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import {annualVolumeRange, applicantType, natureOfBusiness} from '@pages/ReimbursementAccount/NonUSD/BusinessInfo/mockedCorpayLists';
import getSubStepValues from '@pages/ReimbursementAccount/NonUSD/utils/getSubStepValues';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

const BUSINESS_INFO_STEP_KEYS = INPUT_IDS.BUSINESS_INFO_STEP;
const {NAME, REGISTRATION_NUMBER, STREET, CITY, STATE, ZIP_CODE, PHONE, INCORPORATION_COUNTRY, PAYMENT_VOLUME, BUSINESS_TYPE, BUSINESS_CATEGORY} = INPUT_IDS.BUSINESS_INFO_STEP;

const displayStringValue = (list: Array<{id: string; name: string; stringValue: string}>, matchingName: string) => {
    return list.find((item) => item.name === matchingName)?.stringValue ?? '';
};

function Confirmation({onNext, onMove}: SubStepProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);

    const values = useMemo(() => getSubStepValues(BUSINESS_INFO_STEP_KEYS, nonUSDReimbursementAccountDraft), [nonUSDReimbursementAccountDraft]);

    const paymentVolume = useMemo(() => displayStringValue(annualVolumeRange, values[PAYMENT_VOLUME]), [values]);
    const businessCategory = useMemo(() => displayStringValue(natureOfBusiness, values[BUSINESS_CATEGORY]), [values]);
    const businessType = useMemo(() => displayStringValue(applicantType, values[BUSINESS_TYPE]), [values]);

    return (
        <SafeAreaConsumer>
            {({safeAreaPaddingBottomStyle}) => (
                <ScrollView
                    style={styles.pt0}
                    contentContainerStyle={[styles.flexGrow1, safeAreaPaddingBottomStyle]}
                >
                    <Text style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mb3]}>{translate('businessInfoStep.letsDoubleCheck')}</Text>
                    <MenuItemWithTopDescription
                        description={translate('businessInfoStep.legalBusinessName')}
                        title={values[NAME]}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(0);
                        }}
                    />
                    <MenuItemWithTopDescription
                        description={translate('businessInfoStep.registrationNumber')}
                        title={values[REGISTRATION_NUMBER]}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(3);
                        }}
                    />
                    <MenuItemWithTopDescription
                        description={translate('businessInfoStep.businessAddress')}
                        title={`${values[STREET]}, ${values[CITY]}, ${values[STATE]}, ${values[ZIP_CODE]}`}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(1);
                        }}
                    />
                    <MenuItemWithTopDescription
                        description={translate('common.phoneNumber')}
                        // TODO default value for country code
                        title={`${CONST.COUNTRY_PHONE_NUMBER_CODES.AF}${values[PHONE]}`}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(2);
                        }}
                    />
                    <MenuItemWithTopDescription
                        description={translate('businessInfoStep.businessType')}
                        title={businessType}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(5);
                        }}
                    />
                    <MenuItemWithTopDescription
                        description={translate('businessInfoStep.incorporation')}
                        title={values[INCORPORATION_COUNTRY]}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(4);
                        }}
                    />
                    <MenuItemWithTopDescription
                        description={translate('businessInfoStep.businessCategory')}
                        title={businessCategory}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(5);
                        }}
                    />
                    <MenuItemWithTopDescription
                        description={translate('businessInfoStep.annualPaymentVolume')}
                        title={paymentVolume}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(6);
                        }}
                    />
                    <View style={[styles.p5, styles.flexGrow1, styles.justifyContentEnd]}>
                        <Button
                            success
                            style={[styles.w100]}
                            onPress={onNext}
                            large
                            text={translate('common.confirm')}
                        />
                    </View>
                </ScrollView>
            )}
        </SafeAreaConsumer>
    );
}

Confirmation.displayName = 'Confirmation';

export default Confirmation;
