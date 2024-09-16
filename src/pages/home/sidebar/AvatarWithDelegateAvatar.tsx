import React from 'react';
import {View} from 'react-native';
import type {StyleProp} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import type {ViewStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import Avatar from '@components/Avatar';
import useThemeStyles from '@hooks/useThemeStyles';
import * as UserUtils from '@libs/UserUtils';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ProfileAvatarWithIndicator from './ProfileAvatarWithIndicator';

type AvatarWithDelegateAvatarProps = {
    /** Emoji status */
    delegateEmail: string;

    /** Whether the avatar is selected */
    isSelected?: boolean;

    /** Style for the Avatar container */
    containerStyle?: StyleProp<ViewStyle>;
};

function AvatarWithDelegateAvatar({delegateEmail, isSelected = false, containerStyle}: AvatarWithDelegateAvatarProps) {
    const styles = useThemeStyles();
    const personalDetails = useOnyx(ONYXKEYS.PERSONAL_DETAILS_LIST);
    const delegatePersonalDetail = Object.values(personalDetails[0] ?? {}).find((personalDetail) => personalDetail?.login?.toLowerCase() === delegateEmail);

    return (
        <View style={[styles.sidebarStatusAvatarContainer, containerStyle]}>
            <ProfileAvatarWithIndicator isSelected={isSelected} />
            <View style={[styles.sidebarStatusAvatar]}>
                <View style={styles.emojiStatusLHN}>
                    <Avatar
                        size={CONST.AVATAR_SIZE.SMALL}
                        source={UserUtils.getSmallSizeAvatar(delegatePersonalDetail?.avatar, delegatePersonalDetail?.accountID)}
                        fallbackIcon={delegatePersonalDetail?.fallbackIcon}
                        type={CONST.ICON_TYPE_AVATAR}
                    />
                </View>
            </View>
        </View>
    );
}

AvatarWithDelegateAvatar.displayName = 'AvatarWithDelegateAvatar';

export default AvatarWithDelegateAvatar;
