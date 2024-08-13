import React from 'react';
import {View} from 'react-native';
import Button from '@components/Button';
import * as Expensicons from '@components/Icon/Expensicons';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';

function HangTight({tempSubmit}: {tempSubmit: () => void}) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const handleSendReminder = () => {
        // TODO remove that
        tempSubmit();
    };

    return (
        <>
            <View style={[styles.flexGrow1, styles.justifyContentCenter, styles.alignItemsCenter]}>
                <Text style={[styles.textHeadlineLineHeightXXL, styles.mh5, styles.mb3]}>{translate('signerInfoStep.hangTight')}</Text>
            </View>
            <View style={[styles.ph5, styles.pb5, styles.flexGrow1, styles.justifyContentEnd]}>
                <Button
                    success
                    style={[styles.w100]}
                    onPress={handleSendReminder}
                    large
                    icon={Expensicons.Bell}
                    text={translate('signerInfoStep.sendReminder')}
                />
            </View>
        </>
    );
}

HangTight.displayName = 'HangTight';

export default HangTight;
