# Agent Guidelines

## Language

- **Code, comments, and file names** — English
- **Documentation content** (`content/`) — English
- **PR titles and descriptions** — English
- **Commit messages** — English

## Content

When writing or editing content for this project, follow these rules:

- Do not use icons in text content.
- Do not use the em dash (-). Use a regular hyphen (-) instead.

## Project

This is a [Nextra](https://nextra.site/)-based documentation site for [Codee](https://codee.sh) — a platform built on top of [MedusaJS](https://medusajs.com).

## Repository structure

- `content/` — MDX documentation pages
- `app/` — Next.js app directory (layouts, pages, components)
- `app/components/` — Shared React components
- `app/wizard/` — Interactive resource configuration wizard
- `data/` — Static JSON data (resources, solutions)
- `scripts/` — Utility scripts (e.g. fetching resources)

## Conventions

- Components: TypeScript (`.tsx`), functional, no class components
- Styling: Tailwind CSS
- Data fetching for static content: scripts in `scripts/`, output to `data/`
- Do not commit `.env*` files
