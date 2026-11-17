# Ghizilchi Signup — React + Tailwind migration

## Stage 6: Tailwind layout migration

This stage moves the first stable layout primitives from the legacy stylesheet into Tailwind utility classes in JSX:

- Page shell spacing, sizing, flex layout and overflow (`App.jsx`).
- Brand positioning, alignment, spacing and semantic color (`Brand.jsx`).
- Form section surface and responsive padding (`App.jsx`).
- Signup input grid and action-row layout (`SignupForm.jsx`).
- Login action-row layout (`LoginView.jsx`).

The migrated desktop and responsive values were copied from the original CSS. The detailed visual treatment (glass panel, gradients, button states, inputs, gem artwork, pointer effects, keyframes and other pixel-sensitive styling) remains in the original stylesheet for now.

## CSS cascade strategy

`legacy/style.css` is imported into Tailwind's `components` cascade layer. Tailwind utilities are emitted in the higher-priority `utilities` layer, allowing migrated JSX utility classes to override the old layout declarations without changing the remaining visual rules. Tailwind Preflight remains intentionally disabled to avoid changing the original reset.

## Project commands

```bash
npm install
npm run dev
npm test
npm run build
```

## Verification status

- Node unit tests: run locally with `npm test`.
- Vite production build: not confirmed in this environment because dependency installation did not complete.
- Pixel-level browser comparison: still required before declaring the migration visually verified.

## Next migration targets

1. Extract reusable field and button visual primitives into the shared component layer.
2. Move non-animated card, input and button styles to Tailwind component utilities.
3. Keep complex gem effects, keyframes, masks and pointer-driven effects in dedicated CSS until exact parity can be verified.


## Stage 7 — shared UI primitives

- Added a common `ui-button` hook to primary, secondary, and back button components.
- Centralized identical inherited font and pointer behavior in the shared component layer.
- Added `ui-field-control` to shared and custom text inputs; common width, outline, and inherited font behavior now live in one place.
- Kept gradients, dimensions, borders, hover/focus transitions, validation states, and animation rules in the legacy visual stylesheet to avoid unintended visual changes.
- Added regression tests for shared primitive usage and retained visual-state selectors.

Verification: `npm test` is the available automated check. A production Vite build and browser screenshot comparison still require dependencies to install successfully; the previous dependency installation attempt timed out, so neither is claimed as verified.

## Stage 8 — shared field shell

- Added `ui/FieldShell.jsx` as the single owner of field grouping, labels, validation-state class selection, and error-message placement.
- Updated `TextField` to use the shared shell, and migrated the custom mobile, verification-code, password, confirmation, and login-OTP controls to it.
- Preserved the original input IDs, `phoneGroup` / `codeGroup` hooks, conditional visibility, validation classes, and `error-message` placement so existing CSS and behavior continue to apply.
- Kept field gradients, dimensions, focus effects, validation animations, and other pixel-sensitive rules in the legacy stylesheet.
- Added regression tests for shared field-shell adoption and accessibility state.

Verification: all 19 Node tests pass. JSX syntax is checked with the installed TypeScript parser. A Vite production build and browser-level visual comparison remain unverified because project dependencies are not installed in this environment.

## Stage 9 — reusable panel surfaces

- Added `ui/Panel.jsx`, a shared semantic wrapper supporting `as`, `variant`, forwarded attributes, and children.
- Migrated the main glass container, inner form surface, and success surface to the shared Panel component.
- Preserved all existing semantic CSS hooks (`signup-container`, `form-section`, `success-state`) and their DOM element types, so existing layout, responsive behavior, transitions, and decorative effects remain responsible for the visuals.
- Added regression tests for Panel variants and usage across the primary surfaces.

Verification: run `npm test`; production build and browser screenshot comparison are still pending until dependencies are installed and the app is launched.

## Stage 10 — centralized motion tokens

- Added shared motion tokens for fields, primary/secondary buttons, button arrow/shine, and back-button transitions.
- Replaced duplicated inline timing declarations in those shared controls with references to the central tokens; all original durations and easing curves are preserved.
- Left decorative gem keyframes, page-entry animations, login transitions, and reduced-motion handling in the legacy stylesheet to avoid changing animation choreography.
- Added regression tests that verify token values, their usage, and retention of keyframes/reduced-motion support.

Verification: `npm test` and JSX syntax validation; Vite build and browser motion comparison remain to be confirmed.

## Stage 11 — safe CSS cleanup and audit

- Audited repeated selectors; responsive and state-specific overrides were retained because they control distinct viewport and UI states.
- Removed one duplicated global `prefers-reduced-motion` rule while retaining the global accessibility rule, gem-specific behavior, and auth-switch overrides.
- Added regression tests for reduced-motion behavior, responsive breakpoints, and critical visual selectors.
- Avoided speculative deletion of selectors potentially used dynamically by React or legacy DOM hooks.

## Stage 12 — final verification

- Final verification and production build results are recorded in the delivery notes after running the checks below.

Final verification results:

- `npm test`: 28 tests passed, 0 failed.
- JavaScript/JSX syntax: 42 source/config files checked, 0 syntax errors.
- Relative local imports: no missing targets found.
- Legacy CSS brace balance: 463 opening and 463 closing braces.
- `npm install --no-audit --no-fund` timed out in this environment; therefore `npm run build` could not run (`vite: not found`). A successful production build and real browser/mobile visual check are NOT claimed. Install dependencies locally with `npm install`, then run `npm run build` and `npm run dev` before deployment.
