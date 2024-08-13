import React, {useState} from 'react';
import {View} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import Button from '@components/Button';
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
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';

function Confirmation({onNext}: SubStepProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const [selectedCountry, setSelectedCountry] = useState('PL');
    const [reimbursementAccount] = useOnyx(ONYXKEYS.REIMBURSEMENT_ACCOUNT);
    const policyID = reimbursementAccount?.achData?.policyID ?? '-1';

    const handleSettingsPress = () => {
        Navigation.navigate(ROUTES.WORKSPACE_PROFILE.getRoute(policyID));
    };

    const currency = 'EUR';
    const shouldAllowChange = currency === 'EUR';

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
                    <PushRowWithModal
                        optionsList={CONST.ALL_COUNTRIES}
                        selectedOption={selectedCountry}
                        onOptionChange={setSelectedCountry}
                        description={translate('common.country')}
                        modalHeaderTitle={translate('countryStep.selectCountry')}
                        searchInputTitle={translate('countryStep.findCountry')}
                        shouldAllowChange={shouldAllowChange}
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
