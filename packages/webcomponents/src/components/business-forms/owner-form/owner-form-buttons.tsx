import { Component, h, Prop } from '@stencil/core';
import { LoadingSpinner } from '../../form/utils';

@Component({
  tag: 'owner-form-buttons'
})
export class OwnerFormButtons {

  @Prop() isLoading: boolean;
  @Prop() showRemoveButton: boolean;
  @Prop() submitButtonText: string;
  @Prop() handleAddOwner: () => void;
  @Prop() handleRemoveOwner: () => void;

  render() {
    return (
      <div class='container d-flex gap-2'>
        <button
          type='submit'
          class={`btn btn-primary jfi-submit-button${this.isLoading ? ' jfi-submit-button-loading' : ''}`}
          onClick={this.handleAddOwner}
          disabled={this.isLoading}>
          {this.isLoading ? LoadingSpinner() : this.submitButtonText}
        </button>
        <button
          type='button'
          class='btn btn-danger'
          onClick={this.handleRemoveOwner}
          hidden={!this.showRemoveButton}>
          Remove owner
        </button>
      </div>
    );
  }
}
