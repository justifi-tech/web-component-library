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

    // add more cases as needed

    default:
      return ComponentErrorCodes.FETCH_ERROR;
  }
};
