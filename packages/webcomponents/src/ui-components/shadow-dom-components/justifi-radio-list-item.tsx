import { Component, Prop, h } from '@stencil/core';
import { StyledHost } from "../styled-host/styled-host";

@Component({
  tag: 'justifi-radio-list-item',
  shadow: true,
})
export class JustifiRadioListItem {
  @Prop() name!: string;
  @Prop() value!: string;
  @Prop() label!: any;
  @Prop() checked?: boolean = false;
  @Prop() hidden?: boolean = false;
  @Prop() class?: string;

  @Prop() radioClickHandler?: (value: string) => void;

  render() {
    return (
      <StyledHost>
        <radio-list-item
          name={this.name}
          value={this.value}
          label={this.label}
          checked={this.checked}
          hidden={this.hidden}
          class={this.class}
          radioClickHandler={(value) => this.radioClickHandler?.(value)}
        />
      </StyledHost>
    );
  }
} 
