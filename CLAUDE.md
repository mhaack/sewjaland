# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> For full AEM Edge Delivery Services conventions, commands, and deployment process see [AGENTS.md](./AGENTS.md).

## Site Purpose

Sewjaland is a personal sewing project tracker. Pages live at `/projects/{year}/{slug}` and are authored in German. The site uses a dark theme with a spring color palette.

## Project-Specific Blocks

Beyond the boilerplate blocks (`cards`, `columns`, `hero`, `header`, `footer`, `fragment`), this project adds:

| Block | Purpose |
|---|---|
| `project-details` | Key-value metadata card for a sewing project (date, pattern, fabrics, cost, etc.) |
| `project-gallery` | Photo carousel/slideshow auto-built from loose images on project pages |

### project-details

Authored as a two-column table of key/value rows. The JS reads the first column as the field key (lowercased), maps it through a `FIELDS` config object, and renders a `<dl>` grid. Unknown keys are silently ignored — only keys defined in `FIELDS` appear. The sticky positioning (desktop) is intentional: it sits beside the project narrative text.

Supported field keys (German labels in the rendered UI):
`date`, `duration`, `pattern`, `fabrics`, `fabrics spend`, `shop`, `material cost`

### project-gallery

**Not authored directly.** It is created automatically by `buildPhotoGallery` in `scripts.js` whenever loose `<picture>` elements (not already inside a block) are found on a page where `document.body` has the class `project`. Single images render without carousel controls; two or more images become a keyboard- and touch-navigable carousel.

## Auto-Blocking Architecture

`scripts.js` runs two auto-block builders on every page:

1. **`buildHeroBlock`** — promotes the first `<h1>` + preceding `<picture>` into a `hero` block (boilerplate behavior, guarded against duplicates).
2. **`buildPhotoGallery`** — collects all loose pictures on `body.project` pages into a `project-gallery` block inserted before the first picture's paragraph.

The `body.project` class is set by the CMS template metadata. To test locally without CMS content, add `<body class="project">` to your draft HTML.

## Design System

Defined in `styles/styles.css` as CSS custom properties:

- **Theme**: dark background (`#000`), warm text (`#fff5eb`), `--link-color: #e8285a` (bloom)
- **Spring palette**: `--color-bloom` (pink), `--color-leaf` (green), `--color-sun` (yellow), `--color-sky` (blue) — used for cycling accent colors in `project-details`
- **Fonts**: Roboto body, Roboto Condensed headings
- **Breakpoints**: 600px (tablet), 900px (desktop), 1200px (wide) — mobile-first

## Button Authoring Convention

In the CMS, authors control button style through text formatting:
- `**bold link**` → `.button.primary` (filled)
- `_italic link_` → `.button.secondary` (outlined)
- `**_bold+italic link_**` → `.button.accent` (pink fill, high-impact CTA)

This is decoded in `decorateButtons()` in `scripts.js`.
