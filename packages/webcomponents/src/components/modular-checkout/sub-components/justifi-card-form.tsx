import { Component, h, Method } from "@stencil/core";
import JustifiAnalytics from "../../../api/Analytics";
import { checkPkgVersion } from "../../../utils/check-pkg-version";
import { waitForConfig } from "../../config-provider/config-state";
import { StyledHost } from "../../../ui-components";

@Component({
  tag: "justifi-card-form",
  shadow: true,
})
export class JustifiCardForm {
  private cardFormElement!: HTMLCardFormElement;

  analytics: JustifiAnalytics;

  async componentWillLoad() {
    await waitForConfig();

    checkPkgVersion();
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
        <card-form ref={(el) => (this.cardFormElement = el as HTMLCardFormElement)} />
      </StyledHost>
    )
  }
}
