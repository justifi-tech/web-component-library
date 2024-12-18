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
import { FormControlErrorText } from '../../ui-components';
import { input, inputDisabled, inputFocused, inputInvalid, label } from '../../styles/parts';

@Component({
  tag: 'form-control-file',
})
export class FileInput {
  @Element() el: HTMLElement;
  fileInput: HTMLInputElement;

  @State() files: File[];
  @State() fileString: string;
  @State() isFocused: boolean = false;

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

  private get part() {
    let part = input;
    if (this.errorText) {
      part = inputInvalid;
    }
    if (this.disabled) {
      part = inputDisabled;
    }
    if (this.isFocused) {
      part = inputFocused;
    }
    return part;
  }

  render() {
    return (
      <Host>
        <div class="form-group d-flex flex-column">
          <div class="d-flex align-items-start gap-2">
            <label part={label} class="form-label" htmlFor={this.name}>
              {this.label}
            </label>
            <form-control-tooltip helpText={this.helpText} />
          </div>
          <input
            ref={(el) => this.fileInput = el}
            type="file"
            name={this.name}
            part={this.part}
            class={this.errorText ? "form-control is-invalid" : "form-control"}
            multiple={this.multiple}
            disabled={this.disabled}
            onChange={this.changeHandler}
            onInput={this.handleFormControlInput}
            onFocus={() => this.isFocused = true}
            onBlur={() => {
              this.isFocused = false;
              this.formControlBlur.emit();
            }}
          />
          <FormControlErrorText errorText={this.errorText} name={this.name} />
        </div>
      </Host>
    );
  }
}
