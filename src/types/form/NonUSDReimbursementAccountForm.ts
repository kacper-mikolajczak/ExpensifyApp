import type {Country} from '@src/CONST';
import type DeepValueOf from '@src/types/utils/DeepValueOf';
import type Form from './Form';

const INPUT_IDS = {
    COUNTRY_STEP: {
        COUNTRY: 'country',
    },
    BANK_INFO_STEP: {
        ACCOUNT_HOLDER_NAME: 'accountHolderName',
        ACCOUNT_NUMBER: 'accountNumber',
        ROUTING_CODE: 'routingCode',
        SWIFT_BIC_CODE: 'swiftBicCode',
        IBAN: 'iban',
        ACCOUNT_HOLDER_COUNTRY: 'accountHolderCountry',
        ACCOUNT_HOLDER_REGION: 'accountHolderRegion',
        ACCOUNT_HOLDER_ADDRESS_LINE1: 'accountHolderAddress1',
        ACCOUNT_HOLDER_ADDRESS_LINE2: 'accountHolderAddress2',
        ACCOUNT_HOLDER_CITY: 'accountHolderCity',
        ACCOUNT_HOLDER_POSTAL_CODE: 'accountHolderPostal',
        ACCOUNT_HOLDER_PHONE: 'accountHolderPhoneNumber',
        ACCOUNT_HOLDER_EMAIL: 'accountHolderEmail',
        BANK_STATEMENT: 'bankStatement',
    },
    BUSINESS_INFO_STEP: {
        NAME: 'companyName',
        STREET: 'street',
        CITY: 'city',
        STATE: 'state',
        ZIP_CODE: 'zipCode',
        COUNTRY: 'country',
        COUNTRY_CODE: 'businessCountryCode',
        PHONE: 'businessContactNumber',
        REGISTRATION_NUMBER: 'businessRegistrationIncorporationNumber',
        BUSINESS_TYPE: 'applicantType',
        BUSINESS_CATEGORY: 'natureOfBusiness',
        PAYMENT_VOLUME: 'annualVolume',
        INCORPORATION_COUNTRY: 'incorporationCountry',
        INCORPORATION_STATE: 'incorporationState',
    },
    OWNERSHIP_INFO_STEP: {
        OWNS_MORE_THAN_25_PERCENT: 'ownsMoreThan25Percent',
        HAS_OTHER_OWNERS: 'hasOtherOwners',
        OWNERS: 'owners',
        ENTITY_CHART: 'entityChart',
    },
    SIGNER_INFO_STEP: {
        IS_DIRECTOR: 'isDirector',
        DIRECTOR_EMAIL_ADDRESS: 'directorEmailAddress',
        SECOND_DIRECTOR_EMAIL_ADDRESS: 'secondDirectorEmailAddress',
        FIRST_NAME: 'signerFirstName',
        LAST_NAME: 'signerLastName',
        JOB_TITLE: 'signerJobTitle',
        DOB: 'signerDob',
        ID: 'signerID',
        PROOF_OF_ADDRESS: 'signerProofOfAddress',
    },
    AGREEMENT_STEP: {
        AUTHORIZED: 'authorized',
        CERTIFY: 'certify',
        TERMS: 'terms',
    },
} as const;

type InputID = DeepValueOf<typeof INPUT_IDS>;

type CountryStep = {
    [INPUT_IDS.COUNTRY_STEP.COUNTRY]: Country | '';
};

type BankInfoStep = {
    [INPUT_IDS.BANK_INFO_STEP.ACCOUNT_HOLDER_NAME]: string;
    [INPUT_IDS.BANK_INFO_STEP.ACCOUNT_NUMBER]: string;
    [INPUT_IDS.BANK_INFO_STEP.ROUTING_CODE]: string;
    [INPUT_IDS.BANK_INFO_STEP.SWIFT_BIC_CODE]: string;
    [INPUT_IDS.BANK_INFO_STEP.IBAN]: string;
    [INPUT_IDS.BANK_INFO_STEP.ACCOUNT_HOLDER_COUNTRY]: Country | '';
    [INPUT_IDS.BANK_INFO_STEP.ACCOUNT_HOLDER_REGION]: string;
    [INPUT_IDS.BANK_INFO_STEP.ACCOUNT_HOLDER_ADDRESS_LINE1]: string;
    [INPUT_IDS.BANK_INFO_STEP.ACCOUNT_HOLDER_ADDRESS_LINE2]: string;
    [INPUT_IDS.BANK_INFO_STEP.ACCOUNT_HOLDER_CITY]: string;
    [INPUT_IDS.BANK_INFO_STEP.ACCOUNT_HOLDER_POSTAL_CODE]: string;
    [INPUT_IDS.BANK_INFO_STEP.ACCOUNT_HOLDER_PHONE]: string;
    [INPUT_IDS.BANK_INFO_STEP.ACCOUNT_HOLDER_EMAIL]: string;
    [INPUT_IDS.BANK_INFO_STEP.BANK_STATEMENT]: string;
};

