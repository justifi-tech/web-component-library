import { Component, Prop, h } from "@stencil/core";
import { Button } from "./button";

@Component({
  tag: 'internal-button',
})
export class InternalButton {
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
      <Button
        variant={this.variant}
        isLoading={this.isLoading}
        clickHandler={this.clickHandler}
        class={this.class}
        type={this.type}
        disabled={this.disabled}
        style={this.customStyle}
        hidden={this.hidden}
      >
        {this.text}
      </Button>
    );
  }
}
