import React, {useState} from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import MenuItemWithTopDescription from '@components/MenuItemWithTopDescription';
import useLocalize from '@hooks/useLocalize';
import type {Country} from '@src/CONST';
import CONST from '@src/CONST';
import CountryModal from './CountryModal';

type CountryPickerProps = {
    /** The list of countries that we want to display where key is country code and value is country name */
    countryList: Record<string, string>;

    /** The currently selected country */
    selectedCountry: Country;

    /** Function to call when the user selects a country */
    onCountryChange: (country: Country) => void;

    /** Whether the selected country is editable */
    isEditable: boolean;

    /** Additional styles to apply to container */
    wrapperStyles?: StyleProp<ViewStyle>;
};

function CountryPicker({selectedCountry, onCountryChange, isEditable, countryList, wrapperStyles}: CountryPickerProps) {
    const {translate} = useLocalize();

    const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);

    const handleCountryModalClose = () => {
        setIsCountryModalVisible(false);
    };

    const handleCountryModalOpen = () => {
        setIsCountryModalVisible(true);
    };

    return (
        <>
            <MenuItemWithTopDescription
                description={translate('common.country')}
                title={CONST.ALL_COUNTRIES[selectedCountry]}
                interactive={isEditable}
                shouldShowRightIcon={isEditable}
                onPress={handleCountryModalOpen}
                wrapperStyle={wrapperStyles}
            />
            <CountryModal
                isVisible={isCountryModalVisible}
                selectedCountry={selectedCountry}
                onCountryChange={onCountryChange}
                onClose={handleCountryModalClose}
                countryList={countryList}
            />
        </>
    );
}

CountryPicker.displayName = 'CountryPicker';

export default CountryPicker;
