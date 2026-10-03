---
description: Comprehensive accessibility (a11y) code review for WCAG 2.1/2.2, WAI-ARIA, keyboard navigation, color contrast, and screen readers. Invokes a11y-accessibility-reviewer agent.
argument-hint: [file-or-component-path | blank for all UI components]
---

# Accessibility (A11y) Code Review

This workflow evaluates UI components and pages for accessibility compliance using the **a11y-accessibility-reviewer** agent guidelines.

## What This Workflow Does

1. **Target Discovery**: Scans specified components or all modified `.tsx`/`.jsx` files in `src/components/` and `src/app/`.
2. **Static Inspection**:
   - Semantic HTML usage (`<button>`, `<a>`, `<nav>`, `<main>`, `<dialog>`).
   - Icon-only interactive elements lacking `aria-label` or accessible names.
   - Form inputs lacking `<label>` associations.
   - Contrast ratios and touch target dimensions (min 44x44px).
   - Dialog and drawer focus management (`aria-modal`, `Escape` key listeners).
3. **Automated Linter**: Runs `eslint` to catch jsx-a11y warnings and errors.
4. **Structured Report**: Generates findings categorized by severity (`Critical`, `Major`, `Minor`) with exact code replacements.

## When to Use

- After creating or modifying UI components or pages.
- When preparing code for production release.
- When running compliance checks for WCAG 2.1/2.2 standards.
