import { PagingInfo } from './Pagination';

export interface IApiResponse<T> {
  data: T;
  error?: IErrorObject | IServerError;
  page_info?: PagingInfo;
  errors?: string[];
  id: number | string;
  type: string;
}

export type IServerError = string;

export interface IErrorObject {
  message: string;
  code: string;
  param?: string;
}

export interface IApiResponseCollection<T> extends IApiResponse<T> {
  page_info: PagingInfo;
}
