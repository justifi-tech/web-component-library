## Goal
Add Canada (CAN) support to `@payment-provisioning` with minimal branching by introducing a country configuration strategy that drives labels, options, and validations. Keep steps consistent when possible; split only when fields diverge materially.

## Constraints
- Business is created prior to onboarding; `country_of_establishment` is set (default to "USA").
- Avoid sprawling `if (country === 'CAN')` checks. Prefer config-driven labels/validators/options and small, reusable subcomponents.
- Use country codes strictly as 'USA' and 'CAN' within the provisioning component.
- Ship in small, incremental PRs that remain backward compatible with USA.
- Do NOT set a `country` default in any child/sub-component. The `country` defaulting logic lives ONLY in `payment-provisioning-core` (from the loaded `Business`). All children must receive `country` via props and must not fall back to `USA` locally.

## Decisions from product
- Placeholder CAN business structures: duplicate the USA business classification options for now.
- Tax identifier: label as "Business Number (BN)", validate 9 digits.
- Identity number: SIN, 9 digits, no advanced checks for now.
- Bank account: build a separate CAN bank account form with CAN-specific fields and validations.
- Terms and conditions: create a separate CAN terms component; reuse USA behavior/structure for now and adjust content later.

## Incremental Plan

### 1) Data model plumbing (no UI change) — Status: Complete
- Add `country_of_establishment?: 'USA' | 'CAN'` to:
  - `packages/webcomponents/src/api/Business.ts` → `IBusiness` and `Business` class (constructor, `payload`). Default to `USA` if missing.
- Ensure `justifi-payment-provisioning` fetches the business and exposes `country_of_establishment` to form steps via prop/context.

Acceptance:
- Business load works for existing USA data, no UI changes.

### 2) Country configuration module — Status: Complete
- Create `packages/webcomponents/src/components/business-forms/utils/country-config.ts`:
  - `CountryCode = 'USA' | 'CAN'`
  - Labels: state/province, zip/postal, SSN/SIN, Tax ID/Business Number (BN)
  - Options: `stateOptions` vs `provinceOptions` (new file)
  - Validation helpers: `postalRegex`, `stateValues`, `taxIdLabel`, `identityIdLabel`
  - Business structures: `businessClassificationOptionsUSA` and placeholder `businessClassificationOptionsCAN` (copy of USA for now)
- Create `packages/webcomponents/src/utils/province-options.ts` list.

Acceptance:
- Importing config returns correct labels/options per country.

### 3) Validation refactor (backward compatible) — Status: Complete
- In `schema-validations.ts`, added country-aware helpers:
  - `makePostalValidation(country)` uses `postalRegex` from config (USA: 5 digits; CAN: A1A 1A1).
  - `makeIdentityNumberValidation(country)` for SSN (USA) vs SIN (CAN) 9-digit checks.
  - `makeTaxIdValidation(country)` for Tax ID (USA) vs BN (CAN) 9-digit checks.
- Schemas updated with explicit USA/CAN variants (backward compatible defaults retained):
  - `business-address-schema.ts` → `addressSchemaUSA`/`addressSchemaCAN` plus `addressSchema` alias defaulting to USA.
  - `business-core-info-schema.ts` → `businessCoreInfoSchemaUSA`/`businessCoreInfoSchemaCAN` with BN label for CAN via config.
  - Added country-keyed schema mappings to simplify selection:
    - `addressSchemaByCountry` and `identitySchemaByCountry` keyed by `CountryCode`.

Acceptance:
- Existing USA flows still validate as before.
- Unit tests added for CAN postal/state and SIN/BN minimal rules.

### 4) Country-aware address subcomponent — Status: Complete
- Create `form-address-fields` reusable component rendering: line1, line2, city, state/province, postal, country (disabled). (Created: `justifi-form-address-fields`)
- Replace hardcoded labels/options in:
  - `payment-provisioning/legal-address-form-step-core.tsx`
  - `owner-form/identity-address/identity-address-form.tsx`
  - `business-form/legal-address-form/legal-address-form.tsx`
- Read `country` from top-level and pass to `form-address-fields`; do not default or allow selecting in child components.

Note: This rule applies broadly across all steps/components. Do not add `country = CountryCode.USA` defaults in child components; only the top-level core determines and passes `country`.

Acceptance:
- USA shows "State" and "Zip Code" with numeric postal mask.
- CAN shows "Province" and "Postal Code" with alphanumeric pattern; country select remains disabled with "CAN".

