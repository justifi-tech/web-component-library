import { createStore } from '@stencil/store';

const { state: insuranceValues } = createStore<any>({}); // { season_interruption: true | false | undefined }
const { state: insuranceErrors } = createStore<any>({}); // { season_interruption: true (if value is undefined) }

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

  return invalid;
};

export { insuranceValues, insuranceErrors, validateInsuranceValues };
