# LOS FOR PRIME HOME LOAN (PHL)
## BRD Document

**Version no.:** 0.5  
**Effective Date:** TBD  
**Prepared By:** BA Team  
**Reviewers:** Credit Policy, Risk, IT, Operations, Compliance

---

## 1. Objective
Housing loans are availed for purchase, construction, or upgradation of residential property. Prime Home Loan (PHL) will target Salaried, Self-Employed Non-Professional (SENP), and Self-Employed Professional (SEP) segments. The financed property will be captured as collateral/security in LOS.

This BRD defines business and system requirements to enable end-to-end digital processing of PHL for existing and new-to-bank customers.

---

## 2. Scope
1. Develop/extend Loan Operating System (LOS) to process PHL digitally.
2. Use existing SARTHAK application (used for AHL and MSME) and incorporate PHL-specific credit/risk policy.
3. Enable end-to-end journey for PHL in SARTHAK (origination to approval readiness).
4. Integrate with Finacle for final disbursement, aligned with AHL/MSME pattern.

### 2.1 Out of Scope
- Any requirement beyond agreed credit/risk scope for this release.
- Enhancements tagged for future phases (unless specifically approved via change request).

---

## 3. Process
1. PHL workflow will be built as a replica of existing AHL module with applicable product/policy parameter changes.
2. Existing external APIs for AHL (Dedupe, CIBIL, RAMP, Posidex Hunter) will be applicable to PHL.
3. AHL CR enhancements (e.g., Guarantor/Co-applicant additions, CAM updates, field additions) shall be reused for PHL where applicable.
4. Workflow and role-based user rights will follow current AHL workflow unless explicitly changed.
5. Final disbursement integration with Finacle will be retained.

---

## 4. Policy Parameters
### 4.1 Product Name
- Prime Home Loan (PHL)

### 4.2 Sub Products
- RHPL – Residential Home Purchase Loan
- RHPLR – Residential Home Purchase Loan Resale
- RSCL – Residential Self Construction Loan
- RPCL – Residential Plot Plus Construction Loan
- HLBT – Home Loan Balance Transfer
- Top Up

### 4.3 Loan Classification
**Tier 1:** Delhi NCR, Chandigarh, Jaipur, Ludhiana, Indore, Raipur, MMR, Ahmedabad, Pune, Chennai, Hyderabad, Bangalore  
**Tier 2:** Major state/city clusters (as per policy table)  
**Tier 3:** Remaining approved locations (as per policy table)  

> Note: New locations/states can be added/removed through master update.

### 4.4 General Product and Policy Norms
- Product and policy norms for PHL must be configurable and master-driven where applicable.
- Final Finacle product/scheme codes must be master-driven and configurable by authorized users.

---

## 5. System Changes – Mobile / LOS Screens
### 5.1 Customer Type (Dropdown)
- Bank Salaried
- Cash Salaried (only for Co-applicant)
- Self Employed Professional (SEP)
- Self Employed Non-Professional (SENP)

### 5.2 Screen Behavior
- If Bank/Cash Salaried selected → Salaried details screen shown.
- If SEP/SENP selected → Self-employed screen shown.
- No major base field changes in current phase unless mandated.

---

## 6. Income Eligibility – Salaried
### 6.1 Salaried Income
- Last 3 months average salary income.
- Existing AHL salary eligibility logic/screen applicable.

### 6.2 Additional Income
- Existing AHL additional income screen to be reused with policy-driven modifications.
- Rule: Aggregate of other income must not exceed:
  - 100% of core income (Salaried)
  - 125% of core income (Self-Employed)

---

## 7. Income Programs – SEP/SENP (System Changes)
A new **Income Program** field will be provided in Sales Summary:
- TIP – Traditional Income Program
- AIP – Assessed Income Program
- BP – Banking Surrogate Program
- GPR – Gross Professional Receipt

Based on selected program, Net Business Income will be computed in B-Cash Flow.

### 7.1 Sales Method Dropdowns
- BY ITR
- BY GST
- BY BANK STATEMENT

### 7.2 TIP (Traditional Income Program)
- ITR screen: available.
- GST screen: 12-month (or 4-quarter) entry with average computation.
- Logic: Minimum of ITR Sales × 1.5 or GST Turnover.
- PBDIT Margin (renamed from Gross Margin) used in eligibility.
- Tax and OD/CC interest captured in Operating Expenses.
- % Share captured to derive applicant-level monthly income.

**Proposed fields (B-Cash Flow):**
- Tax (numeric, 10 digits)
- Interest on OD/CC (numeric, 10 digits)
- % Share (percentage, 2 decimals)

### 7.3 AIP (Assessed Income Program)
- Multiplier field added in ITR screen.
- Declared PAT field added in Net Business Income section.
- Multiplier logic:
  - If (Assessed PAT / Declared PAT) > 6 → multiplier = 4
  - Else multiplier = 3.5
- Final PBT = Min(80% of Assessed PAT, Declared PAT × Multiplier)
- Monthly Income = Final PBT / 12

### 7.4 BP (Banking Surrogate Program)
- ABB captured through Banking screen (final balance driven ABB).
- Eligibility condition: BP Eligibility < ITR Eligibility.
- Rename field: “Total Deposit” → “Final ABB For Eligibility Calculation”.

