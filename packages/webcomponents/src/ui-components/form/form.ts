import { BehaviorSubject } from 'rxjs';
import { ObjectSchema, ValidationError } from 'yup';

export class FormController {
  public values = new BehaviorSubject<any>({});
  public errors = new BehaviorSubject<any>({});

  private _schema: ObjectSchema<any>;
  private _initialValues: any = {};
  private _values: any = {};
  private _errors: any = {};
  private _isValid = true;

  constructor(schema: ObjectSchema<any>) {
    this._schema = schema;
  }

  private processArrayError(
    obj: any,
    property: string,
    remainingProperties: string[],
    message: string,
  ): void {
    // Extract array name and index from the property string
    const [arrayName, indexStr] = property
      .match(/^([a-zA-Z0-9]+)\[(\d+)\]/)
      .slice(1);
    const index = parseInt(indexStr, 10);

    // Ensure the array exists and has an entry at the given index
    obj[arrayName] = obj[arrayName] || [];
    obj[arrayName][index] = obj[arrayName][index] || {};

    // Recursively set the error if there are remaining properties, else set the error message
    if (remainingProperties.length) {
      this.setNestedError(obj[arrayName][index], remainingProperties, message);
    } else {
      obj[arrayName][index] = message;
    }
  }

  private processRegularError(
    obj: any,
    property: string,
    remainingProperties: string[],
    message: string,
  ): void {
    // Ensure the property exists
    obj[property] = obj[property] || {};

    // Recursively set the error if there are remaining properties, else set the error message
    if (remainingProperties.length) {
      this.setNestedError(obj[property], remainingProperties, message);
    } else {
      obj[property] = message;
    }
  }

  private setNestedError(
    obj: any,
    properties: string[],
    message: string,
  ): void {
    const property = properties.shift();
    const isArrayError = property.includes('[');

    if (isArrayError) {
      this.processArrayError(obj, property, properties, message);
    } else {
      this.processRegularError(obj, property, properties, message);
    }
  }

  private setError(obj: any, path: string, message: string): void {
    // Convert path to properties array
    const properties = Array.isArray(path) ? path : path.split('.');
    this.setNestedError(obj, properties, message);
  }

  async validate(context?: any): Promise<boolean> {
    this._isValid = true;
    this._errors = {};

    try {
      await this._schema.validate(this._values, { context, abortEarly: false });
    } catch (err) {
      this._isValid = false;
      err.inner.forEach((item: ValidationError) => {
        this.setError(this._errors, item.path, item.message);
      });
    }

    this.errors.next(this._errors);
    return this._isValid;
  }

  public async validateAndSubmit(
    submitHandler: (values: any) => void,
    context?: any,
  ): Promise<void> {
    const isValid = await this.validate(context || {});
    if (isValid) {
      submitHandler(this._values);
    }
  }

  public setInitialValues(values: any): void {
    this._initialValues = values;
    this._values = values;
    this.values.next(this._values);
  }

  public setValues(values: any): void {
    this._values = { ...this._values, ...values };
    this.values.next(this._values);
  }

  public resetValues(): void {
    this._values = this._initialValues;
    this.values.next(this._values);
  }

  public getInitialValues(): any {
    return this._initialValues;
  }
}
