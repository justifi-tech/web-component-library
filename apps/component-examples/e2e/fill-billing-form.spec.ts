import { test, expect } from "@playwright/test";

test.describe("fillBillingForm", () => {
  test("calls fillBillingForm on justifi-checkout, toggles payment method, and verifies billing data persists in the new form fields", async ({
    page,
  }) => {
    await page.goto("/fill-billing-form");
    await page.waitForSelector("justifi-checkout");

    // Wait for checkout data fetch
    await page.waitForTimeout(3000);

    // Click Fill Billing Form button to populate billing data
    await page.getByTestId("fill-billing-form-button").click();

    // Verify postal code is filled (card form visible by default)
    const postalCodeInput = page.getByRole("textbox", { name: "Postal Code" });
    await expect(postalCodeInput).toHaveValue("90210");

    // Toggle to bank account payment method
    await page.getByRole("radio", { name: "New bank account" }).click();

    // Wait for form to switch
    await page.waitForTimeout(500);

    // Verify billing data persists: name field should show filled value
    const nameInput = page.getByRole("textbox", { name: "Full Name" });
    await expect(nameInput).toHaveValue("Jane Doe");

    // Toggle back to card
    await page.getByRole("radio", { name: "New credit or debit card" }).click();

    await page.waitForTimeout(500);

    // Verify postal code still persists
    await expect(postalCodeInput).toHaveValue("90210");
  });
});
