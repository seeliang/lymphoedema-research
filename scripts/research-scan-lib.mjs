const RETRACTION_TERMS = ["retracted publication", "retraction of publication", "expression of concern"]

export function normalisePubmedSummary(uid, raw = {}) {
  const articleIds = Array.isArray(raw.articleids) ? raw.articleids : []
  const doi = articleIds.find((item) => item?.idtype === "doi")?.value ?? null
  const publicationTypes = Array.isArray(raw.pubtype) ? raw.pubtype.map(String) : []

  return {
    pmid: String(raw.uid ?? uid),
    title: cleanText(raw.title ?? "Untitled record"),
    journal: cleanText(raw.fulljournalname ?? raw.source ?? "Journal not listed"),
    publicationDate: String(raw.pubdate ?? raw.epubdate ?? "Date not listed"),
    publicationTypes,
    doi,
    url: `https://pubmed.ncbi.nlm.nih.gov/${raw.uid ?? uid}/`,
  }
}

export function normaliseTrial(study = {}) {
  const protocol = study.protocolSection ?? {}
  const identification = protocol.identificationModule ?? {}
  const status = protocol.statusModule ?? {}
  const design = protocol.designModule ?? {}
  const derived = study.derivedSection ?? {}

  const nctId = String(identification.nctId ?? "")
  return {
    nctId,
    title: cleanText(identification.briefTitle ?? identification.officialTitle ?? "Untitled trial"),
    status: String(status.overallStatus ?? "UNKNOWN"),
    lastUpdated: String(status.lastUpdatePostDateStruct?.date ?? ""),
    studyType: String(design.studyType ?? "UNKNOWN"),
    phases: Array.isArray(design.phases) ? design.phases.map(String) : [],
    enrolment: Number(design.enrollmentInfo?.count ?? 0),
    hasResults: Boolean(study.hasResults || study.resultsSection || derived.miscInfoModule?.versionHolder && study.resultsSection),
    url: nctId ? `https://clinicaltrials.gov/study/${nctId}` : "https://clinicaltrials.gov/",
  }
}

export function publicationPriority(record) {
  const types = record.publicationTypes.map((value) => value.toLowerCase())
  if (types.some((value) => value.includes("guideline") || value.includes("consensus"))) return 0
  if (types.some((value) => value.includes("meta-analysis") || value.includes("systematic review"))) return 1
  if (types.some((value) => value.includes("randomized") || value.includes("randomised"))) return 2
  if (types.some((value) => value.includes("clinical trial"))) return 3
  return 4
}

export function retractionWarnings(records) {
  return records.filter((record) => {
    const types = record.publicationTypes.join(" ").toLowerCase()
    return RETRACTION_TERMS.some((term) => types.includes(term))
  })
}

