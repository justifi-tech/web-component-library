import { ComponentErrorSeverity } from "../../../api/ComponentError";
import { getErrorCode, getErrorMessage } from "../../../api/services/utils";

// Business / Entity API Actions

export const makeGetBusiness = ({ authToken, businessId, service }) =>
  async ({ onSuccess, onError, final = () => {} }) => {
    try {
      const response = await service.fetchBusiness(businessId, authToken);

      if (!response.error) {
        onSuccess(response);
      } else {
        const responseError = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        return onError({
          error: responseError,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const code = getErrorCode(error?.code);
      return onError({
        error: error.message || error,
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    } finally {
      return final()
    }
  };

export const makePatchBusiness = ({ authToken, businessId, service }) =>
  async ({ payload, onSuccess, onError, final = () => {} }) => {
    try {
      const response = await service.patchBusiness(authToken, businessId, payload);

      if (!response.error) {
        onSuccess(response);
      } else {
        const responseError = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        return onError({
          error: responseError,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const code = getErrorCode(error?.code);
      return onError({
        error: error.message || error,
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    } finally {
      return final()
    }
  };

export const makePostProvisioning = ({ authToken, businessId, product, service }) =>
  async ({ onSuccess, onError }) => {
    try {
      const response = await service.postProvisioning(authToken, businessId, product);

      if (!response.error) {
        onSuccess(response);
      } else {
        const responseError = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        return onError({
          error: responseError,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const code = getErrorCode(error?.code);
      return onError({
        error: error.message || error,
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  };

// Business Identity API Actions

export const makeGetIdentity = ({ authToken, identityId, service }) =>
  async ({ onSuccess, onError, final = () => {} }) => {
    try {
      const response = await service.fetchIdentity(identityId, authToken);

      if (!response.error) {
        onSuccess(response);
      } else {
        const responseError = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        return onError({
          error: responseError,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const code = getErrorCode(error?.code);
      return onError({
        error: error.message || error,
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    } finally {
      return final()
    }
  };

export const makePatchIdentity = ({ authToken, identityId, service }) =>
  async ({ payload, onSuccess, onError, final = () => {} }) => {
    try {
      const response = await service.patchIdentity(authToken, identityId, payload);

      if (!response.error) {
        onSuccess(response);
      } else {
        const responseError = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        return onError({
          error: responseError,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const code = getErrorCode(error?.code);
      return onError({
        error: error.message || error,
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    } finally {
      return final()
    }
  };

export const makePostIdentity = ({ authToken, service }) =>
  async ({ payload, onSuccess, onError, final = () => {} }) => {
    try {
      const response = await service.postIdentity(authToken, payload);

      if (!response.error) {
        onSuccess(response);
      } else {
        const responseError = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        return onError({
          error: responseError,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const code = getErrorCode(error?.code);
      return onError({
        error: error.message || error,
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    } finally {
      return final()
    }
  };

// Bank Account API Actions

export const makePostBankAccount = ({ authToken, service }) =>
  async ({ payload, onSuccess, onError, final = () => {} }) => {
    try {
      const response = await service.postBankAccount(authToken, payload);

      if (!response.error) {
        onSuccess(response);
      } else {
        const responseError = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        return onError({
          error: responseError,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const code = getErrorCode(error?.code);
      return onError({
        error: error.message || error,
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    } finally {
      return final()
    }
  };
  
// Business Document API Actions

export const makePostDocumentRecord = ({ authToken, service }) =>
  async ({ payload, onSuccess, onError, final = () => {} }) => {
    try {
      const response = await service.postDocumentRecord(authToken, payload);

      if (!response.error) {
        onSuccess(response);
      } else {
        const responseError = getErrorMessage(response.error);
        const code = getErrorCode(response.error?.code);
        return onError({
          error: responseError,
          code,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
    } catch (error) {
      const code = getErrorCode(error?.code);
      return onError({
        error: error.message || error,
        code,
        severity: ComponentErrorSeverity.ERROR,
      });
    } finally {
      return final()
    }
  };
