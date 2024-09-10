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
      <div class='container d-flex gap-2'>
        <Button
          variant='secondary'
          type='submit'
          onClick={this.handleAddOwner}
          disabled={this.isLoading}>
          {this.submitButtonText}
        </Button>
        <Button
          variant='danger'
          type='button'
          onClick={this.handleRemoveOwner}
          hidden={!this.showRemoveButton}>
          Remove owner
        </Button>
      </div>
    );
  }
}
