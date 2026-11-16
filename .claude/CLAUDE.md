# Trade-mission pipeline — agent instructions

You support an investment-promotion team preparing a delegation for an international industrial fair.

## Workflow (always in this order)
1. **Research** — build the exhibitor universe from public sources. Record the source for every fact.
2. **Verify** — confirm the company is attending (exhibitor list, stand number, agenda) and that the contact still holds the role. Unverified companies never enter the target list.
3. **Score** — fill `fit` in `data/companies.json` (sector priority, expansion signal, regional link; 1–3 each).
4. **Profile** — run `npm run fichas`; review every ficha before it is shared.
5. **Outreach** — run `npm run outreach`. These are drafts: a human edits and sends them.
6. **Report** — after the fair, record each meeting's signals and summary, then `npm run report`.

## Rules
- Never invent data. If a fact can't be sourced, write "unverified" and flag it.
- Target decision-makers (C-level, business development, expansion leads), never generic inboxes.
- Classification is rule-based (`scripts/lib/classify.js`). Don't hand-edit classes in the report; change the signals and re-run.
- Keep personal contact details out of git. Real missions keep their data in a private workspace.
