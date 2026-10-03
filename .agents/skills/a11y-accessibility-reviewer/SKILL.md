---
name: a11y-accessibility-reviewer
description: Evaluates code for accessibility (a11y) compliance across WCAG 2.1/2.2, WAI-ARIA, VoiceOver, and TalkBack for React and Next.js applications.
metadata:
  origin: guillempuche/ai-agent-a11y-accessibility-reviewer
---

# Accessibility (A11y) Reviewer Skill

Review code for accessibility (a11y) compliance. Use after writing or modifying UI components, forms, navigation, or interactive elements. Evaluates WCAG 2.1/2.2, WAI-ARIA, VoiceOver, and TalkBack compliance for React and Next.js.

## When to Use

- After writing or modifying React/Next.js components, modals, sliders, or forms.
- When performing a code review focusing on inclusive design and usability.
- When validating color contrast, touch target sizes, and keyboard accessibility.
- Before shipping new user-facing features.

## Core Evaluation Standards

### 1. Semantic Structure & Landmarks
- Single `<h1>` per page, hierarchical `<h2>` - `<h6>` headers.
- Landmark tags: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`.
- Lists use `<ul>`/`<ol>` and `<li>` structure.

### 2. Interactive Controls & Buttons
- Icon-only buttons MUST have `aria-label` or accessible text:
  ```tsx
  // ❌ Inaccessible
  <button onClick={toggleMenu}><MenuIcon /></button>

  // ✅ Accessible
  <button onClick={toggleMenu} aria-label="Menyuni ochish" aria-expanded={isOpen}>
    <MenuIcon aria-hidden="true" />
  </button>
  ```
- Touch target sizes must be at least **44x44px** (iOS/web standard) or **48x48px** (Android).
- Focus states must be visually evident (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`).

### 3. Forms & Inputs
- Every form field requires an explicit `<label htmlFor="...">` or `aria-label`.
- Error messages connected via `aria-describedby` and `aria-invalid="true"`.
- Live validation status announced with `aria-live="polite"` or `role="alert"`.

### 4. Modals & Dialogs
- Must use `role="dialog"` and `aria-modal="true"`.
- Focus trap inside active modal, focus returned to trigger element upon closing.
- Pressing `Escape` key must close the modal.

### 5. Color Contrast & Visuals
- Normal text: minimum **4.5:1** contrast ratio against its background.
- Large text (18pt+ or 14pt+ bold): minimum **3:1** contrast ratio.
- Non-text UI controls and states: minimum **3:1** contrast ratio.
- Decorative images must have `aria-hidden="true"` or `alt=""`. Informative images require descriptive `alt`.

### 6. Reduced Motion
- Respect user preference via `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

## Review Workflow

1. Scan files with `grep_search` or `view_file` for interactive elements (`<button>`, `<a>`, `<input>`, `<select>`, `<dialog>`, `role="button"`).
2. Check for missing labels, missing keyboard listeners (`onKeyDown`), and missing ARIA attributes.
3. Validate color contrast ratios and responsive touch targets.
4. Provide structured findings with severity (Critical, Major, Minor), WCAG criterion, and concrete code fixes.
