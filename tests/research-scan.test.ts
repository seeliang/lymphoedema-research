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
      articleids: [{ idtype: "doi", value: "10.1/example" }],
    })

    expect(record).toMatchObject({
      pmid: "123",
      title: "A trial & follow-up.",
      doi: "10.1/example",
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
      },
    })
    expect(trial).toMatchObject({ nctId: "NCT12345678", status: "COMPLETED", hasResults: true, enrolment: 42 })
  })

  it("produces an auditable issue checklist", () => {
    const digest = formatDigest({
      reviewMonth: "2026-08",
      windowDays: 45,
      currentVersion: "2026.08.0",
      nextReviewDue: "2026-09-01",
      newPublications: [],
      trackedWarnings: [],
      changedTrials: [],
      newTrials: [],
      clinicalTrialsTimestamp: "2026-08-01T00:00:00Z",
    })
    expect(digest).toContain("Discovery only")
    expect(digest).toContain("Do not include personal medical information")
    expect(digest).toContain("No new PubMed candidates")
    expect(digest).toContain("Supplementary Chinese-language discovery (manual)")
    expect(digest).toContain("promote an accepted finding into the global English record")
  })
})
