import { createStore } from '@stencil/store';

const { state: insuranceValues, on: insuranceValuesOn } = createStore<any>({});

const { state: insuranceErrors } = createStore<any>({});

const validateInsuranceValues = () => {
  let invalid = false;

  Object.keys(insuranceValues).forEach((key) => {
    if (insuranceValues[key]) {
      insuranceErrors[key] = false;
    } else {
      insuranceErrors[key] = true;
      invalid = true;
    }
  });

  return { isValid: !invalid };
};

export { insuranceValues, insuranceValuesOn, insuranceErrors, validateInsuranceValues };
