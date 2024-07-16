import { ComponentErrorCodes } from '../ComponentError';
import { API_ERRORS } from '../shared';

export const getErrorMessage = (error: any) => {
  if (typeof error === 'string') {
    return error;
  }
  return error.message;
};

export const getErrorCode = (code) => {
  switch (code) {
    case API_ERRORS.NOT_AUTHENTICATED:
      return ComponentErrorCodes.NOT_AUTHENTICATED;
    case API_ERRORS.INVALID_PARAMETER:
      return ComponentErrorCodes.INVALID_PARAMETER;
    // add more cases as needed

    default:
      return ComponentErrorCodes.FETCH_ERROR;
  }
};
