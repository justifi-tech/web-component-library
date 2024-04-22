import * as yup from 'yup';
import { FormController } from '../form';

describe('FormController', () => {
  let formController: FormController;
  const mockSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
  });

  beforeEach(() => {
    formController = new FormController(mockSchema);
  });

  it('should initialize with default empty values and errors', () => {
    expect(formController.values.getValue()).toEqual({});
    expect(formController.errors.getValue()).toEqual({});
  });

  it('should set initial values correctly', () => {
    const initialValues = { name: 'John', email: 'john@example.com' };
    formController.setInitialValues(initialValues);
    expect(formController.values.getValue()).toEqual(initialValues);
  });

  it('should update values correctly', async () => {
    const updateValues = { name: 'Jane' };
    formController.setInitialValues({
      name: 'John',
      email: 'john@example.com',
    });
    formController.setValues(updateValues);
    expect(formController.values.getValue()).toEqual({
      name: 'Jane',
      email: 'john@example.com',
    });
  });

  it('should reset values to initial values', () => {
    const initialValues = { name: 'John', email: 'john@example.com' };
    formController.setInitialValues(initialValues);
    formController.setValues({ name: 'Jane' }); // Update values
    formController.resetValues(); // Reset to initial values
    expect(formController.values.getValue()).toEqual(initialValues);
  });

  it('should validate and set errors correctly for invalid data', async () => {
    formController.setValues({ email: 'invalid-email' }); // Set invalid email
    await formController.validateAndSubmit(() => null);
    expect(formController.errors.getValue()).toHaveProperty('email');
  });

  it('should call submit handler on valid data', async () => {
    const submitHandlerMock = jest.fn();
    formController.setInitialValues({
      name: 'John',
      email: 'john@example.com',
    });
    await formController.validateAndSubmit(submitHandlerMock);
    expect(submitHandlerMock).toHaveBeenCalled();
  });

  it('should not call submit handler on invalid data', async () => {
    const submitHandlerMock = jest.fn();
    formController.setValues({ email: 'invalid-email' }); // Set invalid email
    await formController.validateAndSubmit(submitHandlerMock);
    expect(submitHandlerMock).not.toHaveBeenCalled();
  });
});
