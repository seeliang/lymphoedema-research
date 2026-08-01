# Repository instructions for GitHub Copilot

This repository publishes a versioned, plain-language lymphoedema research brief for patients and carers. Medical-content accuracy, limitations, provenance, privacy, and an explicit human editorial decision take priority over speed.

Read `EDITORIAL_POLICY.md`, `CORRECTIONS.md`, `CONTRIBUTING.md`, and `README.md` before changing content. Use Australian English. Never provide personalised medical advice, cure claims, medicine doses, or instructions to start, stop, or change care.

Automation and AI may discover, organise, compare, and draft. They may not claim that content was source-reviewed, advance `reviewedOn` or `nextReviewDue`, merge a content pull request, publish an edition, or create a release. A human editor must do those steps after checking every changed statement against its cited source.

For evidence changes:

- Work from primary publication, guideline, PubMed, DOI, and registry links. Do not treat search snippets or generated summaries as sources.
- Do not copy abstracts, tables, figures, or paywalled text.
- State the studied population and design, distinguish findings from interpretation, and keep an important limitation visible.
- Keep trials without posted results in `src/data/editions.json`; registration is not evidence that an intervention works.
- Do not infer efficacy from a trial's title, status, enrolment, phase, sponsor, or planned outcomes.
- Preserve existing edition directories and historical wording. Corrections use a new patch edition and an archive notice.
- Record uncertainty explicitly and omit a candidate when its source cannot be checked adequately.

For implementation changes, keep the site static, accessible, tracker-free, and light on dependencies. Run `pnpm check` before reporting completion. Treat a successful build as technical validation only, not editorial or clinical approval.