### 5) Country-aware identity and core info fields — Status: Not started
- Representative/owner forms: switch SSN → SIN label and 9-digit validation via config.
- Core info: show "Business Number (BN)" for CAN with 9-digit validation; keep USA Tax ID logic.

Acceptance:
- USA unchanged; CAN shows SIN and BN fields as specified.

### 6) Bank account step split — Status: Not started
- Create `justifi-business-bank-account-form-step-core-canada` with CAN-specific fields and validations.
- In `payment-provisioning-form-steps.tsx`, derive step 5 component from country via a small factory to avoid inline branching, e.g., `getBankAccountStepFor(country)`.

Update: We will reuse the existing core step and toggle inputs/schema by `country`. The core receives `country` from the parent; do not set a local default in the core or its subcomponents.

Acceptance:
- USA continues using existing `justifi-business-bank-account-form-step-core`.
- CAN uses the new Canada-specific bank account step.

### 7) Terms and conditions split — Status: Not started
- Create `justifi-business-terms-conditions-form-step-canada` that reuses existing structure with CAN content placeholder.
- In `payment-provisioning-form-steps.tsx`, derive step 6 from country via `getTermsStepFor(country)`.

Acceptance:
- USA unchanged; CAN renders separate terms component (content can be updated later).

### 8) Tests and stories — Status: In progress
- Unit tests added for country-aware validators (USA and CAN).
- Story variants for USA vs CAN still pending (docs updates TBD).

Acceptance:
- CI green; stories render in docs build.

## Affected Files (initial)
- `packages/webcomponents/src/api/Business.ts`
- `packages/webcomponents/src/components/business-forms/schemas/schema-validations.ts`
- `packages/webcomponents/src/components/business-forms/schemas/business-address-schema.ts`
- `packages/webcomponents/src/components/business-forms/schemas/business-core-info-schema.ts`
- `packages/webcomponents/src/components/business-forms/payment-provisioning/legal-address-form/legal-address-form-step-core.tsx`
- `packages/webcomponents/src/components/business-forms/owner-form/identity-address/identity-address-form.tsx`
- `packages/webcomponents/src/components/business-forms/business-form/legal-address-form/legal-address-form.tsx`
 - `packages/webcomponents/src/components/business-forms/business-form/business-form.tsx`
 - `packages/webcomponents/src/components/business-forms/business-form/business-representative/business-representative.tsx`
- `packages/webcomponents/src/components/business-forms/payment-provisioning/business-core-info/business-core-info-form-step-core.tsx`
- `packages/webcomponents/src/components/business-forms/payment-provisioning/bank-account/business-bank-account-form-step-core.tsx` (USA)
- `packages/webcomponents/src/components/business-forms/payment-provisioning/bank-account/business-bank-account-form-step-core-canada.tsx` (new)
- `packages/webcomponents/src/components/business-forms/payment-provisioning/terms-and-conditions/business-terms-conditions-form-step-core-canada.tsx` (new)
- `packages/webcomponents/src/utils/state-options.ts` (read-only)
- `packages/webcomponents/src/utils/province-options.ts` (new)
- `packages/webcomponents/src/components/business-forms/utils/country-config.ts` (new)
- `packages/webcomponents/src/components/business-forms/payment-provisioning/form-address-fields/` (new)
 - `packages/webcomponents/src/components/business-forms/schemas/business-address-schema.ts` (added `addressSchemaByCountry`)
 - `packages/webcomponents/src/components/business-forms/schemas/business-identity-schema.ts` (added `identitySchemaByCountry`)

## Rollout Plan (small PRs)
- PR 1: Add `country_of_establishment` to model, wire through provisioning root, add province options + country-config scaffolding (unused). (Complete)
- PR 2: Refactor validations to be country-aware; keep USA default; add unit tests. (Complete)
- PR 3: Introduce `form-address-fields` and replace in legal/identity address forms. (Complete)
- PR 4: Add CAN-specific bank account form and wire step factory; add tests/stories.
- PR 5: Add CAN-specific terms component and wire step factory; add tests/stories.
- PR 6: Docs/stories polish and follow-ups.

## Notes
- Country codes must be 'USA' and 'CAN' in this component; do not use 'US' or 'CA'.
- Keep `country` immutable in UI (read-only from Business), matching requirement that it is set before onboarding.
- Do not default `country` in any child/sub-component (including schemas, inputs, and step cores). Defaulting happens in `payment-provisioning-core` only.
