# Contributing

Corrections, source suggestions, accessibility improvements, and implementation fixes are welcome.

## Medical-content changes

- Link to the PubMed, DOI, guideline, or trial-registry record.
- Describe the relevant population and study design.
- Include the main limitation and avoid causal language the study does not support.
- Do not paste journal abstracts, figures, tables, or paywalled text.
- Do not include personal medical histories or request treatment recommendations.
- Do not advance the edition review date until the full monthly checklist has been completed.

Content contributions are reviewed editorially before publication. A pull request is not evidence of clinical endorsement.

## Translation changes

- Translate from the current global English edition; do not create a locale-specific evidence list.
- Preserve all direct publication and registry URLs.
- Keep the population, design, finding, possible meaning, and limitation structurally aligned.
- Mark AI-assisted text as unreviewed until a named human language-review step is completed.
- Increment `translationRevision` for translation-only corrections. Use a new global edition when the underlying evidence meaning changes.
- Run the translation coverage tests through `pnpm check`.

## Code changes

Keep the generated site static and accessible. Avoid analytics, trackers, unnecessary client JavaScript, and dependencies without a clear maintenance benefit.

Before opening a pull request, run:

```sh
pnpm check
```
