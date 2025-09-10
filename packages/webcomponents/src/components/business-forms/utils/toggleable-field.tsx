import { Component, h, Prop, State } from '@stencil/core';

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
        <label class="form-label">
          {this.label}
        </label>
        <div class="d-flex align-items-center gap-2">
          <span>****{this.readOnlyValue}</span>
          <button 
            type="button" 
            class="btn btn-link p-0 text-decoration-underline" 
            onClick={this.handleUpdateClick}
          >
            Update
          </button>
        </div>
      </div>
    );
  }
}