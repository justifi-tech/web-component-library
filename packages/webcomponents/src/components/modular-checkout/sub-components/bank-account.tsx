import { Component, h, Method } from "@stencil/core";
import { checkPkgVersion } from "../../../utils/check-pkg-version";
import JustifiAnalytics from "../../../api/Analytics";
import { waitForConfig } from "../../config-provider/config-state";
import { StyledHost } from "../../../ui-components";

@Component({
  tag: "justifi-bank-account-form",
  shadow: true,
})
export class BankAccountForm {
  private bankAccountFormElement!: HTMLBankAccountFormElement;

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
    return this.bankAccountFormElement.validate();
  }

  @Method()
  async tokenize({
    clientId,
    paymentMethodMetadata,
    account
  }: {
    clientId: string,
    paymentMethodMetadata: any,
    account?: string,
  }) {
    return this.bankAccountFormElement.tokenize({ clientId, paymentMethodMetadata, account });
  }

  render() {
    return (
      <StyledHost>
        <bank-account-form ref={(el) => (this.bankAccountFormElement = el as HTMLBankAccountFormElement)} />
      </StyledHost>
    );
  }
}
