import { test, expect } from '@playwright/test';

// Allowing process to be slowed for demonstration
const isDemo = Boolean(process.env.DEMO) || process.argv.includes('--headed');
const pauseForDemo = async (page: import('@playwright/test').Page, ms = 1000) => {
  if (isDemo) await page.waitForTimeout(ms);
};

test.afterEach(async ({ page, context }) => {
  if (!page.isClosed()) {
    await page.close();
  }
  await context.close();
});

test.describe('SauceDemo Nutapos Happy flow (Purchase and Login)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

test('E2E Purchase flow as standard_user and single product', async ({ page }) => {

await test.step('Login using valid credential and Landing on Homepage', async () => {
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(page.getByText('Products')).toBeVisible();
  await pauseForDemo(page);
});

await test.step('Find and select product to add to cart', async () => {
  const backpackCard = page
    .locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Fleece Jacket' });
  
  await backpackCard.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  await pauseForDemo(page);
});

await test.step('Review product in cart and proceed to checkout page', async () => {
  await page.getByTestId('shopping-cart-link').click();
  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(page.getByText('Sauce Labs Fleece Jacket')).toBeVisible();
  await pauseForDemo(page);
  await page.getByRole('button', { name: 'Checkout' }).click();
});

await test.step('Filling customer and delivery details', async () => {
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  await page.getByPlaceholder('First Name').fill('Welly');
  await page.getByPlaceholder('Last Name').fill('Firdaus');
  await page.getByPlaceholder('Zip/Postal Code').fill('55711');
  await pauseForDemo(page);
  await page.getByRole('button', { name: 'Continue' }).click();
});

await test.step('Order summary checking and order finalization', async () => {
  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  await expect(page.getByText('Sauce Labs Fleece Jacket')).toBeVisible();
  await pauseForDemo(page);
  await page.getByRole('button', { name: 'Finish' }).click();
});

await test.step('Order confirmation validation', async () => {
  await expect(page).toHaveURL(/\/checkout-complete\.html$/);
  await expect(
    page.getByRole('heading', { name: 'Thank you for your order!' })
  ).toBeVisible();
  await pauseForDemo(page, 1500);
});
});

test('Ensure Blocked user unable to login', async ({ page }) => {

await test.step('Login using blocked user credentials', async () => {
  await page.getByPlaceholder('Username').fill('locked_out_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Checking for login error banner text

  await expect(page.getByTestId('error')).toContainText(
      'Sorry, this user has been locked out.'
    );
  await pauseForDemo(page, 1500);
  });
});
});

test.describe('SauceDemo Nutapos Happy flow (Sorting, Mandatory Field, and Order Total Validation)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
});

test('Product sorting feature validation', async ({ page }) => {

  const sortDropdown = page.getByTestId('product-sort-container');
  const itemNames = page.getByTestId('inventory-item-name');
  const itemPrices = page.getByTestId('inventory-item-price');

  await test.step('Sort from first to last A-Z', async () => {
    await sortDropdown.selectOption('az');

    const displayedNames = await itemNames.allTextContents();
    const expectedNames = [...displayedNames].sort((a, b) => a.localeCompare(b));

    expect(displayedNames).toEqual(expectedNames);

    await pauseForDemo(page);
  });

  await test.step('Sort from last to first Z-A', async () => {
    await sortDropdown.selectOption('za');

    const displayedNames = await itemNames.allTextContents();
    const expectedNames = [...displayedNames].sort((a, b) => b.localeCompare(a));

    expect(displayedNames).toEqual(expectedNames);

    await pauseForDemo(page);
  });

  await test.step('Sort from lowest price', async () => {
    await sortDropdown.selectOption('lohi');

    const priceTexts = await itemPrices.allTextContents();
    const displayedPrices = priceTexts.map((text) => parseFloat(text.replace('$', '')));
    const expectedPrices = [...displayedPrices].sort((a, b) => a - b);

    expect(displayedPrices).toEqual(expectedPrices);

    await pauseForDemo(page);
  });

  await test.step('Sort from highest price', async () => {
    await sortDropdown.selectOption('hilo');

    const priceTexts = await itemPrices.allTextContents();
    const displayedPrices = priceTexts.map((text) => parseFloat(text.replace('$', '')));
    const expectedPrices = [...displayedPrices].sort((a, b) => b - a);

    expect(displayedPrices).toEqual(expectedPrices);

    await pauseForDemo(page);
  });
});

