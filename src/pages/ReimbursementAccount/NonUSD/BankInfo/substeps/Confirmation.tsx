import React from 'react';
import {View} from 'react-native';
import Button from '@components/Button';
import MenuItemWithTopDescription from '@components/MenuItemWithTopDescription';
import SafeAreaConsumer from '@components/SafeAreaConsumer';
import ScrollView from '@components/ScrollView';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';

function Confirmation({onNext, onMove}: SubStepProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    return (
        <SafeAreaConsumer>
            {({safeAreaPaddingBottomStyle}) => (
                <ScrollView
                    style={styles.pt0}
                    contentContainerStyle={[styles.flexGrow1, safeAreaPaddingBottomStyle]}
                >
                    <Text style={[styles.textHeadlineLineHeightXXL, styles.ph5, styles.mb3]}>{translate('bankInfoStep.letsDoubleCheck')}</Text>
                    <Text style={[styles.mutedTextLabel, styles.ph5, styles.mb5]}>{translate('bankInfoStep.thisBankAccount')}</Text>
                    <MenuItemWithTopDescription
                        description={translate('bankInfoStep.accountNumber')}
                        title="123456789"
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(0);
                        }}
                    />
                    <MenuItemWithTopDescription
                        description={translate('bankInfoStep.routingNumber')}
                        title="987654321"
                        shouldShowRightIcon
                        onPress={() => {
                            onMove(0);
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
