import { createStore } from '@stencil/store';

const { state: insuranceValues, on: insuranceValuesOn } = createStore<any>({});

const { state: insuranceErrors } = createStore<any>({});

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

export { insuranceValues, insuranceValuesOn, insuranceErrors, validateInsuranceValues };
