import { createStore } from '@stencil/store';

const insuranceValuesStore = createStore<any>({});
const { state: insuranceValues, on: insuranceValuesOn } = insuranceValuesStore;

const insuranceErrorsStore = createStore<any>({});
const { state: insuranceErrors } = insuranceErrorsStore;

const validateInsuranceValues = () => {
  let valid = true;

  Object.keys(insuranceValues).forEach((key) => {
    const noSelection = insuranceValues[key] === null;

    if (noSelection) {
      insuranceErrors[key] = true;
      valid = false;
    } else {
      insuranceErrors[key] = false;
    }
  });

  return { isValid: valid };
};

export {
  insuranceValuesStore,
  insuranceValues,
  insuranceValuesOn,
  insuranceErrorsStore,
  insuranceErrors,
  validateInsuranceValues
};