test('Validates all required field is filled on Contact and delivery page', async ({ page }) => {
  await test.step('Add product and Proceed to contact and delivery page', async () => {
    await page
      .locator('.inventory_item')
      .filter({ hasText: 'Sauce Labs Fleece Jacket' })
      .getByRole('button', { name: 'Add to cart' })
      .click();
      
    await page.getByTestId('shopping-cart-link').click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });

  const continueButton = page.getByRole('button', { name: 'Continue' });
  const errorBanner = page.getByTestId('error');

  await test.step('Reject When first name field is empty', async () => {
    await continueButton.click();
    await expect(errorBanner).toHaveText('Error: First Name is required');
    await pauseForDemo(page);
  });

  await test.step('Reject When last name field is empty', async () => {
    await page.getByPlaceholder('First Name').fill('Wel');
    await continueButton.click();
    await expect(errorBanner).toHaveText('Error: Last Name is required');
    await pauseForDemo(page);
  });

  await test.step('Reject When zip code field is empty', async () => {
    await page.getByPlaceholder('Last Name').fill('Fir');
    await continueButton.click();
    await expect(errorBanner).toHaveText('Error: Postal Code is required');
    await pauseForDemo(page);
  });
});

test('Verification for total price calculation', async ({ page }) => {
  const targetProducts = ['Sauce Labs Fleece Jacket', 'Sauce Labs Backpack'];
  const capturedPrices: number[] = [];

  await test.step('Add multiple product and get price value', async () => {
    for (const productName of targetProducts) {
      const prodCard = page.locator('.inventory_item').filter({ hasText: productName });
      const prodPrice = await prodCard.getByTestId('inventory-item-price').innerText();
      capturedPrices.push(parseFloat(prodPrice.replace('$', '')));
      
      await prodCard.getByRole('button', { name: 'Add to cart' }).click();
    }

    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');
    await pauseForDemo(page);
  });

  await test.step('Continue to Cart page and proceed to checkout', async () => {
    await page.getByTestId('shopping-cart-link').click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByPlaceholder('First Name').fill('Welly');
    await page.getByPlaceholder('Last Name').fill('Firdaus');
    await page.getByPlaceholder('Zip/Postal Code').fill('55711');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  });

  await test.step('Verify calculation for total price, Tax, total item purchased', async () => {
    const subtotalProd = Number(capturedPrices.reduce((sum, price) => sum + price, 0).toFixed(2));
    const taxGet = Number((subtotalProd * 0.08).toFixed(2));
    const totalPriceFixed = Number((subtotalProd + taxGet).toFixed(2));

    await expect(page.getByTestId('subtotal-label')).toHaveText(`Item total: $${subtotalProd.toFixed(2)}`);
    await expect(page.getByTestId('tax-label')).toHaveText(`Tax: $${taxGet.toFixed(2)}`);
    await expect(page.getByTestId('total-label')).toHaveText(`Total: $${totalPriceFixed.toFixed(2)}`);

    // Print on console for calculation breakdown and QA validation
    console.log(`Price Calculation Verified -> Subtotal: ${subtotalProd} + Tax (8%): ${taxGet} = Total: ${totalPriceFixed}`);

    // On screen verification for quick check, whether calculation is correct or not
    if (isDemo) {
      await page.evaluate(
        ({ subtot, tax, total }) => {
          const validateBox = document.querySelector('.summary_info') as HTMLElement | null;
          if (validateBox) {
            validateBox.style.border = '3px solid #2e7d32';
            validateBox.style.borderRadius = '8px';
            validateBox.style.borderRadius = '12px';

            const boxBanner = document.createElement('div');
            boxBanner.textContent = `QA Verification: ${subtot} + ${tax} (8% Tax) = ${total}`;
            boxBanner.style.cssText = 'margin-top: 12px; padding: 10px 14px; background: #e8f5e9; color: #1b5e20; font-weight: 700; border-radius: 6px; font-size: 14px;';
            validateBox.appendChild(boxBanner);
          }
        },
        { subtot: subtotalProd, tax: taxGet, total: totalPriceFixed }
      );
    };

    await pauseForDemo(page, 2500);
  });
});
});