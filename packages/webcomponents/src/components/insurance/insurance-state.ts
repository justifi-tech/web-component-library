import { createStore } from '@stencil/store';

const insuranceValuesStore = createStore<any>({});
const { state: insuranceValues, on: insuranceValuesOn } = insuranceValuesStore;

const insuranceErrorsStore = createStore<any>({});
const { state: insuranceErrors } = insuranceErrorsStore;

// Track previous values to detect actual changes vs initial setting
const previousInsuranceValues: any = {};

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

// Helper function to check if a value has actually changed (not just initially set)
const hasInsuranceValueChanged = (key: string, newValue: any): boolean => {
  const hadPreviousValue = previousInsuranceValues.hasOwnProperty(key);
  const previousValue = previousInsuranceValues[key];

  if (!hadPreviousValue) {
    // First time setting this value, track it but don't consider it a "change"
    previousInsuranceValues[key] = newValue;
    return false;
  }

  const hasChanged = previousValue !== newValue;
  if (hasChanged) {
    previousInsuranceValues[key] = newValue;
  }

  return hasChanged;
};

export {
  insuranceValuesStore,
  insuranceValues,
  insuranceValuesOn,
  insuranceErrorsStore,
  insuranceErrors,
  validateInsuranceValues,
  hasInsuranceValueChanged,
};
