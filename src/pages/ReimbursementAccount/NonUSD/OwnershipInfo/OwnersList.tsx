import React from 'react';
import Button from '@components/Button';
import SafeAreaConsumer from '@components/SafeAreaConsumer';
import ScrollView from '@components/ScrollView';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useNetwork from '@hooks/useNetwork';
import useThemeStyles from '@hooks/useThemeStyles';

type OwnersListProps = {
    /** Method called when user confirms data */
    handleConfirmation: () => void;

    /** Method called when user presses on one of owners to edit its data */
    handleOwnerEdit: (value: string) => void;

    /** List of owner keys */
    ownerKeys: string[];

    /** Info is user an owner */
    isUserOwner: boolean;

    /** Info about other existing owners */
    isAnyoneElseOwner: boolean;
};

function OwnersList({isAnyoneElseOwner, isUserOwner, handleConfirmation, ownerKeys, handleOwnerEdit}: OwnersListProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const {isOffline} = useNetwork();

    return (
        <SafeAreaConsumer>
            {({safeAreaPaddingBottomStyle}) => (
                <ScrollView
                    style={styles.pt0}
                    contentContainerStyle={[styles.flexGrow1, styles.ph0, safeAreaPaddingBottomStyle]}
                >
                    <Text style={[styles.textHeadlineLineHeightXXL, styles.ph5]}>{translate('beneficialOwnerInfoStep.letsDoubleCheck')}</Text>
                    <Text style={[styles.p5, styles.textSupporting]}>{translate('beneficialOwnerInfoStep.regulationRequiresUsToVerifyTheIdentity')}</Text>
                    <Button
                        success
                        large
                        isDisabled={isOffline}
                        style={[styles.w100, styles.mt2, styles.pb5, styles.ph5]}
                        onPress={handleConfirmation}
                        text={translate('common.confirm')}
                    />
                </ScrollView>
            )}
        </SafeAreaConsumer>
    );
}

OwnersList.displayName = 'OwnersList';

export default OwnersList;
