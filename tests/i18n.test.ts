import { describe, expect, it } from "vitest"
import editions from "../src/data/editions.json"
import { zhCNEditionTranslations } from "../src/i18n/zh-CN"

const evidencePaths = Object.keys(import.meta.glob("../src/data/evidence/**/*.md", { query: "?raw", import: "default" }))

describe("Simplified Chinese translation coverage", () => {
  for (const [version, translation] of Object.entries(zhCNEditionTranslations)) {
    it(`matches every global evidence item and trial in ${version}`, () => {
      const evidenceIds = evidencePaths
        .filter((filePath) => filePath.includes(`/evidence/${version}/`))
        .map((filePath) => filePath.split("/").at(-1)?.replace(/\.md$/, ""))
        .filter((name): name is string => Boolean(name))
        .sort()
      const edition = editions.find((entry) => entry.version === version)

      expect(edition).toBeDefined()
      expect(Object.keys(translation.evidence).sort()).toEqual(evidenceIds)
      expect(Object.keys(translation.trials).sort()).toEqual(edition?.trials.map((trial) => trial.nctId).sort())
      expect(translation.sourceLocale).toBe("en-AU")
      expect(translation.locale).toBe("zh-CN")
      expect(translation.translationRevision).toBeGreaterThanOrEqual(0)
    })
  }

  it("does not claim independent human review for the initial translation", () => {
    expect(zhCNEditionTranslations["2026.08.0"].translationStatus).toBe("ai-assisted")
  })
})
