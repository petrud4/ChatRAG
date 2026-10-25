import { test, expect } from "@playwright/test";

test("the chat page is ready", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await expect(page.getByRole("link", { name: "+ New chat" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Question" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send" })).toBeVisible();
});