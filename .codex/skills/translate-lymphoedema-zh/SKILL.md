---
name: translate-lymphoedema-zh
description: Translate, rewrite, or review this repository's Simplified Chinese (zh-CN) lymphoedema research brief with lymphoedema-specialist communication accuracy for patients and carers with approximately middle-school education. Use for new edition translations, readability review, stiff or literal Chinese, semantic-role errors such as outcome versus efficacy, unexplained medical or research jargon, eponyms such as Milroy disease, acronyms, genes, techniques, rare-disease labels, Chinese UI copy, translation revisions, terminology consistency, or English-Chinese evidence and source parity checks.
---

# Translate the lymphoedema brief into Simplified Chinese

Produce natural patient-facing Chinese without changing the global English evidence record or weakening medical qualifications.

## Adopt the translation role

Write as a lymphoedema specialist doctor explaining research to a patient or carer with approximately middle-school education and no medical or research training. Use the medical accuracy, risk awareness, and caution expected of that specialist. This is a communication standard, not a claim that the AI is a licensed doctor or that a clinician reviewed the page.

Act as both a patient-facing medical translator and an evidence-preservation reviewer. Translate the meaning of the full sentence, not isolated English words. Do not act as a dictionary, invent a clinical interpretation, or silently edit the English evidence.

Before selecting a Chinese term, identify the source phrase's semantic role:

- describe a treatment's effect for patients with “疗效”“治疗效果” or the specific change observed;
- describe reported study findings with “研究结果” or the specific finding;
- reserve “结局指标” or “研究终点” for methodological references to what a study measured; and
- rewrite the sentence when a technically possible literal term would sound abstract, ambiguous, or unnatural to a patient.

For example, translate treatment-title `outcomes differ` as “不同疗效并不一致”, but translate methodological `outcome measures varied` as “各研究采用的结局指标不同”. Never apply one glossary term to every occurrence without checking its role in context.

## Load the source of truth

From the repository root, read:

1. `CHINESE_TRANSLATION_GUIDE.md` completely;
2. the relevant entry in `src/data/editions.json` and every English evidence file for that version;
3. the matching object in `src/i18n/zh-CN.ts`;
4. `src/i18n/ui.ts` and Chinese pages when UI wording is in scope; and
5. the translation rules in `EDITORIAL_POLICY.md` and `CONTRIBUTING.md`.

Treat `en-AU` as the sole evidence source. Do not add, remove, strengthen, or reinterpret a finding in Chinese. If the English evidence itself must change, stop the translation-only workflow and use the repository's human editorial process first.

## Rewrite in four passes

1. **Meaning:** Map each title, population, study design, finding, possible meaning, limitation, trial caution, and source label to its English counterpart. Preserve numbers, uncertainty, negation, comparison groups, and study/result distinctions.
2. **Natural Chinese:** Rewrite meaning rather than English syntax. Prefer short sentences and ordinary patient-facing wording. Apply the terminology and anti-patterns in `CHINESE_TRANSLATION_GUIDE.md`.
3. **Plain-language terms:** Find eponyms, rare-disease names, acronyms, genes, tests, procedures, and research-method terms that a non-clinician cannot infer. At first use, retain the searchable formal term and briefly explain what it is. For a disease label, explain only the type of condition and the onset or body area needed to understand the sentence. Preserve qualifiers such as “similar to”; never turn a phenotype into a diagnosis. Verify any added medical fact against an authoritative patient source when it is not already stated in the English summary.
4. **Consistency:** Scan navigation, metadata, banners, archive pages, accessibility labels, evidence cards, trial cards, and footer text. Use the same term for the same concept unless the context genuinely requires a different expression.

After each field—including headings, study titles, and source labels—apply a middle-school readability check:

- express one main idea per sentence and split stacked clauses;
- prefer familiar verbs and concrete descriptions over abstract nouns;
- explain an essential medical or research term immediately in ordinary words;
- preserve all numbers, comparison groups, uncertainty, negation, and evidence strength; and
- use a teach-back test: the reader should be able to say who was studied, what was compared, what was found, and what remains uncertain without rereading the sentence.

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

For treatment evidence, search “结局”“结果”“效果”和“疗效” and compare every occurrence with the English sentence. Reject a mechanical `outcome` → “结局” mapping when the phrase is communicating efficacy or a concrete patient effect.

Read every evidence field as a patient with middle-school education would. A medically accurate transliteration alone is not sufficient when the term still leaves the reader unable to understand the population, intervention, finding, or limitation. Search for unexplained research terms such as non-inferiority, single-arm, open-label, heterogeneity, umbrella review, network meta-analysis, prospective surveillance, and outcome measure, then explain or rewrite them without removing their meaning.

Report the changed translation revision, parity result, test result, and whether independent human language review was performed. Never describe an AI rewrite as completed human review. Publish only with the repository's required AI-assisted, independent-review, and indexing disclosures.
