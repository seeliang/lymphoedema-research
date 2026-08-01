---
name: translate-lymphoedema-zh
description: Translate, rewrite, or review this repository's Simplified Chinese (zh-CN) lymphoedema research brief. Use for new edition translations, stiff or literal Chinese, terminology consistency, Chinese UI copy, translation revisions, or English-Chinese evidence and source parity checks.
---

# Translate the lymphoedema brief into Simplified Chinese

Produce natural patient-facing Chinese without changing the global English evidence record or weakening medical qualifications.

## Load the source of truth

From the repository root, read:

1. `CHINESE_TRANSLATION_GUIDE.md` completely;
2. the relevant entry in `src/data/editions.json` and every English evidence file for that version;
3. the matching object in `src/i18n/zh-CN.ts`;
4. `src/i18n/ui.ts` and Chinese pages when UI wording is in scope; and
5. the translation rules in `EDITORIAL_POLICY.md` and `CONTRIBUTING.md`.

Treat `en-AU` as the sole evidence source. Do not add, remove, strengthen, or reinterpret a finding in Chinese. If the English evidence itself must change, stop the translation-only workflow and use the repository's human editorial process first.

## Rewrite in three passes

1. **Meaning:** Map each title, population, study design, finding, possible meaning, limitation, trial caution, and source label to its English counterpart. Preserve numbers, uncertainty, negation, comparison groups, and study/result distinctions.
2. **Natural Chinese:** Rewrite meaning rather than English syntax. Prefer short sentences and ordinary patient-facing wording. Apply the terminology and anti-patterns in `CHINESE_TRANSLATION_GUIDE.md`.
3. **Consistency:** Scan navigation, metadata, banners, archive pages, accessibility labels, evidence cards, trial cards, and footer text. Use the same term for the same concept unless the context genuinely requires a different expression.

Do not copy journal abstracts. Do not add treatment advice. Do not translate a registered trial as an established finding.

## Record translation status honestly

- Increment `translationRevision` for a translation-only rewrite.
- Keep `translationStatus: "ai-assisted"` after AI work.
- Keep AI-assisted Chinese pages `noindex`.
- Change the status to `human-reviewed` only when an independent human language reviewer has explicitly completed and approved that review.
- Do not change the global edition version, `reviewedOn`, or `nextReviewDue` during translation-only work.
- Translate newly accepted evidence only after it has entered the global English edition.

## Validate before handoff

Run:

```sh
pnpm check
node .codex/skills/translate-lymphoedema-zh/scripts/check-translation-parity.mjs <edition-version>
```

Also search the Chinese source and built pages for obsolete literal phrases identified during the review. Inspect the rendered headings, notices, card labels, and version history—not only the translation data object.

Report the changed translation revision, parity result, test result, and whether independent human language review is still outstanding. Never describe an AI rewrite as completed human review or publish it without the repository's required approval.
