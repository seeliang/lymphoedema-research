import { describe, expect, it } from "vitest"
import editions from "../src/data/editions.json"
import { zhCNEditionTranslations } from "../src/i18n/zh-CN"

type PublicReportEdition = {
  version: string
  status: string
  schemaVersion: number
  childrenFocus?: {
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
  it("makes children the visible primary focus in edition 2026.08.3", () => {
    const current = editions.find((edition) => edition.status === "current") as PublicReportEdition | undefined

    expect(current?.version).toBe("2026.08.3")
    expect(current?.schemaVersion).toBe(2)
    expect(current?.childrenFocus).toMatchObject({ publicationCandidates: 5, trialRecords: 3 })
    expect(current?.childrenFocus?.summary).toContain("None has completed")
    expect(current?.deferredCandidates).toHaveLength(3)
  })

  it("requires matching Chinese copy for every new public section", () => {
    const translation = zhCNEditionTranslations["2026.08.3"]

    expect(translation.childrenFocus?.summary).toContain("尚未完成")
    expect(Object.keys(translation.deferredCandidates ?? {})).toEqual([
      "PMID 40081785",
      "PMID 41886031",
      "PMID 42294341",
    ])
  })
})
