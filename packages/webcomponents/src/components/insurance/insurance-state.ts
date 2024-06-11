import { createStore } from "@stencil/store";

const { state: insuranceValues } = createStore({}); // { season_interruption: true | false | undefined }
const { state: insuranceErrors } = createStore({}); // { season_interruption: true (if value is undefined) }

const validateInsuranceValues = () => {
  let invalid;
  console.log('validating insurance values:', insuranceValues);
  Object.keys(insuranceValues).forEach((key) => {
    console.log('key', insuranceValues[key])
    if (insuranceValues[key] === undefined) {
      insuranceErrors[key] = true;
      invalid = true;
    } else {
      insuranceErrors[key] = false;
    }
  });

  console.log('invalid', invalid)
  return invalid;
}

export { insuranceValues, insuranceErrors, validateInsuranceValues };