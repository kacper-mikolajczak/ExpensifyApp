import React from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {View} from 'react-native';
import type {ValueOf} from 'type-fest';
import useLocalize from '@hooks/useLocalize';
import useTheme from '@hooks/useTheme';
import useThemeStyles from '@hooks/useThemeStyles';
import variables from '@styles/variables';
import CONST from '@src/CONST';
import type {FileObject} from './AttachmentModal';
import AttachmentPicker from './AttachmentPicker';
import Button from './Button';
import DotIndicatorMessage from './DotIndicatorMessage';
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

    /** Styles to be assigned to Container */
    style?: StyleProp<ViewStyle>;

    /** Text to display on error message */
    errorText?: string;

    /** Function called whenever option changes */
    onInputChange?: (value: string) => void;
};

function UploadFile({buttonText, uploadedFileName, onUpload, onRemove, acceptedFileTypes, style, errorText = '', onInputChange = () => {}}: UploadFileProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const theme = useTheme();

    const handleFileUpload = (file: FileObject) => {
        onInputChange(file?.name ?? '');
        onUpload(file?.name ?? '');
    };

    return (
        <View style={[styles.alignItemsStart, style]}>
            {uploadedFileName !== '' ? (
                <View style={[styles.flexRow, styles.alignItemsCenter, styles.justifyContentCenter, styles.border, styles.p4]}>
                    <Icon
                        height={variables.iconSizeNormal}
                        width={variables.iconSizeSemiSmall}
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
                            src={Expensicons.Close}
                            fill={theme.textSupporting}
                            small
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
            {errorText !== '' && (
                <DotIndicatorMessage
                    textStyles={[styles.formError]}
                    type="error"
                    messages={{errorText}}
                />
            )}
        </View>
    );
}

UploadFile.displayName = 'UploadFile';

export default UploadFile;
