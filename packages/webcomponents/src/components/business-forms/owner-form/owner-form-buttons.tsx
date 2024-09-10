import { Component, h, Prop } from '@stencil/core';
import { Button } from '../../../ui-components';

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
      <div class='d-flex gap-2'>
        <Button
          variant='primary'
          type='submit'
          onClick={this.handleAddOwner}
          disabled={this.isLoading}>
          {this.submitButtonText}
        </Button>
        <Button
          variant='secondary'
          type='button'
          onClick={this.handleRemoveOwner}
          hidden={!this.showRemoveButton}>
          Remove
        </Button>
      </div>
    );
  }
}
