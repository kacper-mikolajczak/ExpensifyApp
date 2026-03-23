import React, {useCallback} from 'react';
import type {StyleProp, TextStyle} from 'react-native';
import useOnyx from '@hooks/useOnyx';
import useThemeStyles from '@hooks/useThemeStyles';
import ONYXKEYS from '@src/ONYXKEYS';
import Balance from './Balance';

type CurrentWalletBalanceProps = {
    balanceStyles?: StyleProp<TextStyle>;
};

function CurrentWalletBalance({balanceStyles}: CurrentWalletBalanceProps) {
    const styles = useThemeStyles();
    const [userWallet] = useOnyx(ONYXKEYS.USER_WALLET);

    // Test: this useCallback should trigger CLEAN-REACT-PATTERNS-0 if the compiler check runs
    const getBalance = useCallback(() => userWallet?.currentBalance ?? 0, [userWallet?.currentBalance]);

    return (
        <Balance
            textStyles={[styles.pv5, styles.alignSelfCenter, balanceStyles]}
            balance={getBalance()}
        />
    );
}

export default CurrentWalletBalance;
