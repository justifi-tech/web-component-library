import { FormController } from '../../form/form';
import { deconstructDate } from './helpers';

export const updateFormValues = (formController: FormController, newValues: any) => {
  formController.setValues({
    ...formController.values.getValue(),
    ...newValues,
  });
};

export const updateAddressFormValues = (formController: FormController, newValues: any) => {
  updateFormValues(formController, {
    address: {
      ...formController.values.getValue().address,
      ...newValues,
    },
  })
};

export const updateDateOfBirthFormValues = (event, formController: FormController) => {
  const dob_values = deconstructDate(event.detail);
  updateFormValues(formController, {
    ...formController.values.getValue(),
    dob_day: dob_values.dob_day,
    dob_month: dob_values.dob_month,
    dob_year: dob_values.dob_year,
  })
}
