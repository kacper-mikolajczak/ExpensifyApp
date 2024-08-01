import React from 'react';
import ScreenWrapper from '@components/ScreenWrapper';
import Text from '@components/Text';

function Finish() {
    return (
        <ScreenWrapper
            testID={Finish.displayName}
            includeSafeAreaPaddingBottom={false}
            shouldEnablePickerAvoiding={false}
            shouldEnableMaxHeight
        >
            <Text>Finish</Text>
        </ScreenWrapper>
    );
}

Finish.displayName = 'Finish';

export default Finish;
