import { describe, expect, it } from "vitest"
import editions from "../src/data/editions.json"
import { zhCNEditionTranslations } from "../src/i18n/zh-CN"

type PublicReportEdition = {
  version: string
  status: string
  schemaVersion: number
  childrenSection?: {
    publicationCandidates: number
    trialRecords: number
    summary: string
    reviewUrl: string
  }
  deferredCandidates?: Array<{
    id: string
    title: string
    url: string
    reason: string
    revisitWhen: string
  }>
}

describe("public edition structure", () => {
  it("promotes evidence-first edition 2026.08.5 while retaining the children empty state", () => {
    const current = editions.find((edition) => edition.status === "current") as PublicReportEdition | undefined

    expect(current?.version).toBe("2026.08.5")
    expect(current?.schemaVersion).toBe(5)
    expect(current?.childrenSection).toMatchObject({ publicationCandidates: 5, trialRecords: 3 })
    expect(current?.childrenSection?.summary).toContain("None has completed")
    expect(current?.deferredCandidates).toHaveLength(3)
    expect(editions.find((edition) => edition.version === "2026.08.4")?.status).toBe("superseded")
  })

  it("requires matching Chinese copy for every new public section", () => {
    const translation = zhCNEditionTranslations["2026.08.4"]

    expect(translation.childrenSection?.summary).toContain("尚未完成")
    expect(Object.keys(translation.deferredCandidates ?? {})).toEqual([
      "PMID 40081785",
      "PMID 41886031",
      "PMID 42294341",
    ])
  })

  it("publishes edition 2026.08.5 with a transparent non-review status", () => {
    const edition = editions.find((entry) => entry.version === "2026.08.5")

    expect(edition?.status).toBe("current")
    expect(edition?.schemaVersion).toBe(5)
    expect(edition?.title).toBe("Lymphoedema research: what works and what is still uncertain")
    expect(edition?.evidenceOverview?.items).toHaveLength(3)
    expect(edition?.evidenceOverview?.items.every((item) => item.sources.length > 0)).toBe(true)
    expect(edition?.sectionContexts?.treatmentManagement.sources.length).toBeGreaterThanOrEqual(3)
    expect(edition?.sectionContexts?.medicines.intro).toContain("No medicine is established as routine treatment")
    expect(edition?.clinicalReview).toMatchObject({ status: "not-reviewed" })
    expect(edition?.childrenSection).toMatchObject({ publicationCandidates: 5, trialRecords: 3 })
    expect(edition?.trials.map((trial) => [trial.nctId, "section" in trial ? trial.section : undefined])).toEqual([
      ["NCT05890677", "treatment-management"],
      ["NCT07012642", "medicines"],
    ])
  })

  it("publishes the 8.5 Chinese edition as AI-assisted and not independently reviewed", () => {
    const translation = zhCNEditionTranslations["2026.08.5"]

    expect(translation.title).toBe("淋巴水肿研究：有效方法与有待确认的研究")
    expect(translation.translationStatus).toBe("ai-assisted")
    expect(translation.languageReview).toEqual({ status: "not-reviewed" })
    expect(Object.keys(translation.evidenceOverview ?? {})).toEqual([
      "established-foundations",
      "selected-options",
      "evidence-strength",
    ])
    expect(translation.sectionContexts?.medicines.intro).toContain("目前没有药物被确立")
  })
})
