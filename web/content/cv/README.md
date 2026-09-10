# CV content (file-based CMS)

The text on **/resume** and in the downloadable PDFs comes from the two files in
this folder:

- `en.json` — English
- `no.json` — Norwegian

Edit them directly. `content/resume.ts` validates each file on build; if a
required field is missing or empty the build fails with a message naming the
field.

## Fields

| Field            | Type                                             | Notes |
| ---------------- | ------------------------------------------------ | ----- |
| `labels`         | object of short UI strings                       | Section headings, the "Download PDF" button text, the `(opens new tab)` suffix, and the toggle's accessible name. |
| `profileSummary` | string (min ~20 chars)                           | The blurb under "Profile". |
| `contact`        | `{ location, phone, email }`                     | `email` must be a valid address. Shown on the page and used by tests. |
| `skills`         | `[{ category, items: string[] }]`               | Each group needs at least one item. |
| `languages`      | `string[]`                                       | e.g. `"English (Fluent)"`. |
| `experience`     | `[{ role, company, period, bullets: string[] }]` | Newest first. `period` is free text, e.g. `"03/25 – 08/25"`. |
| `projects`       | `[{ title, bullets: string[], link? }]`         | `link` is optional: `{ label, href }` (href must be a full URL). |
| `education`      | `[{ degree, institution, period }]`             |       |

Keep `en.json` and `no.json` structurally parallel (same number of jobs /
projects / education entries) — a test checks this.

## After editing

The website updates on save (dev server). To refresh the **downloadable PDFs** so
they match:

```bash
npm run dev        # in one terminal (or: npm run preview)
npm run cv:pdf     # in another — writes web/public/assets/cv_andreas_sandnes_{en,no}.pdf
```
