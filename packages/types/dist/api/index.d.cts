export { a as ExtendedPagingDefaults, E as ExtendedPagingInfo, I as IApiResponse, d as IApiResponseCollection, c as IErrorObject, b as IServerError, P as PagingInfo, p as pagingDefaults } from '../Api-cjOPCGae.cjs';

type IBankAccountBillingInfo = {
    name: string;
    address_line1: string;
    address_line2: string;
    address_city: string;
    address_state: string;
    address_postal_code: string;
};
type IPostalCode = {
    address_postal_code: number;
};
type IBillingInfo = IPostalCode | IBankAccountBillingInfo;

interface GrossVolumeReportDate {
    date: string;
    value: number;
}
interface GrossVolumeReport {
    total: number;
    dates: GrossVolumeReportDate[];
}

interface IQuote {
    id: string;
}

export type { GrossVolumeReport, GrossVolumeReportDate, IBankAccountBillingInfo, IBillingInfo, IPostalCode, IQuote };
