import { Payment } from '../../api';

export const getPayments = async ({
  accountId,
  authToken,
  params,
  onSuccess,
  onError,
  service,
}) => {
  if (!accountId || !authToken) {
    onError('Cannot fetch data without an AccountID and an AuthToken');
    return;
  }

  try {
    const response = await service.fetchPayments(accountId, authToken, params);
    if (!response.error || !response) {
      const pagingInfo = {
        ...response.page_info,
      };

      const payments =
        response.data?.map((dataItem) => new Payment(dataItem)) || [];

      onSuccess({ payments, pagingInfo });
    } else {
      const responseError =
        typeof response.error === 'string'
          ? response.error
          : response.error.message;

      return onError(responseError);
    }
  } catch (error) {
    return onError(error.message || error);
  }
};
