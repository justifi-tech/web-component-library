import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  State,
  Element,
} from '@stencil/core';
import { FileChangeEvent } from '../../api/Document';

@Component({
  tag: 'form-control-file',
  styleUrl: 'form-control-file.scss',
  shadow: true,
})
export class FileInput {
  @Element() el: HTMLElement;
  @Prop() label: string;
  @Prop() name: any;
  @Prop() documentType: string;
  @Prop() error: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() disabled: boolean;
  @State() input: string;
  @State() file: File;
  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;
  @Event() fileChange: EventEmitter<FileChangeEvent>;

  updateInput(newValue: any) {
    const inputElement = this.el.shadowRoot.querySelector('input');
    if (inputElement) {
      inputElement.value = newValue || '';
    }
  }

  handleFormControlInput(event: any) {
    const target = event.target;
    const name = target.getAttribute('name');
    this.inputHandler(name, target.value);
    this.formControlInput.emit(target.value);
  }

  handleFileChange(event: any) {
    this.file = event.target.files[0];
    this.fileChange.emit({file: this.file, document_type: this.documentType});
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <label part="label" class="form-label" htmlFor={this.name}>
          {this.label}
        </label>
        <div class="input-group mb-3">
          <input
            type="file"
            name={this.name}
            part={`input ${this.error ? 'input-invalid ' : ''}${this.disabled ? ' input-disabled' : ''}`}
            class={this.error ? 'form-control file is-invalid' : 'form-control file'}
            disabled={this.disabled}
            onChange={(event: any) => this.handleFileChange(event)}
            onInput={(event: any) => this.handleFormControlInput(event)}
            onBlur={() => this.formControlBlur.emit()}
          />
          <span class="input-group-text">
            <span class='badge text-bg-success' title='test'>File Uploaded</span>
          </span>
          {this.error && <div class="invalid-feedback">{this.error}</div>}
        </div>
      </Host>
    );
  }
}
