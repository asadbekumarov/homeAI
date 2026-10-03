---
title: Web Accessibility (A11y) Rules
impact: HIGH
tags: accessibility, a11y, wcag, aria, ux
---

# Web Accessibility (A11y) Rules

Guidelines based on WCAG 2.1/2.2 AA standards and the `ai-agent-a11y-accessibility-reviewer` specifications.

## 1. Semantic Structure & Elements
- Always prefer native HTML elements over ARIA roles (`<button>` over `<div role="button">`, `<a>` over `<span onClick>`).
- Heading tags (`<h1>` to `<h6>`) must strictly follow a logical hierarchy without skipping levels.
- Landmarks must be used for layout: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`.

## 2. Interactive Elements & Touch Targets
- Icon buttons or graphical controls without visible text must have an explicit `aria-label`.
- All clickable and touch targets must measure at least **44x44px** (minimum hit target).
- Never remove focus outlines without providing a visible focus alternative (`focus-visible:ring-2 focus-visible:ring-accent`).
- Keyboard operability is mandatory: interactive elements must respond to `Enter` and `Space`, and dialogs must dismiss on `Escape`.

## 3. Forms & State Communication
- Every form field requires an explicit associated `<label>` (via `htmlFor` / `id`) or `aria-label`.
- Dynamic errors or async loading states must use `aria-live="polite"` or `role="alert"`.
- Modals must implement `role="dialog"`, `aria-modal="true"`, and trap keyboard focus.

## 4. Visual & Motion Considerations
- Text-to-background contrast ratio must be at least **4.5:1** for regular text and **3:1** for large text or UI components.
- Color must never be the only indicator of state, error, or selection.
- All animations and smooth scrolls must respect `prefers-reduced-motion`.
