# Lymphoedema Research Brief

A versioned, plain-language evidence brief for people living with lymphoedema and those who support them.

The project publishes dated research snapshots, explains important limitations, and keeps trials without results separate from published findings. It is an independent public-interest project from Crosspathing Studio.

## Important

This project provides general information, not diagnosis or treatment advice. Its summaries are checked against cited sources but are not a substitute for a clinician who knows your circumstances. The first edition is source-reviewed and is not clinician-reviewed.

## Editions

Research editions use calendar versioning:

- `YYYY.MM.0` for the scheduled monthly review;
- `YYYY.MM.1`, `.2`, and so on for corrections or material research-reporting updates published within that edition month;
- an independent integer `schemaVersion` for the content format.

The current edition appears at the site root. Immutable snapshots remain browsable under `/versions/<edition>/`. Later corrections are attached as notices instead of silently rewriting what an old edition said.

## Languages and source hierarchy

The global English edition (`en-AU`) is the primary research record. It selects evidence from international journals, consensus documents, PubMed, and ClinicalTrials.gov without limiting discovery to one country or language.

Simplified Chinese (`zh-CN`) is a secondary translation layer under `/zh-cn/`. It must translate the same edition, evidence items, trial records, limitations, and source links one-to-one; it cannot maintain a separate public research selection.

Chinese-language databases are also checked as a supplementary discovery channel. An outstanding finding that is missing from the automated global scan must pass the same evidence threshold and be promoted into the global English record first, with the original Chinese source cited directly. The Chinese page then translates that same global entry. See [SUPPLEMENTARY_CHINESE_DISCOVERY.md](./SUPPLEMENTARY_CHINESE_DISCOVERY.md) for sources, thresholds, and the audit trail.

Each translation records a translation status, date, and independent revision number. AI-assisted translations remain visibly labelled and `noindex` until an independent human language review is recorded. A translation-only correction increments `translationRevision`; a change to the underlying global evidence creates a new calendar or patch edition.

Simplified Chinese should read as natural patient-facing Chinese rather than follow English syntax word for word. Terminology, tone, and the review checklist are documented in [CHINESE_TRANSLATION_GUIDE.md](./CHINESE_TRANSLATION_GUIDE.md).

Repository-aware agents can invoke the bundled `$translate-lymphoedema-zh` skill in `.codex/skills/translate-lymphoedema-zh/` to apply that workflow and run deterministic English-Chinese parity checks.

For an edition release, invoke `$publish-lymphoedema-edition` from `.codex/skills/publish-lymphoedema-edition/`. It treats the requested public hierarchy as a rendered-output contract, preserves old snapshots, and requires the built English and Chinese pages—not only source data or scanner reports—to pass before publication.

## Local development

```sh
pnpm install
pnpm dev
```

Run the complete validation suite with:

```sh
pnpm check
```

## Monthly research review

On the first day of each month, a scheduled workflow searches a 45-day overlap in PubMed and ClinicalTrials.gov, rechecks tracked identifiers, and opens a review issue. Children and adolescents are a main report section covering both new PubMed candidates and newly updated trial records. Cancer is not a report section, although cancer-related evidence remains eligible when it is relevant to lymphoedema. The report also includes watchlists for arm/upper-limb and trunk/chest/abdominal-wall research, plus French-, German-, Chinese-, and Japanese-language PubMed candidates. A durable deferred-candidates section records relevant evidence that is waiting for a specific appraisal or revisit trigger. These focused sections, watchlists, and deferrals do not create separate evidence feeds or lower the editorial threshold. Automation discovers candidates only; it never writes or publishes medical summaries.

To run the scanner locally:

```sh
pnpm research:scan
```

Set the optional `NCBI_EMAIL` environment variable to give NCBI a contact address for automated requests. The repository does not publish or require a personal email address.

Optional environment variables:

- `NCBI_EMAIL` — contact address sent to NCBI E-utilities.
- `RESEARCH_SCAN_DAYS` — overlap window, default `45`.

## Optional Copilot-assisted drafting

GitHub Copilot may prepare a candidate draft after the scheduled discovery issue has been reviewed. The repository includes persistent guardrails in `.github/copilot-instructions.md`, a manually selected `research-editor` custom agent in `.github/agents/research-editor.agent.md`, and a non-published `drafts/` staging area.

From GitHub Copilot CLI, start an interactive, permission-gated session from the repository root:

```sh
copilot --agent research-editor
```

Then ask it to triage a specific monthly issue and prepare a draft update. Alternatively, select the `research-editor` agent when assigning that issue to Copilot on GitHub; Copilot can open a pull request for human review.

Copilot must not modify published edition data, merge, publish, set review dates, or mark its own wording as source-reviewed. A human editor checks every changed claim and source, promotes approved wording from `drafts/`, supplies the review dates, runs `pnpm check`, merges the pull request, and triggers the edition release.

## Licensing

Code is available under the [MIT licence](./LICENSE). Original editorial content is available under [CC BY 4.0](./CONTENT_LICENSE.md), with the exclusions described there.

## Corrections and contributions

Read [EDITORIAL_POLICY.md](./EDITORIAL_POLICY.md), [CORRECTIONS.md](./CORRECTIONS.md), and [CONTRIBUTING.md](./CONTRIBUTING.md) before proposing a content change.
