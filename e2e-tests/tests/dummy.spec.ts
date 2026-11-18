import { expect, test } from "@playwright/test";

test("fruit slot machine spins and adds one random fruit to the basket", async ({
  page,
}) => {
  await page.goto("/index.html");
  await page.getByRole("link", { name: "Fruit Slot Machine", exact: true }).click();

  const spinButton = page.getByRole("button", {
    name: "Spin and add a random fruit to basket",
  });
  const slotStatus = page.getByRole("status");

  await spinButton.click();
  await expect(slotStatus).toHaveText("Spinning...");
  await expect(spinButton).toBeDisabled();
  await expect(slotStatus).toHaveText(
    /^(Apple|Banana|Lemon) added to your basket!$/,
  );
  await expect(spinButton).toBeEnabled();

  await page.goto("/basket.html");
  await expect(page.locator("#basketList li")).toHaveCount(1);
  await expect(page.locator("#basketList")).toContainText(
    /Apple|Banana|Lemon/,
  );
});
