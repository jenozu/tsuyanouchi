# How to Register for US Sales Tax and EU VAT

---

## In simple terms: business vs. tax registration

**Do I need to register a business?**  
You already have a business: your **sole proprietorship**. You don’t need a separate “business account” for tax. The sole prop is the entity that sells and collects tax. You can use it for this side business.

**What’s the “number” people talk about?**  
It’s not one single number. It’s a **tax registration number** that a **government** gives you when you register with **them** to collect sales tax or VAT in **their** area:

- **Canada** → You register with the CRA for GST/HST and get a **GST/HST number**.
- **A US state** → You register with that state and get a **sales tax permit number** (one per state, only in states where you have nexus).
- **EU** → You register for OSS or IOSS and get a **VAT / IOSS number** from an EU country.

**Why do I need it?**  
When you collect tax from a customer, you’re holding **their** money to give to the government. The government wants to know who is collecting and remitting. So they ask you to **register** and they give you a **number**. You then:

1. Collect tax (Stripe can do this as soon as you turn on Stripe Tax).
2. Tell Stripe your number(s) in **Tax → Registrations** so reports match.
3. File returns and send that tax money to the government (you or an accountant).

**When do I need to register?**  
Only when you’re **obligated** (or choose to) in that place—e.g. you pass a sales threshold (Canada, EU) or have nexus (US state). Until then, you may not need to register there. When you do register, you get the number and add it to Stripe. Your sole proprietorship is enough; you’re not registering a “new” business, you’re registering your existing business for **tax** in that jurisdiction.

---

## Quick answers (Canada threshold, US, UK vs EU)

- **Canada: is the $30K threshold profit or revenue?**  
  **Revenue.** The small-supplier threshold is based on **total taxable supplies (revenue)**, not profit. If your revenue from taxable sales exceeds **CAD 30,000** in either (a) 4 consecutive calendar quarters or (b) any single calendar quarter, you must register for GST/HST. Your accountant can confirm for your province.

- **US: I don't sell much in the states—do I need to register?**  
  Probably **no**, for now. You only need to register in a US state when you have **nexus** there (e.g. physical presence or economic nexus: often **$100,000 in sales** or **200 transactions** in that state in a year). If your US sales are low, you likely don't have nexus in any state yet. Keep an eye on it as sales grow and re-check periodically (or with an advisor).

- **VAT: what rules would I cross that require registration? And I've only seen VAT on UK orders.**  
  **UK and EU are different.** The UK left the EU (Brexit), so:
  - **VAT on UK orders** = **UK VAT**. UK has its own rules (e.g. overseas sellers; low-value consignments ≤£135). So when you see VAT applied to UK customers, that's UK VAT.
  - **EU VAT** applies when you sell to customers in **EU countries** (e.g. Germany, France, Ireland—not the UK). You'd need to register for EU VAT (e.g. OSS/IOSS) when you **cross the rules**, such as: distance sales to EU consumers above **€10,000 in a calendar year**, or when you use the IOSS scheme for low-value imports (≤€150). Below €10K to the EU you may not need to register. So: UK = one set of rules (UK VAT); EU = another (EU VAT). They're separate.

---

## Do I have to register right away?

- **Canada (GST/HST):** Often yes, once you’re near or over the threshold (threshold is **revenue**, not profit—commonly CAD 30,000 in revenue in 4 consecutive calendar quarters, or in any single quarter). Your accountant can confirm.
- **US state sales tax:** Only in states where you have **nexus** (see below). If you don't sell much in the US, you often have no US nexus and don't need to register in any state yet. Keep an eye on it as sales grow.
- **EU VAT:** Only if you’re selling into the EU and your country/role requires it (e.g. distance sales above thresholds, or using OSS voluntarily). An advisor can say when you’re obligated.

So: you can enable **Stripe Tax** and collect tax in Stripe based on customer address even before you have every registration; Stripe will calculate and show the correct rates. You become **obligated to register and remit** in a place once you have nexus or pass thresholds there. When you do register, you add that registration in Stripe so it’s reflected in reports and behavior.

---

## US sales tax registration

### 1. When do you have to collect US sales tax?

You must collect (and remit) in a state only if you have **nexus** there. Common cases:

- **Physical presence:** Warehouse, office, employees, or inventory in that state.
- **Economic nexus:** You exceed that state’s sales/transaction threshold (often **$100,000 in sales** or **200 transactions** in that state in a year; thresholds vary by state).

If you’re in Canada with no US presence and low US sales, you may have **no US nexus** yet. Check each state’s rules or ask a US tax advisor.

