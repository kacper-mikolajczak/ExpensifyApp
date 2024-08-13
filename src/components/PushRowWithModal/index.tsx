import React, {useState} from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import MenuItemWithTopDescription from '@components/MenuItemWithTopDescription';
import PushRowModal from './PushRowModal';

type PushRowWithModalProps = {
    /** The list of options that we want to display where key is option code and value is option name */
    optionsList: Record<string, string>;

    /** The currently selected option */
    selectedOption: string;

    /** Function to call when the user selects an option */
    onOptionChange: (option: string) => void;

    /** Additional styles to apply to container */
    wrapperStyles?: StyleProp<ViewStyle>;

    /** The description for the picker */
    description: string;

    /** The title of the modal */
    modalHeaderTitle: string;

    /** The title of the search input */
    searchInputTitle: string;

    /** Whether the selected option is editable */
    shouldAllowChange?: boolean;
};

function PushRowWithModal({selectedOption, onOptionChange, optionsList, wrapperStyles, description, modalHeaderTitle, searchInputTitle, shouldAllowChange = true}: PushRowWithModalProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const handleModalOpen = () => {
        setIsModalVisible(true);
    };

    return (
        <>
            <MenuItemWithTopDescription
                description={description}
                title={optionsList[selectedOption]}
                shouldShowRightIcon
                onPress={handleModalOpen}
                wrapperStyle={wrapperStyles}
                interactive={shouldAllowChange}
            />
            <PushRowModal
                isVisible={isModalVisible}
                selectedOption={selectedOption}
                onOptionChange={onOptionChange}
                onClose={handleModalClose}
                optionsList={optionsList}
                headerTitle={modalHeaderTitle}
                searchInputTitle={searchInputTitle}
            />
        </>
    );
}

PushRowWithModal.displayName = 'PushRowWithModal';

export default PushRowWithModal;