type BusinessInfoStep = {
    [INPUT_IDS.BUSINESS_INFO_STEP.NAME]: string;
    [INPUT_IDS.BUSINESS_INFO_STEP.STREET]: string;
    [INPUT_IDS.BUSINESS_INFO_STEP.CITY]: string;
    [INPUT_IDS.BUSINESS_INFO_STEP.STATE]: string;
    [INPUT_IDS.BUSINESS_INFO_STEP.ZIP_CODE]: string;
    [INPUT_IDS.BUSINESS_INFO_STEP.COUNTRY]: string;
    [INPUT_IDS.BUSINESS_INFO_STEP.PHONE]: string;
    [INPUT_IDS.BUSINESS_INFO_STEP.COUNTRY_CODE]: string;
    [INPUT_IDS.BUSINESS_INFO_STEP.REGISTRATION_NUMBER]: string;
    [INPUT_IDS.BUSINESS_INFO_STEP.BUSINESS_TYPE]: string;
    [INPUT_IDS.BUSINESS_INFO_STEP.BUSINESS_CATEGORY]: string;
    [INPUT_IDS.BUSINESS_INFO_STEP.PAYMENT_VOLUME]: string;
    [INPUT_IDS.BUSINESS_INFO_STEP.INCORPORATION_COUNTRY]: Country | '';
    [INPUT_IDS.BUSINESS_INFO_STEP.INCORPORATION_STATE]: string;
};

type OwnerDataKey = `owner_${string}_${string}`;

type OwnershipInfoStepExtraProps = {
    [key: OwnerDataKey]: string;
    ownerKeys?: string[];
};

type OwnershipInfoStepBaseProps = {
    [INPUT_IDS.OWNERSHIP_INFO_STEP.OWNS_MORE_THAN_25_PERCENT]: boolean;
    [INPUT_IDS.OWNERSHIP_INFO_STEP.HAS_OTHER_OWNERS]: boolean;
    [INPUT_IDS.OWNERSHIP_INFO_STEP.OWNERS]: string;
    [INPUT_IDS.OWNERSHIP_INFO_STEP.ENTITY_CHART]: string;
};

type OwnershipInfoStep = OwnershipInfoStepBaseProps & OwnershipInfoStepExtraProps;

type SignerInfoStep = {
    [INPUT_IDS.SIGNER_INFO_STEP.IS_DIRECTOR]: boolean;
    [INPUT_IDS.SIGNER_INFO_STEP.DIRECTOR_EMAIL_ADDRESS]: string;
    [INPUT_IDS.SIGNER_INFO_STEP.SECOND_DIRECTOR_EMAIL_ADDRESS]: string;

    [INPUT_IDS.SIGNER_INFO_STEP.FIRST_NAME]: string;
    [INPUT_IDS.SIGNER_INFO_STEP.LAST_NAME]: string;
    [INPUT_IDS.SIGNER_INFO_STEP.JOB_TITLE]: string;
    [INPUT_IDS.SIGNER_INFO_STEP.DOB]: string;
    [INPUT_IDS.SIGNER_INFO_STEP.ID]: string;
    [INPUT_IDS.SIGNER_INFO_STEP.PROOF_OF_ADDRESS]: string;
};

type AgreementStep = {
    [INPUT_IDS.AGREEMENT_STEP.AUTHORIZED]: boolean;
    [INPUT_IDS.AGREEMENT_STEP.CERTIFY]: boolean;
    [INPUT_IDS.AGREEMENT_STEP.TERMS]: boolean;
};

type NonUSDReimbursementAccountForm = Form<InputID, CountryStep & BankInfoStep & BusinessInfoStep & OwnershipInfoStep & SignerInfoStep & AgreementStep>;

export type {NonUSDReimbursementAccountForm, CountryStep, BankInfoStep, BusinessInfoStep, OwnershipInfoStep, SignerInfoStep, AgreementStep, InputID};
export default INPUT_IDS;