export function formatDigest({
  reviewMonth,
  windowDays,
  currentVersion,
  nextReviewDue,
  newPublications,
  armPublications,
  trunkAbdomenPublications,
  trackedWarnings,
  changedTrials,
  newTrials,
  clinicalTrialsTimestamp,
}) {
  const lines = [
    `# Monthly lymphoedema research review — ${reviewMonth}`,
    "",
    "> **Discovery only.** This report contains source metadata, not medical interpretation. A human must read and assess each source before changing the public brief.",
    "",
    `- Current public edition: \`${currentVersion}\``,
    `- Next review due: ${nextReviewDue}`,
    `- Discovery overlap: ${windowDays} days`,
    `- ClinicalTrials.gov dataset timestamp: ${clinicalTrialsTimestamp || "not reported"}`,
    "",
    "## Retraction, correction, or concern flags",
    "",
  ]

  appendRecordList(lines, trackedWarnings, "No retraction-style publication-type flags were returned for tracked PMIDs.")
  lines.push("", "## New PubMed candidates", "")
  appendRecordList(lines, [...newPublications].sort((a, b) => publicationPriority(a) - publicationPriority(b)), "No new PubMed candidates were found in the overlap window.")

  lines.push(
    "",
    "## Body-area watchlists",
    "",
    "These are focused subsets of the new PubMed candidates. They make location-specific evidence easier to find but do not replace full editorial assessment.",
    "",
    "### Arm and upper limb",
    "",
  )
  appendRecordList(lines, [...armPublications].sort((a, b) => publicationPriority(a) - publicationPriority(b)), "No new arm or upper-limb candidates were found in the overlap window.")
  lines.push("", "### Trunk, chest and abdomen", "")
  appendRecordList(lines, [...trunkAbdomenPublications].sort((a, b) => publicationPriority(a) - publicationPriority(b)), "No new trunk, chest, or abdominal-wall candidates were found in the overlap window.")

  lines.push("", "## Tracked trial changes", "")
  appendTrialList(lines, changedTrials, "No tracked trial metadata changed.")
  lines.push("", "## Newly updated trial records", "")
  appendTrialList(lines, newTrials, "No newly updated lymphoedema trial records were found.")

  lines.push(
    "",
    "## Supplementary Chinese-language discovery (manual)",
    "",
    "Chinese-language sources can surface important findings missing from the automated global scan. Complete and document these checks manually; do not scrape services without a supported interface.",
    "",
    "- [ ] Search [SinoMed](https://www.sinomed.ac.cn/main.jsp) with a 45-day or longer overlap.",
    "- [ ] Search [Wanfang Data journals](https://c.wanfangdata.com.cn/) for non-duplicate clinical evidence, guidelines, and safety signals.",
    "- [ ] Search [ChiCTR](https://www.chictr.org.cn/) for new or changed trial registrations; registration is not evidence of efficacy.",
    "- [ ] Record databases, concepts or queries, date searched, result counts when available, and include/exclude reasons.",
    "- [ ] Apply `SUPPLEMENTARY_CHINESE_DISCOVERY.md`: promote an accepted finding into the global English record before translating it into Chinese.",
  )

  lines.push(
    "",
    "## Editorial checklist",
    "",
    "- [ ] Confirm each candidate is about lymphoedema rather than a similarly named condition.",
    "- [ ] Read the full paper when available; verify population, design, outcomes, harms, funding, and conflicts.",
    "- [ ] Decide whether the result is patient-relevant and stronger than evidence already summarised.",
    "- [ ] For ‘stomach-area’ requests, confirm that the source concerns external truncal or abdominal-wall lymphoedema—not ascites, an internal-organ condition, or a lymphatic malformation.",
    "- [ ] Keep trials without results separate from published findings.",
    "- [ ] Update every affected takeaway and limitation together.",
    "- [ ] Record exclusions or a reviewed ‘no changes’ decision in this issue.",
    "- [ ] Create the next calendar edition, run `pnpm check`, and inspect the built version pages.",
    "- [ ] Publish the matching `research-YYYY.MM.PATCH` release, then close this issue.",
    "",
    "Do not include personal medical information in issue comments.",
  )

  return `${lines.join("\n")}\n`
}

function appendRecordList(lines, records, emptyMessage) {
  if (records.length === 0) {
    lines.push(emptyMessage)
    return
  }
  for (const record of records.slice(0, 60)) {
    const types = record.publicationTypes.length ? ` — ${record.publicationTypes.join(", ")}` : ""
    lines.push(`- [${escapeMarkdown(record.title)}](${record.url}) — ${escapeMarkdown(record.journal)}, ${escapeMarkdown(record.publicationDate)}; PMID ${record.pmid}${types}`)
  }
  if (records.length > 60) lines.push(`- …and ${records.length - 60} more records; narrow the search before review.`)
}

function appendTrialList(lines, trials, emptyMessage) {
  if (trials.length === 0) {
    lines.push(emptyMessage)
    return
  }
  for (const trial of trials.slice(0, 60)) {
    const results = trial.hasResults ? "results posted" : "no results posted"
    lines.push(`- [${trial.nctId}: ${escapeMarkdown(trial.title)}](${trial.url}) — ${trial.status}; updated ${trial.lastUpdated || "date not reported"}; ${results}`)
  }
}

function cleanText(value) {
  return String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
}

function escapeMarkdown(value) {
  return cleanText(value).replace(/([\[\]_*`])/g, "\\$1")
}
