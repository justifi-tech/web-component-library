import { Component, Prop, h } from "@stencil/core";
import { StyledHost } from "../styled-host/styled-host";

@Component({
  tag: 'justifi-button',
  shadow: true,
})
export class JustifiButton {
  @Prop() text!: string;
  @Prop() variant?: 'primary' | 'secondary' = 'primary';
  @Prop() isLoading?: boolean;
  @Prop() clickHandler?: (event: MouseEvent) => void;
  @Prop() disabled?: boolean;
  @Prop() type?: 'button' | 'submit' | 'reset' = 'button';
  @Prop() class?: string;
  @Prop() customStyle?: string | { [key: string]: string };
  @Prop() hidden?: boolean;

  render() {
    return (
      <StyledHost>
        <internal-button
          text={this.text}
          variant={this.variant}
          isLoading={this.isLoading}
          clickHandler={this.clickHandler}
          type={this.type}
          disabled={this.disabled}
          class={this.class}
          customStyle={this.customStyle}
          hidden={this.hidden}
        />
      </StyledHost>
    );
  }
}
