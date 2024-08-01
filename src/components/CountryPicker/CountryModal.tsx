import React, {useEffect, useState} from 'react';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import Modal from '@components/Modal';
import ScreenWrapper from '@components/ScreenWrapper';
import SelectionList from '@components/SelectionList';
import RadioListItem from '@components/SelectionList/RadioListItem';
import useLocalize from '@hooks/useLocalize';
import CONST from '@src/CONST';
import type {Country} from '@src/CONST';

type ListItemType = {
    value: Country;
    text: string;
    keyForList: string;
    isSelected: boolean;
};

type CountryModalProps = {
    /** Whether the modal is visible */
    isVisible: boolean;

    /** The currently selected country */
    selectedCountry: Country;

    /** Function to call when the user selects a country */
    onCountryChange: (country: Country) => void;

    /** Function to call when the user closes the modal */
    onClose: () => void;

    /** List of countries */
    countryList: Record<string, string>;
};

function CountryModal({isVisible, onCountryChange, onClose, selectedCountry, countryList}: CountryModalProps) {
    const {translate} = useLocalize();

    const [searchbarInputText, setSearchbarInputText] = useState('');
    const [countryListItems, setCountryListItems] = useState(
        Object.entries(countryList).map(([key, value]) => ({
            value: key as Country,
            text: value,
            keyForList: key,
            isSelected: key === selectedCountry,
        })),
    );

    useEffect(() => {
        setCountryListItems((prevCountryListItems) =>
            prevCountryListItems.map((country) => ({
                ...country,
                isSelected: country.value === selectedCountry,
            })),
        );
    }, [selectedCountry]);

    const filterShownCountries = (searchText: string) => {
        setSearchbarInputText(searchText);
        const searchWords = searchText.toLowerCase().match(/[a-z0-9]+/g) ?? [];
        setCountryListItems(
            countryListItems.filter((country) =>
                searchWords.every((word) =>
                    country.text
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, ' ')
                        .includes(word),
                ),
            ),
        );
    };

    const handleSelectRow = (country: ListItemType) => {
        onCountryChange(country.value);
        onClose();
    };

    return (
        <Modal
            onClose={onClose}
            isVisible={isVisible}
            type={CONST.MODAL.MODAL_TYPE.RIGHT_DOCKED}
            onModalHide={onClose}
            shouldUseCustomBackdrop
        >
            <ScreenWrapper
                includeSafeAreaPaddingBottom={false}
                testID={CountryModal.displayName}
            >
                <HeaderWithBackButton
                    title={translate('countryStep.selectCountry')}
                    onBackButtonPress={onClose}
                />
                <SelectionList
                    headerMessage={searchbarInputText.trim() && !searchbarInputText.length ? translate('common.noResultsFound') : ''}
                    textInputLabel={translate('countryStep.selectCountry')}
                    textInputValue={searchbarInputText}
                    onChangeText={filterShownCountries}
                    onSelectRow={handleSelectRow}
                    shouldDebounceRowSelect
                    sections={[{data: countryListItems}]}
                    initiallyFocusedOptionKey={countryListItems.find((country) => country.value === selectedCountry)?.keyForList}
                    showScrollIndicator
                    shouldShowTooltips={false}
                    ListItem={RadioListItem}
                />
            </ScreenWrapper>
        </Modal>
    );
}

CountryModal.displayName = 'CountryModal';

export type {ListItemType};

export default CountryModal;
