import { Component, Prop, h } from "@stencil/core";
import { StyledHost } from "../styled-host/styled-host";
import { Button } from "../button";

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


  render() {
    return (
      <StyledHost>
        <Button
          variant={this.variant}
          isLoading={this.isLoading}
          clickHandler={this.clickHandler}
          class={this.class}
          type={this.type}
          disabled={this.disabled}
          style={this.customStyle}
        >
          {this.text}
        </Button>
      </StyledHost>
    );
  }
}
