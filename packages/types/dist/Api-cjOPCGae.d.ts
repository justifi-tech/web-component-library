interface PagingInfo {
    amount: number;
    start_cursor: string;
    end_cursor: string;
    has_previous: boolean;
    has_next: boolean;
}
declare const pagingDefaults: PagingInfo;
interface ExtendedPagingInfo extends PagingInfo {
    handleClickNext: (after_cursor: string) => void;
    handleClickPrevious: (before_cursor: string) => void;
}
declare const ExtendedPagingDefaults: ExtendedPagingInfo;

interface IApiResponse<T> {
    data: T;
    error?: IErrorObject | IServerError;
    page_info?: PagingInfo;
    errors?: string[];
    id: number | string;
    type: string;
}
type IServerError = string;
interface IErrorObject {
    message: string;
    code: string;
    param?: string;
}
interface IApiResponseCollection<T> extends IApiResponse<T> {
    page_info: PagingInfo;
}

export { type ExtendedPagingInfo as E, type IApiResponse as I, type PagingInfo as P, ExtendedPagingDefaults as a, type IServerError as b, type IErrorObject as c, type IApiResponseCollection as d, pagingDefaults as p };
