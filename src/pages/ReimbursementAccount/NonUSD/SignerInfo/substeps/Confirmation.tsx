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
import ONYXKEYS from '@src/ONYXKEYS';
import INPUT_IDS from '@src/types/form/NonUSDReimbursementAccountForm';

const SINGER_INFO_STEP_KEYS = INPUT_IDS.SIGNER_INFO_STEP;
const {FIRST_NAME, LAST_NAME, JOB_TITLE, DOB, ID, PROOF_OF_ADDRESS} = INPUT_IDS.SIGNER_INFO_STEP;

function Confirmation({onNext, onMove}: SubStepProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const [nonUSDReimbursementAccountDraft] = useOnyx(ONYXKEYS.FORMS.NON_USD_REIMBURSEMENT_ACCOUNT_FORM_DRAFT);
    const isUserOwner = nonUSDReimbursementAccountDraft?.[INPUT_IDS.OWNERSHIP_INFO_STEP.OWNS_MORE_THAN_25_PERCENT] ?? false;
    const values = useMemo(() => getSubStepValues(SINGER_INFO_STEP_KEYS, nonUSDReimbursementAccountDraft), [nonUSDReimbursementAccountDraft]);

    return (
        <SafeAreaConsumer>
            {({safeAreaPaddingBottomStyle}) => (
                <ScrollView
                    style={styles.pt0}
                    contentContainerStyle={[styles.flexGrow1, safeAreaPaddingBottomStyle]}
                >
                    <Text style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mb3]}>{translate('signerInfoStep.letsDoubleCheck')}</Text>
                    {!isUserOwner && (
                        <MenuItemWithTopDescription
                            description={translate('signerInfoStep.legalName')}
                            title={`${values[FIRST_NAME]} ${values[LAST_NAME]}`}
                            shouldShowRightIcon
                            onPress={() => {
                                onMove(0);
                            }}
                        />
                    )}
                    <MenuItemWithTopDescription
                        description={translate('signerInfoStep.jobTitle')}
                        title={values[JOB_TITLE]}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(1);
                        }}
                    />
                    {!isUserOwner && (
                        <MenuItemWithTopDescription
                            description={translate('common.dob')}
                            title={values[DOB]}
                            shouldShowRightIcon
                            onPress={() => {
                                onMove(2);
                            }}
                        />
                    )}
                    <MenuItemWithTopDescription
                        description={translate('signerInfoStep.id')}
                        title={values[ID]}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(3);
                        }}
                    />
                    <MenuItemWithTopDescription
                        description={translate('signerInfoStep.proofOf')}
                        title={values[PROOF_OF_ADDRESS]}
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(3);
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
