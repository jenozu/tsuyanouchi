## Tax Setup Checklist for TsuyaNoUchi (Canada → US + EU, Physical Products)

This file is a **founder-friendly checklist** to figure out and set up your taxes correctly when selling **physical products** from **Canada** to **Canada, US, and EU** using **Stripe + Stripe Tax**.

Work through it in order. Treat this as a guide, not legal advice—plan to sanity-check key decisions with an accountant.

---

### 1. Clarify your business and products

- **Confirm business details**
  - Legal entity name and jurisdiction (e.g. Ontario, Canada).
  - Where inventory is stored (only Canada, or also US/EU warehouses or 3PLs?).
  - Where you physically operate from (office, employees, contractors).

- **Clarify what you sell**
  - List all physical products and bundles.
  - For each product, note:
    - Is it always shipped from Canada?
    - Any special tax treatment (e.g. clothing vs food vs books) in your main markets.

- **Decide where you’ll ship**
  - Canada only vs Canada + US vs Canada + US + EU.
  - Decide if there are **countries/regions you explicitly won’t ship to** at launch.

---

### 2. Understand where you’re likely obligated to collect tax

- **Canada (home base)**
  - Learn the basic Canadian rules:
    - GST/HST registration threshold (commonly CAD 30,000 in worldwide taxable sales over 4 consecutive quarters).
    - How GST/HST and PST vary by province.
  - Decide:
    - Are you already over the threshold or close to it?
    - If not yet registered, at what revenue level will you register?

- **United States (sales tax)**
  - Understand **nexus**:
    - Physical presence nexus: warehouse, office, employees, inventory in a state.
    - Economic nexus: sales/transaction thresholds (e.g. \$100k or 200 transactions in a state; varies by state).
  - Decide:
    - Do you have **any physical presence or inventory** in the US right now?
    - At what point will you evaluate and register in specific states (e.g. quarterly revenue review)?

- **European Union (VAT, physical goods)**
  - Clarify:
    - Are you shipping from Canada directly to EU customers?
    - Or storing inventory in the EU (which often triggers local VAT obligations)?
  - Learn key concepts:
    - Import VAT and customs duties when sending goods from Canada to EU.
    - Distance-selling thresholds and potential use of OSS/IOSS schemes.

---

### 3. Book a short consult with a tax professional

- **What to ask an accountant or tax advisor**
  - “I am a Canadian business selling physical products online to Canada, US, and EU using Stripe. Which registrations do I need **now**, and which can wait until I hit thresholds?”
  - “At what revenue or transaction levels should I plan to register for:
    - Canadian GST/HST (and any applicable PST)?
    - Specific US states’ sales tax?
    - EU VAT or OSS/IOSS?”
  - “How should I treat **shipping charges** for tax (taxable vs non-taxable) in each region?”
  - “How do I handle **returns and refunds** for tax reporting?”

- **Artifacts to come out with**
  - A list of:
    - **Current registrations** you must obtain now (e.g. Canadian GST/HST number).
    - **Future registrations** to watch for (US states, EU schemes) with approximate triggers.
  - Simple instructions on:
    - Filing frequency and deadlines for each registration.
    - What reports you’ll need from Stripe for filings.

---

### 4. Set up tax registrations in Stripe Tax

- **Enable Stripe Tax**
  - In Stripe Dashboard:
    - Go to `Tax` → enable Stripe Tax if not already.
    - Add your business details (legal entity, address, etc.).

- **Add current registrations**
  - Under `Tax → Registrations`, add:
    - **Canada**: enter your GST/HST number and home province once you are registered.
    - Any **US states** you’ve been advised to register in, once you have state tax IDs.
    - Any **EU VAT/OSS/IOSS** registration once you obtain it.

- **Decide tax behavior**
  - For each region, decide whether prices are:
    - **Tax-exclusive** (tax added on top at checkout), or
    - **Tax-inclusive** (tax included in listed price).
  - Configure default tax behavior in Stripe to match what you want to show customers.

---

### 5. Model tax-related data in your own database/admin

- **Extend your product model**
  - In your DB (e.g. Supabase), add fields such as:
    - `taxable` (boolean).
    - `tax_category` (string; e.g. `"physical_good"`, `"apparel"`, `"art_print"`).
    - Optional: `hs_code` and `origin_country` for shipping/customs workflows.

- **Decide per-product rules**
  - For each SKU/product, define:
    - Is it always taxable in Canada?
    - Any known reduced or zero-rated treatment in your major markets (if applicable).

- **Keep the math in Stripe**
  - Your DB/admin should store **what** the product is and configuration flags.
  - Stripe Tax should handle **how much tax** is charged per customer location.

---

### 6. Align Stripe Products/Prices with your catalog

