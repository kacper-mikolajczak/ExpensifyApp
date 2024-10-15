import type {OnyxEntry} from 'react-native-onyx';
import CONST from '@src/CONST';
import type {ReimbursementAccountForm} from '@src/types/form';

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

function getValuesForOwner(ownerBeingModifiedID: string, reimbursementAccountDraft: OnyxEntry<ReimbursementAccountForm>): OwnerValues {
    if (!reimbursementAccountDraft) {
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
        firstName: reimbursementAccountDraft[INPUT_KEYS.firstName] ?? '',
        lastName: reimbursementAccountDraft[INPUT_KEYS.lastName] ?? '',
        ownershipPercentage: reimbursementAccountDraft[INPUT_KEYS.ownershipPercentage] ?? '',
        dob: reimbursementAccountDraft[INPUT_KEYS.dob] ?? '',
        ssnLast4: reimbursementAccountDraft[INPUT_KEYS.ssnLast4] ?? '',
        street: reimbursementAccountDraft[INPUT_KEYS.street] ?? '',
        city: reimbursementAccountDraft[INPUT_KEYS.city] ?? '',
        state: reimbursementAccountDraft[INPUT_KEYS.state] ?? '',
        zipCode: reimbursementAccountDraft[INPUT_KEYS.zipCode] ?? '',
        country: reimbursementAccountDraft[INPUT_KEYS.country] ?? '',
    };
}

export default getValuesForOwner;
