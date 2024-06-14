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
  styleUrl: 'form-control-file.scss',
  shadow: true,
})
export class FileInput {
  @Element() el: HTMLElement;
  @Prop() label: string;
  @Prop() name: any;
  @Prop() multiple?: boolean;
  @Prop() documentType: EntityDocumentType;
  @Prop() error?: string;
  @Prop() inputHandler: (name: string, value: string) => void;
  @Prop() disabled: boolean;
  @Prop() helpText: string;
  @State() input: string;
  @State() files: File[];
  @State() fileString: string;
  @Event() formControlInput: EventEmitter<any>;
  @Event() formControlBlur: EventEmitter<any>;
  @Event() fileSelected: EventEmitter<FileSelectEvent>;

  fileInput: HTMLInputElement;

  componentDidLoad() {
    this.fileInput = this.el.shadowRoot.querySelector('input');
  }

  handleFormControlInput = (event: any) => {
    const target = event.target;
    const name = target.getAttribute('name');
    this.inputHandler(name, target.value);
    this.formControlInput.emit(target.value);
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

  helpTextBlock = () => {
    return (
      <small id="passwordHelpBlock" class="form-text text-muted">
        {this.helpText}
      </small>
    );
  }

  render() {
    return (
      <Host exportparts="label,input,input-invalid">
        <div class="form-group">
          <label part="label" class="form-label" htmlFor={this.name}>
            {this.label}
          </label>
          <input
            ref={(el) => this.fileInput = el}
            type="file"
            name={this.name}
            part={`input ${this.error ? 'input-invalid ' : ''}${this.disabled ? ' input-disabled' : ''}`}
            class={this.error ? 'form-control is-invalid' : 'form-control'}
            multiple={this.multiple}
            disabled={this.disabled}
            onChange={this.changeHandler}
            onInput={this.handleFormControlInput}
            onBlur={() => this.formControlBlur.emit()}
          />
          {this.error && <div class="invalid-feedback">{this.error}</div>}
          {this.helpText && this.helpTextBlock()}
        </div>
      </Host>
    );
  }
}
