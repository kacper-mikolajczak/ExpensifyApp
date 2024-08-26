import type {OnyxEntry} from 'react-native-onyx';
import CONST from '@src/CONST';
import type {NonUSDReimbursementAccountForm} from '@src/types/form';

type OwnerValues = {
    firstName: string;
    lastName: string;
    ownershipPercentage: string;
    dob: string;
    ssnLast4: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
};

function getValuesForOwner(ownerBeingModifiedID: string, nonUSDReimbursementAccountDraft: OnyxEntry<NonUSDReimbursementAccountForm>): OwnerValues {
    if (!nonUSDReimbursementAccountDraft) {
        return {
            firstName: '',
            lastName: '',
            ownershipPercentage: '',
            dob: '',
            ssnLast4: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
        };
    }
    const ownerPrefix = CONST.NON_USD_BANK_ACCOUNT.OWNERSHIP_INFO_STEP.OWNER_DATA.PREFIX;
    const ownerInfoKey = CONST.NON_USD_BANK_ACCOUNT.OWNERSHIP_INFO_STEP.OWNER_DATA;

    const INPUT_KEYS = {
        firstName: `${ownerPrefix}_${ownerBeingModifiedID}_${ownerInfoKey.FIRST_NAME}`,
        lastName: `${ownerPrefix}_${ownerBeingModifiedID}_${ownerInfoKey.LAST_NAME}`,
        ownershipPercentage: `${ownerPrefix}_${ownerBeingModifiedID}_${ownerInfoKey.OWNERSHIP_PERCENTAGE}`,
        dob: `${ownerPrefix}_${ownerBeingModifiedID}_${ownerInfoKey.DOB}`,
        ssnLast4: `${ownerPrefix}_${ownerBeingModifiedID}_${ownerInfoKey.SSN_LAST_4}`,
        street: `${ownerPrefix}_${ownerBeingModifiedID}_${ownerInfoKey.STREET}`,
        city: `${ownerPrefix}_${ownerBeingModifiedID}_${ownerInfoKey.CITY}`,
        state: `${ownerPrefix}_${ownerBeingModifiedID}_${ownerInfoKey.STATE}`,
        zipCode: `${ownerPrefix}_${ownerBeingModifiedID}_${ownerInfoKey.ZIP_CODE}`,
        country: `${ownerPrefix}_${ownerBeingModifiedID}_${ownerInfoKey.COUNTRY}`,
    } as const;

    return {
        firstName: nonUSDReimbursementAccountDraft[INPUT_KEYS.firstName] ?? '',
        lastName: nonUSDReimbursementAccountDraft[INPUT_KEYS.lastName] ?? '',
        ownershipPercentage: nonUSDReimbursementAccountDraft[INPUT_KEYS.ownershipPercentage] ?? '',
        dob: nonUSDReimbursementAccountDraft[INPUT_KEYS.dob] ?? '',
        ssnLast4: nonUSDReimbursementAccountDraft[INPUT_KEYS.ssnLast4] ?? '',
        street: nonUSDReimbursementAccountDraft[INPUT_KEYS.street] ?? '',
        city: nonUSDReimbursementAccountDraft[INPUT_KEYS.city] ?? '',
        state: nonUSDReimbursementAccountDraft[INPUT_KEYS.state] ?? '',
        zipCode: nonUSDReimbursementAccountDraft[INPUT_KEYS.zipCode] ?? '',
        country: nonUSDReimbursementAccountDraft[INPUT_KEYS.country] ?? '',
    };
}

export default getValuesForOwner;
