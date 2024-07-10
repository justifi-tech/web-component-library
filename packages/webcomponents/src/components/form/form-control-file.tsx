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
import { EntityDocumentType, FileSelectEvent } from '../../api/Document';

@Component({
  tag: 'form-control-file',
})
export class FileInput {
  @Element() el: HTMLElement;
  fileInput: HTMLInputElement;

  @State() files: File[];
  @State() fileString: string;

  @Prop() label: string;
  @Prop() name: any;
  @Prop() helpText?: string;
  @Prop() errorText?: string;
  @Prop() multiple?: boolean;
  @Prop() documentType: EntityDocumentType;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() disabled: boolean;

  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;
  @Event() fileSelected: EventEmitter<FileSelectEvent>;

  componentDidLoad() {
    this.fileInput = this.el.querySelector('input');
  }

  handleFormControlInput = (event: any) => {
    const target = event.target;
    const name = target.getAttribute('name');
    this.inputHandler(name, target.value);
    this.formControlInput.emit({ name, value: target.value });
  }

  changeHandler = () => {
    const inputFileList = this.fileInput.files;
    if (inputFileList) {
      this.fileSelected.emit({
        fileList: inputFileList,
        document_type: this.documentType
      });
    }
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="form-group d-flex flex-column">
          <label part="label" class="form-label" htmlFor={this.name}>
            {this.label}
          </label>
          <input
            ref={(el) => this.fileInput = el}
            type="file"
            name={this.name}
            part={`input ${this.errorText ? 'input-invalid ' : ''}${this.disabled ? ' input-disabled' : ''}`}
            class={this.errorText ? 'form-control is-invalid' : 'form-control'}
            multiple={this.multiple}
            disabled={this.disabled}
            onChange={this.changeHandler}
            onInput={this.handleFormControlInput}
            onBlur={() => this.formControlBlur.emit()}
          />
          <form-control-help-text helpText={this.helpText} name={this.name} />
          <form-control-error-text errorText={this.errorText} name={this.name} />
        </div>
      </Host>
    );
  }
}
