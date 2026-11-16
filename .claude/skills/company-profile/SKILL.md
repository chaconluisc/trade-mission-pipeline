---
name: company-profile
description: Research and verify one company for a trade mission and write its entry in data/companies.json. Use when adding or refreshing a target company.
---

# Company profile

1. Find the company's official site, latest annual report or press releases, and the fair's exhibitor list.
2. Capture: HQ, sector, headcount, global footprint, presence in the target region.
3. Verify attendance (exhibitor list, stand, speaker agenda) and record the source in `verification_source`.
4. Identify one decision-maker (name + title) and confirm the title from a second public source.
5. Score `fit` (1–3 each): sector priority, expansion signal (recent plants, nearshoring statements), regional link (customers or suppliers already in the region).
6. Write the JSON entry. Any field you could not source is marked "unverified".
7. Run `npm test` and `npm run fichas` and check that the new ficha renders.
