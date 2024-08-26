import React from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {View} from 'react-native';
import type {ValueOf} from 'type-fest';
import useLocalize from '@hooks/useLocalize';
import useTheme from '@hooks/useTheme';
import useThemeStyles from '@hooks/useThemeStyles';
import CONST from '@src/CONST';
import type {FileObject} from './AttachmentModal';
import AttachmentPicker from './AttachmentPicker';
import Button from './Button';
import Icon from './Icon';
import * as Expensicons from './Icon/Expensicons';
import {PressableWithFeedback} from './Pressable';
import Text from './Text';

type UploadFileProps = {
    /** Text displayed on button when no file is uploaded */
    buttonText: string;

    /** Name of currently uploaded file */
    uploadedFileName: string;

    /** Handler that fires when file is selected for upload */
    onUpload: (fileURL: string) => void;

    /** Handler that fires when file is removed */
    onRemove: () => void;

    /** Array containing accepted file types */
    acceptedFileTypes: Array<ValueOf<typeof CONST.API_ATTACHMENT_VALIDATIONS.ALLOWED_RECEIPT_EXTENSIONS>>;

    /** Max file size in MB */
    maxFileSize: number;

    /** Styles to be assigned to Container */
    style?: StyleProp<ViewStyle>;
};

function UploadFile({buttonText, uploadedFileName, onUpload, onRemove, acceptedFileTypes, maxFileSize, style}: UploadFileProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const theme = useTheme();

    const handleFileUpload = (file: FileObject) => {
        onUpload(file?.name ?? '');
    };

    return (
        <View style={[styles.alignItemsStart, style]}>
            {uploadedFileName !== '' ? (
                <View style={[styles.flexRow, styles.alignItemsCenter, styles.justifyContentCenter, styles.border, styles.p4]}>
                    <Icon
                        height={20}
                        width={14}
                        src={Expensicons.Paperclip}
                        fill={theme.textSupporting}
                    />
                    <Text style={[styles.ml4, styles.mr3, styles.textBold]}>{uploadedFileName}</Text>
                    <PressableWithFeedback
                        onPress={onRemove}
                        role={CONST.ROLE.BUTTON}
                        accessibilityLabel={translate('common.remove')}
                    >
                        <Icon
                            height={16}
                            width={16}
                            src={Expensicons.Close}
                            fill={theme.textSupporting}
                        />
                    </PressableWithFeedback>
                </View>
            ) : (
                <AttachmentPicker acceptedFileTypes={acceptedFileTypes}>
                    {({openPicker}) => (
                        <Button
                            medium
                            style={[styles.mb6]}
                            text={buttonText}
                            accessibilityLabel={buttonText}
                            onPress={() => {
                                openPicker({
                                    onPicked: handleFileUpload,
                                });
                            }}
                        />
                    )}
                </AttachmentPicker>
            )}
        </View>
    );
}

UploadFile.displayName = 'UploadFile';

export default UploadFile;
