import { test, expect, Page } from "@playwright/test";

async function fillIframeInput(page: Page, iframeName: string, value: string) {
  const frame = page.frameLocator(`iframe[name="${iframeName}"]`);
  const input = frame.locator("input");
  await input.waitFor({ state: "visible", timeout: 15000 });
  await input.fill(value);
}

test.describe("Checkout Component", () => {
  test("should complete checkout with credit card", async ({ page }) => {
    test.setTimeout(90000);

    await page.goto("/checkout");
    await page.waitForSelector("justifi-checkout");

    await page.getByRole("radio", { name: "New credit or debit card" }).click();

    await fillIframeInput(page, "cardNumber", "4242424242424242");
    await fillIframeInput(page, "expirationMonth", "11");
    await fillIframeInput(page, "expirationYear", "30");
    await fillIframeInput(page, "CVV", "123");

    await page.getByRole("textbox", { name: "Postal Code" }).fill("55114");

    await page.getByRole("button", { name: "Pay", exact: true }).click();

    const preTag = page.locator("#output-pane pre");
    await expect(preTag).toContainText("Checkout completed successfully", {
      timeout: 60000,
    });

    const responseText = await preTag.textContent();
    const response = JSON.parse(responseText!);

    expect(response.checkout.id).toMatch(/^chc_/);
    expect(response.checkout.payment_status).toBe("succeeded");
    expect(response.checkout.payment_response.data.amount).toBe(1799);
    expect(response.message).toBe("Checkout completed successfully");
  });
});
