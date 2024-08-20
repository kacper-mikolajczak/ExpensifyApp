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
import getSubStepValues from '@pages/ReimbursementAccount/NonUSD/utils/getSubStepValues';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

const BUSINESS_INFO_STEP_KEYS = INPUT_IDS.BUSINESS_INFO_STEP;

function Confirmation({onNext, onMove}: SubStepProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);

    const values = useMemo(() => getSubStepValues(BUSINESS_INFO_STEP_KEYS, nonUSDReimbursementAccountDraft), [nonUSDReimbursementAccountDraft]);

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
                        title={values[BUSINESS_INFO_STEP_KEYS.NAME]}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(0);
                        }}
                    />
                    <MenuItemWithTopDescription
                        description={translate('businessInfoStep.registrationNumber')}
                        title={values[BUSINESS_INFO_STEP_KEYS.REGISTRATION_NUMBER]}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(3);
                        }}
                    />
                    <MenuItemWithTopDescription
                        description={translate('businessInfoStep.businessAddress')}
                        title={`${values[BUSINESS_INFO_STEP_KEYS.STREET]}, ${values[BUSINESS_INFO_STEP_KEYS.CITY]}, ${values[BUSINESS_INFO_STEP_KEYS.STATE]}, ${
                            values[BUSINESS_INFO_STEP_KEYS.ZIP_CODE]
                        }, ${values[BUSINESS_INFO_STEP_KEYS.COUNTRY]}`}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(1);
                        }}
                    />
                    <MenuItemWithTopDescription
                        description={translate('common.phoneNumber')}
                        // TODO default value for country code
                        title={`${CONST.COUNTRY_PHONE_NUMBER_CODES.AF}${values[BUSINESS_INFO_STEP_KEYS.PHONE]}`}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(2);
                        }}
                    />
                    <MenuItemWithTopDescription
                        description={translate('businessInfoStep.businessType')}
                        title={values[BUSINESS_INFO_STEP_KEYS.BUSINESS_TYPE]}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(5);
                        }}
                    />
                    <MenuItemWithTopDescription
                        description={translate('businessInfoStep.incorporation')}
                        title={values[BUSINESS_INFO_STEP_KEYS.INCORPORATION_COUNTRY]}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(4);
                        }}
                    />
                    <MenuItemWithTopDescription
                        description={translate('businessInfoStep.businessCategory')}
                        title={values[BUSINESS_INFO_STEP_KEYS.BUSINESS_CATEGORY]}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(5);
                        }}
                    />
                    <MenuItemWithTopDescription
                        description={translate('businessInfoStep.annualPaymentVolume')}
                        title={values[BUSINESS_INFO_STEP_KEYS.PAYMENT_VOLUME]}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(6);
                        }}
                    />
                    <View style={[styles.ph5, styles.pb5, styles.flexGrow1, styles.justifyContentEnd]}>
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