### 7.5 GPR (Gross Professional Receipt)
- ITR annual income retained.
- GST: 12-month entry.
- Logic: Minimum of ITR Sales × 1.5 or GST Turnover.
- Monthly eligibility based on policy formula.
- If complete automated logic is deferred, capture below fields in Sales Summary:
  - Eligible Income (numeric, 10 digits)
  - Proposed FOIR (percentage, 2 digits)
  - Final Eligibility = Eligible Income × FOIR%

### 7.6 Cash Flow Summary
- Applicant/Co-applicant final eligibility must flow into Cash Flow Summary for net loan eligibility.
- Detailed layout finalization to be signed off with policy + IT.

---

## 8. Loan to Value (LTV)
- LTV calculation and display should be policy-configurable.
- LTV excluding insurance, including insurance, and customer-level LTV must be captured where applicable.

---

## 9. System Changes – Deviations
1. MSME-like manual deviation screen to be enabled for PHL.
2. Users can select applicable deviations manually during processing.
3. Admin must have option to update deviation master list.

---

## 10. Regulatory and Mandatory Field Additions
### 10.1 Mandatory Regulatory Fields
1. Type of transaction as per NHB (Resale/New Property/Self-construction)
2. Type of Property (Apartment/Open Plot/Land/Villa/Row-house/Bungalow/Independent House/Builder Floors)
3. Valuation considered (lower)
4. PSL (Yes/No)
5. Advance Type (Long-term loan)
6. Industry Code (Housing 108)
7. Advance Purpose (95011 Housing Loan)
8. BSR Org Code (dropdown, master)
9. Constitution Code (dropdown, master)
10. Collateral Code (dropdown, master)

### 10.2 Collateral Details – Additional Fields
- Unit of measurement area (Sqft)
- Property status (Under-construction / Completed)
- Type of area (Carpet/Built-up/Super Built-up)
- Fair market value
- Realizable value
- Distress value
- Liquidation value
- Cost of property (regulatory)
- Cost of property (all-inclusive)
- Project name, Builder name
- Survey no., Plot no.
- Nearest RBL bank location, distance from location
- LTV excluding/including insurance, customer-level LTV
- Current stage of construction
- APF (Yes/No), Deemed APF (Yes/No)
- Refinance (Yes/No)
- Land value, Construction value
- Balance transfer (Yes/No) + subtype (Resale/New)

### 10.3 Loan Approval Tab – Additional Fields
- Name of underwriter
- Name of approver
- Level of approver
- PD date
- Final approval date

### 10.4 Applicant/Co-applicant Tab
- Property Owner (Yes/No)

---

## 11. Integrations
1. External checks: Dedupe, CIBIL, RAMP, Posidex Hunter (as applicable).
2. Core banking: Finacle integration for final disbursement.
3. Master data dependencies: product codes, BSR/constitution/collateral codes.

---

## 12. Security, Audit, and Controls
1. Maker-checker principles to be enforced in approval stages.
2. All key field changes and deviations should be auditable.
3. Configuration changes in masters should be role-based and logged.

---

## 13. Reporting and Outputs
1. Eligibility computation output at applicant and application level.
2. Deviation summary and approval trail.
3. Regulatory extract readiness for required housing loan fields.

---

## 14. UAT / Acceptance Criteria
1. Customer type-based screen behavior works as per policy.
2. TIP/AIP/BP/GPR calculations produce expected eligibility outcomes.
3. Mandatory regulatory/collateral fields validate correctly.
4. Manual deviation workflow is available and admin-updatable.
5. Final disbursement handoff to Finacle is successful.
6. Audit trails generated for critical actions.

---

## 15. Assumptions and Dependencies
1. AHL baseline components are stable and reusable for PHL.
2. Policy logic and formula sign-off is finalized before SIT/UAT freeze.
3. External API contracts remain unchanged or are communicated in advance.
4. Finacle code mapping is finalized before production readiness.

---

## 16. Risks and Mitigation
1. **Policy interpretation drift** → Joint BA-Policy validation workshops and signed formulas.
2. **Master code mismatch** → Controlled UAT checklist and dual sign-off before go-live.
3. **Calculation defects in new programs** → Program-wise test packs with boundary scenarios.
4. **Phase-2 spillover** → Track deferred items in explicit CR backlog.

---

## 17. Open Items (TBD)
1. Final consolidated product table values by policy.
2. Exact city/state mapping for tiers from approved annexure.
3. Final formula confirmation for GPR automation (if not deferred).
4. Final Cash Flow Summary screen design updates.
5. Detailed screenshots annexure for LOS screens.

---

## 18. Sign-off Matrix
- **Business / Product:** ____________________  Date: __________
- **Credit Policy:** _________________________  Date: __________
- **Risk & Compliance:** _____________________  Date: __________
- **Technology (IT):** _______________________  Date: __________
- **Operations:** ____________________________  Date: __________

---

## Annexure A – LOS Screens Referenced
- Salary Screens
- Additional Income
- B-Cash Flow Screen: GST
- B-Cash Flow Screen: ITR
- B-Cash Flow Screen: Bank Statement
- Cash Flow Summary Screen
