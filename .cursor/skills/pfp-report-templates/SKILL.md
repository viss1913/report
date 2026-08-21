---
name: pfp-report-templates
description: >-
  Edit PFP partner PDF report HTML templates (Finam v2, Rostech, Renaissance/YADRO).
  Preserves data-finam-v2-field/block markers and {{placeholders}} for backend PDF binding.
  Use when changing report layout, branding, CSS, assets, or when the user mentions
  Finam/Rostech/Renaissance report templates, brands/, or partner PDF HTML.
---

# PFP Report Templates (partner)

## When to use

User asks to change PDF report look for Finam / Rostech / Renaissance, or works under `brands/`.

## Read first

1. `AGENTS.md`
2. `docs/PARTNER_GUIDE.md`
3. `brands/<brand>/README.md` + `MANIFEST.md`

## Scope

- Edit only one brand folder per task: `brands/finam-v2`, `brands/rostech`, or `brands/renaissance`.
- Do not invent backend code, API routes, or calculation logic in this repo.

## Hard rules

1. Keep page canvas **595×842**.
2. Keep root page class:
   - Finam: `article.finam-v2-page`
   - Rostech/Renaissance: element with class `page`
3. Never remove/rename:
   - `data-finam-v2-field`
   - `data-finam-v2-block`
   - `{{snake_case}}` placeholders
4. Keep relative asset paths `assets/...`.
5. Do not commit secrets or personal data.

## Safe edit patterns

**OK — restyle a field without breaking binding:**

```html
<!-- before -->
<div class="old" data-finam-v2-field="reserve-initial">300&nbsp;000 ₽</div>
<!-- after -->
<div class="new bigger" data-finam-v2-field="reserve-initial">300&nbsp;000 ₽</div>
```

**OK — wrap placeholder text:**

```html
<span class="accent">{{monthly_contribution}}</span>
```

**BAD — rename binding:**

```html
<!-- breaks production -->
<div data-finam-v2-field="initial-amount">...</div>
<p>{{monthlyPayment}}</p>
```

## Workflow

1. Confirm brand with user if unclear.
2. Change HTML/CSS/assets in that brand only.
3. Run: `node scripts/check-templates.js`
4. If check fails, restore missing markers — do not delete baseline.
5. Summarize visual changes for the PR description.

## Brand notes

### finam-v2

- Shared tokens: `tokens.css`
- Multi-page files use multiple `<article class="finam-v2-page">`
- Dynamic content is mostly via `data-finam-v2-field` / `data-finam-v2-block`
- Demo numbers inside fields are mocks for browser preview

### rostech

- Shared CSS: `css/style.css`, fonts in `fonts/`
- Placeholders documented in HTML comments + `MANIFEST.md`
- Bars may use inline `style="height:...%"` — backend can rewrite heights

### renaissance

- Shared shell: `shell.css`
- Cover + goal pages + shared `tail-01…tail-12`
- Placeholders `{{...}}`; unknown keys become «—» on backend

## Validation

Always run before finishing:

```bash
node scripts/check-templates.js
```

Optional regenerate baseline (PFP only, after intentional contract change):

```bash
node scripts/extract-baseline.js
```

## Done criteria

- Check script passes
- No renamed bindings
- Visual goal achieved
- Short note of what changed
