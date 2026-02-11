import { test, expect, Page } from "@playwright/test";

async function fillIframeInput(page: Page, iframeName: string, value: string) {
  const frame = page.frameLocator(`iframe[name="${iframeName}"]`);
  const input = frame.locator("input");
  await input.waitFor({ state: "visible", timeout: 15000 });
  await input.fill(value);
}

test.describe("Checkout Component", () => {
  test("should complete checkout with credit card", async ({ page }) => {
    await page.goto("/checkout");
    await page.waitForSelector("justifi-checkout");

    // Wait for checkout data fetch and iframe initialization
    await page.waitForTimeout(3000);

    await page.getByRole("radio", { name: "New credit or debit card" }).click();

    await fillIframeInput(page, "cardNumber", "4242424242424242");
    await fillIframeInput(page, "expirationMonth", "11");
    await fillIframeInput(page, "expirationYear", "30");
    await fillIframeInput(page, "CVV", "123");

    await page.getByRole("textbox", { name: "Postal Code" }).fill("55114");

    // Let iframe JS fully initialize before triggering tokenization
    await page.waitForTimeout(2000);

    const errorPromise = new Promise<string>((resolve) => {
      page.on("console", (msg) => {
        if (
          msg.type() === "error" &&
          msg.text().includes("[justifi-checkout] error-event")
        ) {
          resolve(msg.text());
        }
      });
    });

    const completeResponsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/v1/checkouts/") &&
        resp.url().endsWith("/complete") &&
        resp.request().method() === "POST",
    );

    await page.getByRole("button", { name: "Pay", exact: true }).click();

    const result = await Promise.race([
      completeResponsePromise.then((resp) => ({
        type: "success" as const,
        resp,
      })),
      errorPromise.then((err) => ({ type: "error" as const, err })),
    ]);

    if (result.type === "error") {
      throw new Error(
        `Checkout failed before /complete was called: ${result.err}`,
      );
    }

    const completeResponse = result.resp;
    const body = await completeResponse.json();

    expect(completeResponse.status()).toBe(201);
    expect(body.data.id).toMatch(/^chc_/);
    expect(body.data.payment_status).toBe("succeeded");
    expect(body.data.payment_response.data.amount).toBe(1799);
  });
});
