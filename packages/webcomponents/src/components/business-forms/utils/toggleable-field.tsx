import { Component, h, Prop, State } from '@stencil/core';
import { label, inputDisabled, buttonSecondary } from '../../../styles/parts';

@Component({
  tag: 'toggleable-field',
})
export class ToggleableField {
  @Prop() readOnlyValue?: string;
  @Prop() fieldName: string;
  @Prop() label: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() errorText?: string;
  @Prop() defaultValue?: string;
  @Prop() mask?: string;
  @Prop() helpText?: string;
  @Prop() keyDownHandler?: (event: KeyboardEvent) => void;
  @Prop() maxLength?: number;

  @State() isEditing: boolean = false;

  handleUpdateClick = () => {
    this.isEditing = true;
  };

  render() {
    if (!this.readOnlyValue || this.isEditing) {
      return (
        <form-control-number-masked
          name={this.fieldName}
          label={this.label}
          defaultValue={this.isEditing ? '' : this.defaultValue}
          errorText={this.errorText}
          inputHandler={this.inputHandler}
          mask={this.mask}
          helpText={this.helpText}
        />
      );
    }

    return (
      <div>
        <label class="form-label" part={label}>
          {this.label}
        </label>
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            part={inputDisabled}
            value={`****${this.readOnlyValue}`}
            disabled />
          <button
            class="btn btn-secondary"
            type="button"
            part={buttonSecondary}
            onClick={this.handleUpdateClick}
          >
            Change
          </button>
        </div>
      </div>
    );
  }
}