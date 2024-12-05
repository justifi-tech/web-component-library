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

    const focusedAndInvalidStyles = await this.getFocusedAndInvalidStyles();
    iframeInputStylesSet('focusedAndInvalid', focusedAndInvalidStyles);

    const fontStyles = await this.getBaseFontStyles();
    iframeInputStylesSet('fontStyles', fontStyles);
  }

  private async getBaseFontStyles() {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        const computedStyles = getComputedStyle(this.hiddenInput);
        const styles = {
          fontFamily: computedStyles.fontFamily,
          fontSize: computedStyles.fontSize,
          fontWeight: computedStyles.fontWeight,
          lineHeight: computedStyles.lineHeight,
          margin: computedStyles.margin,
          padding: computedStyles.padding,
          color: computedStyles.color,
        };

        resolve(styles);
      }, 500);
    });
  };

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
      }, 500);
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
      }, 500);
    });
  }

  render() {
    return (
      <Host>
        <input
          ref={el => this.hiddenInput = el}
          type="text"
          class="form-control"
          part="input"
          tabindex="-1"
          style={{ height: '0', opacity: '0', pointerEvents: 'none' }}
        />
      </Host>
    );
  }
}