### 2. Steps to register (once you have nexus in a state)

1. **Get an EIN (Employer Identification Number)** from the IRS if you don’t have one.  
   - [IRS EIN application](https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online).

2. **Find that state’s tax authority.**  
   - Search for “[State name] Department of Revenue” or “[State name] sales tax registration.”

3. **Register for a sales tax permit / license.**  
   - Most states have an online portal.  
   - You’ll need: EIN, business legal name and address, owner/officer info, business type, and sometimes NAICS code.

4. **Add the registration in Stripe.**  
   - Stripe Dashboard → **Tax** → **Registrations** → Add registration → choose the state and enter the permit/number they give you.

5. **File returns on time.**  
   - States set filing frequency (monthly, quarterly, or annually). Stripe Tax reports help you prepare returns; you (or your accountant) still file with each state.

### 3. Useful links

- [TaxJar: How to register for a sales tax permit](https://www.taxjar.com/sales-tax/permits)  
- [Avalara: Sales tax nexus by state](https://www.avalara.com/us/en/learn/guides/sales-tax-nexus-laws-by-state.html)  
- Your state’s Department of Revenue (e.g. “California CDTFA”, “Texas Comptroller”, “New York DTF”).

---

## EU VAT registration (including OSS)

### 1. When do you have to charge EU VAT?

- Selling **physical goods** from Canada to EU consumers can create VAT obligations (e.g. distance sales thresholds, or import VAT).  
- The **One Stop Shop (OSS)** lets you register in **one** EU country and report (and pay) VAT for **all** EU B2C sales in one return, instead of registering in every country.

### 2. Which OSS scheme?

- **Union OSS:** For businesses **established in the EU** selling to consumers across the EU.  
- **Non-Union OSS:** For businesses **not established in the EU** (e.g. you’re in Canada) selling **services** to EU consumers.  
- **IOSS (Import One Stop Shop):** For **goods imported** into the EU with a value **≤ €150** per consignment. You collect VAT at checkout and report via IOSS.

For **physical goods** shipped from Canada to the EU, the usual options are:

- **IOSS** if your consignments are ≤ €150 (so you can collect VAT at checkout and use IOSS for reporting), or  
- Registering for VAT in an EU country and using **Union OSS** for cross-border EU sales, or dealing with import VAT/duties separately.

An EU or international tax advisor can confirm which scheme(s) you need.

### 3. How to register for OSS / IOSS

**Non-Union OSS (services, non-EU business):**

1. Choose a **Member State of Identification (MSI)** — any EU country where you’ll register and file (e.g. Ireland, Netherlands).  
2. Go to that country’s OSS portal (often under “VAT” or “One Stop Shop” on the tax authority website).  
3. Complete the registration (business details, contact, etc.).  
4. Once approved, you get a VAT number. Add it in **Stripe Dashboard → Tax → Registrations** (EU VAT/OSS).

**IOSS (imports ≤ €150):**

1. You need an **IOSS identification number**.  
   - Non-EU businesses often get it by registering in an EU country that offers IOSS (e.g. through the country’s tax portal or an intermediary).  
2. Register for IOSS in your chosen EU member state (see [EU IOSS portal](https://ec.europa.eu/taxation_customs/business/vat/one-stop-shop_en)).  
3. Add the IOSS number in **Stripe Dashboard → Tax → Registrations** so Stripe can apply and report VAT correctly.

**EU portal:**

- [EU VAT e-Commerce / One Stop Shop](https://vat-one-stop-shop.ec.europa.eu/one-stop-shop_en) — start here to see which scheme and which country to use.

### 4. After you’re registered

- **Stripe:** Tax → Registrations → Add your EU VAT/OSS or IOSS number.  
- Stripe will then charge and report VAT (and other taxes) according to the customer’s country and your settings.  
- You (or your advisor) file the OSS/IOSS returns and pay the VAT to the MSI; they redistribute to other member states.

---

## Summary

| Region   | Register when                          | Where to register                         | Then in Stripe                    |
|----------|----------------------------------------|-------------------------------------------|-----------------------------------|
| Canada   | Near/over GST/HST threshold             | CRA (Canada Revenue Agency)               | Tax → Registrations → Canada     |
| US state | You have nexus (physical or economic)   | That state’s Department of Revenue       | Tax → Registrations → that state |
| EU VAT   | You sell into EU and are obligated      | OSS/IOSS portal (one EU country as MSI)   | Tax → Registrations → EU VAT/IOSS|

You don’t have to register everywhere at once. Enable **Stripe Tax**, add registrations as you get them, and use this guide (and an accountant) to add US and EU registrations when required.