- **Create or verify Stripe Products and Prices**
  - Ensure each product in your DB has:
    - A corresponding **Stripe Product**.
    - One or more **Stripe Prices** (for each currency/amount).

- **Assign tax codes in Stripe**
  - In Stripe Dashboard, for each product:
    - Set the appropriate **tax code** that matches your product type (e.g. physical goods, clothing, etc.).
    - Align tax codes with your `tax_category` field in your DB.

- **Keep IDs in sync**
  - Store Stripe `product_id` and `price_id` in your DB for each item.
  - Use these IDs to generate Checkout Sessions or Payment Links.

---

### 7. Configure Stripe Checkout / Payment Links for automatic tax

- **For Stripe Checkout Sessions**
  - In your backend, when creating a Checkout Session:
    - Use your DB to fetch the relevant `price_id` and quantity.
    - Include:
      - `automatic_tax: { enabled: true }`
      - `mode: 'payment'`
      - `success_url` and `cancel_url`
    - Ensure **shipping or billing address** collection is enabled in Stripe Checkout settings so Stripe Tax can determine the correct tax location.

- **For Payment Links**
  - When creating Payment Links in Stripe:
    - Add line items with the correct `price_id`.
    - Enable `automatic_tax[enabled]=true`.
    - Configure allowed shipping countries and shipping rates.

- **Address collection**
  - In Stripe Dashboard → Checkout / Payment Links settings:
    - Turn on **shipping address collection** for regions you ship to (Canada, US, EU countries).
    - Decide if you need billing address collection for extra validation.

---

### 8. Decide and configure shipping + customs behavior

- **Shipping charges**
  - Decide:
    - Whether shipping fees are **taxable** for each jurisdiction (ask your accountant).
  - Configure Stripe shipping rates and mark them as taxable/non-taxable as required.

- **Customs and import VAT (for EU and potentially US)**
  - Decide your model for cross-border orders:
    - **Delivered Duty Unpaid (DDU/DDP)**: Who pays import VAT and duties?
    - Will your customers pay import charges on delivery, or will you pre-collect them?
  - Coordinate with your shipping provider or customs broker for:
    - HS codes, origin, and product descriptions.
    - How duties and import VAT will be handled operationally.

---

### 9. Validate end-to-end behavior in a test environment

- **Stripe test mode**
  - Use Stripe’s test mode and test cards to:
    - Create test Checkout Sessions and Payment Links with `automatic_tax` enabled.
    - Place orders with different test addresses:
      - Canadian provinces (e.g. Ontario vs Alberta).
      - US states where you intend to sell (tax vs no tax states).
      - Several EU countries (e.g. Germany, France, Spain).

- **Check line items and totals**
  - For each test:
    - Confirm the **tax line** appears and looks reasonable for the destination.
    - Verify shipping taxes behave as intended.
    - Check the Stripe Dashboard reports show tax broken down by region.

---

### 10. Set up reporting and filing workflows

- **Stripe reports**
  - Explore Stripe Dashboard:
    - `Tax` → see tax summaries per jurisdiction.
    - Export reports needed for returns (e.g. Canadian GST/HST filings, EU VAT, US state returns).

- **Internal tracking**
  - Decide:
    - How often you’ll export data (e.g. monthly).
    - Where you store those exports (e.g. folder in your accounting system or cloud drive).

- **Filing cadence**
  - Based on accountant advice, document:
    - Filing frequency per jurisdiction (monthly/quarterly/annually).
    - Deadlines and responsible person (you, bookkeeper, accountant).

---

### 11. Ongoing maintenance checklist

- **Quarterly/biannual reviews**
  - Review:
    - Revenue by country/state to see if you’ve crossed new **economic nexus** thresholds in US states.
    - EU sales volume to assess if you need **EU VAT/OSS/IOSS** registration.
    - Any changes in product mix that might require different tax codes.

- **Product and price updates**
  - When adding new products:
    - Update your DB fields: `taxable`, `tax_category`, etc.
    - Create Stripe Product/Price and set the correct tax code.

- **Stay in touch with your advisor**
  - Re-check assumptions annually or after big changes (new markets, warehouses, or major growth).

---

### 12. What you should NOT do

- Don’t try to:
  - Maintain your own manual tax rate tables in your DB for every country/state.
  - Hard-code tax percentages in code unless directed by a tax professional for a very specific case.
  - Ignore registration thresholds once you know you’re approaching them.

- Do:
  - Let **Stripe Tax** handle the rate calculations.
  - Use your admin/DB only to describe products and configuration flags.
  - Use exports and Stripe reports to file accurately.

---

You can now use this file as your working checklist: tick items off as you complete them, and add notes/links from your accountant or local regulations where relevant.

