import { describe, expect, it } from "vitest"
import {
  formatDigest,
  normalisePubmedSummary,
  normaliseTrial,
  publicationPriority,
  retractionWarnings,
} from "../scripts/research-scan-lib.mjs"

describe("research discovery normalisation", () => {
  it("normalises PubMed summaries without copying abstracts", () => {
    const record = normalisePubmedSummary("123", {
      uid: "123",
      title: "A trial &amp; follow-up.",
      fulljournalname: "Example Journal",
      pubdate: "2026 Aug",
      pubtype: ["Randomized Controlled Trial"],
      lang: ["eng", "fre"],
      articleids: [{ idtype: "doi", value: "10.1/example" }],
    })

    expect(record).toMatchObject({
      pmid: "123",
      title: "A trial & follow-up.",
      doi: "10.1/example",
      languages: ["eng", "fre"],
    })
    expect(record).not.toHaveProperty("abstract")
    expect(publicationPriority(record)).toBe(2)
  })

  it("detects retraction-style publication types", () => {
    const warning = normalisePubmedSummary("9", { uid: "9", pubtype: ["Retracted Publication"] })
    expect(retractionWarnings([warning])).toEqual([warning])
  })

  it("normalises trial status and results", () => {
    const trial = normaliseTrial({
      hasResults: true,
      protocolSection: {
        identificationModule: { nctId: "NCT12345678", briefTitle: "Example study" },
        statusModule: { overallStatus: "COMPLETED", lastUpdatePostDateStruct: { date: "2026-07-01" } },
        designModule: { studyType: "INTERVENTIONAL", phases: ["PHASE2"], enrollmentInfo: { count: 42 } },
        eligibilityModule: { stdAges: ["CHILD", "ADULT"] },
      },
    })
    expect(trial).toMatchObject({
      nctId: "NCT12345678",
      status: "COMPLETED",
      hasResults: true,
      enrolment: 42,
      ages: ["CHILD", "ADULT"],
    })
  })

  it("produces an auditable issue checklist", () => {
    const digest = formatDigest({
      reviewMonth: "2026-08",
      windowDays: 45,
      currentVersion: "2026.08.0",
      nextReviewDue: "2026-09-01",
      newPublications: [],
      armPublications: [{
        pmid: "11",
        title: "Arm lymphoedema study",
        journal: "Example Journal",
        publicationDate: "2026 Aug",
        publicationTypes: ["Journal Article"],
        doi: null,
        url: "https://pubmed.ncbi.nlm.nih.gov/11/",
      }],
      trunkAbdomenPublications: [{
        pmid: "12",
        title: "Truncal lymphoedema study",
        journal: "Example Journal",
        publicationDate: "2026 Aug",
        publicationTypes: ["Journal Article"],
        doi: null,
        url: "https://pubmed.ncbi.nlm.nih.gov/12/",
      }],
      childrenPublications: [{
        pmid: "15",
        title: "Paediatric lymphoedema cohort",
        journal: "Example Journal",
        publicationDate: "2026 Aug",
        publicationTypes: ["Journal Article"],
        doi: null,
        url: "https://pubmed.ncbi.nlm.nih.gov/15/",
      }],
      frenchPublications: [{
        pmid: "13",
        title: "French-language lymphoedema study",
        journal: "Example Journal",
        publicationDate: "2026 Aug",
        publicationTypes: ["Journal Article"],
        doi: null,
        url: "https://pubmed.ncbi.nlm.nih.gov/13/",
      }],
      germanPublications: [{
        pmid: "14",
        title: "German-language lymphoedema study",
        journal: "Example Journal",
        publicationDate: "2026 Aug",
        publicationTypes: ["Journal Article"],
        doi: null,
        url: "https://pubmed.ncbi.nlm.nih.gov/14/",
      }],
      chinesePublications: [],
      japanesePublications: [],
      trackedWarnings: [],
      changedTrials: [],
      newTrials: [],
      childrenTrials: [{
        nctId: "NCT87654321",
        title: "Lymphoedema study for children and adolescents",
        status: "RECRUITING",
        lastUpdated: "2026-08-01",
        hasResults: false,
        url: "https://clinicaltrials.gov/study/NCT87654321",
      }],
      deferredCandidates: [{
        id: "PMID 999",
        title: "Deferred lymphoedema study",
        url: "https://pubmed.ncbi.nlm.nih.gov/999/",
        reason: "Relevant, but it overlaps the evidence already summarised.",
        revisitWhen: "Reassess during the next exercise evidence update.",
      }],
      clinicalTrialsTimestamp: "2026-08-01T00:00:00Z",
    })
    expect(digest).toContain("Discovery only")
    expect(digest).toContain("Do not include personal medical information")
    expect(digest).toContain("No new PubMed candidates")
    expect(digest).toContain("Body-area watchlists")
    expect(digest).toContain("Arm and upper limb")
    expect(digest).toContain("Arm lymphoedema study")
    expect(digest).toContain("Trunk, chest and abdomen")
    expect(digest).toContain("Truncal lymphoedema study")
    expect(digest).toContain("## Children and adolescents")
    expect(digest).toContain("### PubMed candidates")
    expect(digest).toContain("### Trial records")
    expect(digest).not.toContain("## Population watchlists")
    expect(digest).not.toContain("## Cancer")
    expect(digest).toContain("Paediatric lymphoedema cohort")
    expect(digest).toContain("NCT87654321")
    expect(digest).toContain("Deferred candidates")
    expect(digest).toContain("Deferred lymphoedema study")
    expect(digest).toContain("Relevant, but it overlaps the evidence already summarised.")
    expect(digest).toContain("Reassess during the next exercise evidence update.")
    expect(digest).toContain("Deferred does not mean ineffective")
    expect(digest).toContain("Publication-language watchlists")
    expect(digest).toContain("French-language lymphoedema study")
    expect(digest).toContain("German-language lymphoedema study")
    expect(digest).toContain("No new PubMed-indexed Chinese-language candidates")
    expect(digest).toContain("No new PubMed-indexed Japanese-language candidates")
    expect(digest).toContain("external truncal or abdominal-wall lymphoedema")
    expect(digest).toContain("Do not extrapolate adult-only evidence to children")
    expect(digest).toContain("Supplementary Chinese-language discovery (manual)")
    expect(digest).toContain("promote an accepted finding into the global English record")
  })
})
