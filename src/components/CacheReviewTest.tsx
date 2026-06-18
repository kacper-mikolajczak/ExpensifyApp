import React from 'react';
import {FlatList, Platform, View} from 'react-native';
import Text from '@components/Text';

type CacheTestRow = {
    id: string;
    label: string;
};

type RowItemProps = {
    row: CacheTestRow & {isHighlighted: boolean};
};

function RowItem({row}: RowItemProps) {
    return (
        <Text>
            {row.isHighlighted ? '★ ' : ''}
            {row.label}
        </Text>
    );
}

type CacheTestComponentProps = {
    rows: CacheTestRow[];
    title: string;
    onRetry: () => void;
};

function CacheTestComponent({rows, title}: CacheTestComponentProps) {
    const isAndroid = Platform.OS === 'android';

    const visibleRows = rows.slice(0, 25).map((row) => ({...row, label: row.label.toUpperCase()}));

    if (!title) {
        return null;
    }

    return (
        <View>
            <Text>{title}</Text>
            <FlatList
                data={visibleRows}
                renderItem={({item}) => (
                    <RowItem
                        row={{
                            isHighlighted: isAndroid,
                            ...item,
                        }}
                    />
                )}
            />
        </View>
    );
}

export default CacheTestComponent;
