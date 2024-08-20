import type {OnyxEntry} from 'react-native-onyx';
import type {NonUSDReimbursementAccountForm} from '@src/types/form';

type SubStepValues<TProps extends keyof NonUSDReimbursementAccountForm> = {
    [TKey in TProps]: NonUSDReimbursementAccountForm[TKey];
};

// TODO will need further tweaking once BE comes
function getSubStepValues<TProps extends keyof NonUSDReimbursementAccountForm>(
    inputKeys: Record<string, TProps>,
    nonUSDReimbursementAccountDraft: OnyxEntry<NonUSDReimbursementAccountForm>,
): SubStepValues<TProps> {
    return Object.entries(inputKeys).reduce((acc, [, value]) => {
        acc[value] = (nonUSDReimbursementAccountDraft?.[value] ?? '') as NonUSDReimbursementAccountForm[TProps];
        return acc;
    }, {} as SubStepValues<TProps>);
}

export default getSubStepValues;
