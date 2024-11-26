import { Component, h, Host } from "@stencil/core";
import { iframeInputStylesSet } from "./iframe-input-styles-state";

@Component({
  tag: "hidden-input",
})
export class HiddenInput {
  private hiddenInput!: HTMLInputElement;

  async componentDidLoad() {
    const focusedStyles = await this.getFocusedStyles();
    iframeInputStylesSet('focused', focusedStyles);

    const getFocusedAndInvalidStyles = await this.getFocusedAndInvalidStyles();
    iframeInputStylesSet('focusedAndInvalid', getFocusedAndInvalidStyles);
  }

  private async getFocusedStyles() {
    return new Promise((resolve, _reject) => {
      this.hiddenInput.focus();
      setTimeout(() => {
        this.hiddenInput.blur();
        let computedStyles = getComputedStyle(this.hiddenInput);
        resolve({
          boxShadow: computedStyles.boxShadow,
          border: computedStyles.border,
        });
      }, 1000);
    });
  }

  private async getFocusedAndInvalidStyles() {
    return new Promise((resolve, _reject) => {
      this.hiddenInput.focus();
      this.hiddenInput.classList.add('is-invalid');
      setTimeout(() => {
        let computedStyles = getComputedStyle(this.hiddenInput);
        this.hiddenInput.blur();
        this.hiddenInput.classList.remove('is-invalid');
        const styles = {
          boxShadow: computedStyles.boxShadow,
          border: computedStyles.border,
        };

        resolve(styles);
      }, 1000);
    });
  }

  render() {
    return (
      <Host>
        <input
          ref={el => this.hiddenInput = el}
          type="text"
          class="form-control"
          tabindex="-1"
          style={{ height: '0', opacity: '0', pointerEvents: 'none' }}
        />
      </Host>
    );
  }
}
