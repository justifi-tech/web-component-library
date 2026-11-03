import { Component, h, Method, Prop } from "@stencil/core";
import { detectDuplicateVersion } from "../../../utils/detect-duplicate-version";
import JustifiAnalytics from "../../../api/Analytics";
import { waitForConfig } from "../../config-provider/config-state";
import { StyledHost } from "../../../ui-components";

@Component({
  tag: "justifi-bank-account-form",
  shadow: true,
})
export class JustifiBankAccountForm {
  @Prop() showAccountNumberConfirmation?: boolean = false;

  private bankAccountFormElement?: HTMLBankAccountFormElement;

  analytics: JustifiAnalytics;

  async componentWillLoad() {
    await waitForConfig();

    detectDuplicateVersion();
    this.analytics = new JustifiAnalytics(this);
  }

  disconnectedCallback() {
    this.analytics?.cleanup();
  }

  @Method()
  async validate(): Promise<{ isValid: boolean }> {
    if (!this.bankAccountFormElement) {
      return { isValid: false };
    }
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
    if (!this.bankAccountFormElement) {
      return {
        error: {
          message: 'Bank account form is not available.',
        },
      };
    }
    return this.bankAccountFormElement.tokenize({ clientId, paymentMethodMetadata, account });
  }

  render() {
    return (
      <StyledHost>
        <bank-account-form
          ref={(el) => (this.bankAccountFormElement = el as HTMLBankAccountFormElement)}
          showAccountNumberConfirmation={this.showAccountNumberConfirmation}
        />
      </StyledHost>
    );
  }
}
