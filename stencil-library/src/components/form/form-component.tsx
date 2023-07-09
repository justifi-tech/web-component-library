import { Component, Host, h, Prop, Event, EventEmitter, Listen, Watch } from '@stencil/core';
import { ValidationError } from 'yup';

@Component({
  tag: 'form-component',
  shadow: true,
})
export class TextInput {
  @Prop() form: any;
  @Prop() defaultValues: any;
  @Event() validFormSubmitted: EventEmitter;
  @Event() formShouldUpdate: EventEmitter<any>;

  @Watch('form')
  handleFormChange(newValue: any) {
    this.formShouldUpdate.emit(newValue);
  }

  @Listen('formControlInput')
  handleFormControlInput(event: CustomEvent) {
    const { name, value } = event.detail;
    this.setFormValue(name, value);
  };

  @Listen('formControlBlur')
  handleFormControlBlur() {
    if (!this.form.isValid) {
      this.validate(this.form.schema);
    }
  };

  setFormValue(name: string, value: any) {
    const path = name.split('.');
    let newControllerValues = { ...this.form.values };

    if (path.length > 1) {
      path.reduce((acc, part, index) => {
        if (index === path.length - 1) {
          acc[part] = value;
        } else {
          acc[part] = acc[part] || {};
        }
        return acc[part];
      }, newControllerValues);
    } else {
      newControllerValues = { [name]: value };
    }

    this.form.values = newControllerValues;
    this.form = { ...this.form };
  }

  validate = async (schema): Promise<{ isValid: boolean, errors: any, values: any }> => {
    this.form.isValid = true
    this.form.errors = {};

    try {
      await schema.validate(this.form.values, { abortEarly: false });
    } catch (err) {
      this.form.isValid = false;
      err.inner.map((item: ValidationError) => {
        this.form.errors[item.path] = item.message;
      });
    }
    this.form = { ...this.form };
    return this.form.isValid;
  };

  async submit(event, schema) {
    event.preventDefault();
    const formIsValid = await this.validate(schema);
    if (formIsValid) this.validFormSubmitted.emit(this.form.values);
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <form onSubmit={(event) => this.submit(event, this.form.schema)}>
          <slot />
          <button type="submit">Submit</button>
        </form>
      </Host>
    );
  }
}