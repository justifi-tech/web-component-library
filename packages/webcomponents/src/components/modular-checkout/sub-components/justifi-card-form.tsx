import { Component, h, Method, Prop } from "@stencil/core";
import JustifiAnalytics from "../../../api/Analytics";
import { detectDuplicateVersion } from "../../../utils/detect-duplicate-version";
import { waitForConfig } from "../../config-provider/config-state";
import { StyledHost } from "../../../ui-components";
import { checkoutStore } from "../../../store/checkout.store";

@Component({
  tag: "justifi-card-form",
  shadow: true,
})
export class JustifiCardForm {
  private cardFormElement!: HTMLCardFormElement;

  analytics: JustifiAnalytics;

  /**
   * Mask the card number to its last four digits when the field loses focus,
   * with an eye toggle to reveal it. Defaults to false. Inside
   * `justifi-modular-checkout` the wrapper's `mask-card-number` sets this;
   * an explicit value here wins.
   *
   * Anti-shoulder-surfing only, not a secrecy boundary.
   */
  @Prop() maskCardNumber?: boolean;

  async componentWillLoad() {
    await waitForConfig();

    detectDuplicateVersion();
    this.analytics = new JustifiAnalytics(this);
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
  }

  @Method()
  async validate(): Promise<any> {
    return this.cardFormElement.validate();
  }
  
  @Method()
  async tokenize({
    clientId,
    paymentMethodMetadata,
    account,
  }: {
    clientId: string,
    paymentMethodMetadata: any,
    account?: string,
  }) {
    return this.cardFormElement.tokenize({ clientId, paymentMethodMetadata, account });
  }

  render() {
    return (
      <StyledHost>
        <card-form
          ref={(el) => (this.cardFormElement = el as HTMLCardFormElement)}
          maskCardNumber={this.maskCardNumber ?? checkoutStore.maskCardNumber}
        />
      </StyledHost>
    )
  }
}
