Hi, this is a quick guide for this Automation Script!

# SauceDemo End-to-End Test Automation (Playwright + TypeScript)

Automated end-to-end (E2E) test suite built with **Playwright** and **TypeScript** targeting [Swag Labs (SauceDemo)](https://www.saucedemo.com/).

## Test Coverage

| # | Test Scenario | Coverage & Assertions |
| :--- | :--- | :--- |
| **1** | **E2E Purchase Flow** | Logs in as `standard_user`, adds item to cart, verifies cart badge state, completes shipping details, and validates order confirmation. |
| **2** | **Locked-Out User Validation** | Attempts login with `locked_out_user` and verifies the access-denied error banner. |
| **3** | **Catalog Sorting Verification** | Validates all 4 sort options (`Name A–Z`, `Name Z–A`, `Price Low–High`, `Price High–Low`). |
| **4** | **Checkout Form Validation** | Verifies mandatory field error messages when `First Name`, `Last Name`, or `Postal Code` is left empty on Checkout Step One. |
| **5** | **Price & Tax Math** | Get item prices from the catalog, calculates expected subtotal for each product + 8% tax + total price with tax, and validates checkout summary values. |

## Project Structure

```text
├── tests/
│   └── nutapos.saucedemo.welly.spec.ts   # Main E2E test suite
├── playwright.config.ts                  # Base URL, data-test attribute, and demo mode config
├── package.json                          # Dependencies and test execution scripts
└── README.md                             # Project documentation
```

## Prerequisites

* **Node.js** (v18 or higher)
* **npm**

## Setup & Installation

### Step 1: Get the Project Code (Choose One Method)

* **Option A — Clone via Git:**
  ```bash
  git clone [https://github.com/WellyYgItu/playwright-tests.git](https://github.com/WellyYgItu/playwright-tests.git)
  cd playwright-tests
  ```

* **Option B — Download as ZIP:**
  1. Open the [repository page](https://github.com/WellyYgItu/playwright-tests).
  2. Click the green **`<> Code`** button and select **Download ZIP**.
  3. Extract the downloaded archive and open a terminal inside the extracted `playwright-tests` folder.

* **Option C — Download from GitHub Releases:**
  1. Go to the **[Releases](https://github.com/WellyYgItu/playwright-tests/releases)** section on the right sidebar of the repository.
  2. Under the latest release, download **Source code (zip)**.
  3. Extract the archive and open a terminal inside the extracted folder.

### Step 2: Install Dependencies & Browser Binary

Run the following commands inside the project root directory:

```bash
npm install
npx playwright install chromium
```

## Running the Tests

* **Standard Headless Run (Fast CI Mode):**
  ```bash
  npx playwright test
  ```
* **Live Demo Mode (Headed + Slow Motion + On-Screen Verification Badge):**
  ```bash
  npm run test:demo
  ```
* **Interactive Playwright UI Mode:**
  ```bash
  npx playwright test --ui
  ```
* **View HTML Execution Report:**
  ```bash
  npx playwright show-report
  ```
