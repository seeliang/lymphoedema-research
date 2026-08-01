import { describe, expect, it } from "vitest"
import editions from "../src/data/editions.json"
import { zhCNEditionTranslations } from "../src/i18n/zh-CN"
import { zhCNUI } from "../src/i18n/ui"

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

      if (edition?.evidenceOverview) {
        expect(Object.keys(translation.evidenceOverview ?? {})).toEqual(edition.evidenceOverview.items.map((item) => item.id))
        for (const item of edition.evidenceOverview.items) {
          expect(translation.evidenceOverview?.[item.id]?.sourceLabels).toHaveLength(item.sources.length)
        }
        expect(translation.sectionContexts?.treatmentManagement.sourceLabels).toHaveLength(edition.sectionContexts?.treatmentManagement.sources.length)
        expect(translation.sectionContexts?.medicines.sourceLabels).toHaveLength(edition.sectionContexts?.medicines.sources.length)
      }
    })
  }

  it("records the rewritten translation as AI-assisted revision 1", () => {
    expect(zhCNEditionTranslations["2026.08.0"].translationStatus).toBe("ai-assisted")
    expect(zhCNEditionTranslations["2026.08.0"].translationRevision).toBe(1)
  })

  it("uses patient-facing Chinese instead of known literal phrasing", () => {
    const chineseCopy = JSON.stringify({ ui: zhCNUI, editions: zhCNEditionTranslations })

    expect(zhCNUI.hero.title).toBe("近期淋巴水肿研究说了什么")
    expect(chineseCopy).not.toContain("被分配进行")
    expect(chineseCopy).not.toContain("更易管理")
    expect(chineseCopy).not.toContain("英文原版状态")
  })

  it("explains Milroy disease for non-clinical readers and carries it into later editions", () => {
    const translation = zhCNEditionTranslations["2026.08.3"]
    const population = translation.evidence["primary-biology"].population

    expect(translation.translationStatus).toBe("ai-assisted")
    expect(translation.translationRevision).toBe(1)
    expect(population).toContain("一些症状类似 Milroy 病的人")
    expect(population).toContain("遗传性淋巴水肿")
    expect(population).toContain("出生时或婴儿期")
    expect(population).toContain("小腿和足部")
    expect(zhCNEditionTranslations["2026.08.4"].evidence["primary-biology"].population).toBe(population)
    expect(zhCNEditionTranslations["2026.08.5"].evidence["primary-biology"].population).toBe(population)
  })

  it("uses research-first navigation and evidence-status language in the 8.5 Chinese UI", () => {
    expect(zhCNUI.evidenceFirst.navigation.whatWorks).toBe("哪些方法有效")
    expect(zhCNUI.evidenceFirst.navigation.medicines).toBe("药物")
    expect(zhCNUI.evidenceFirst.overview.references).toBe("直接查看依据")
    expect(zhCNUI.evidenceFirst.review.languageNotReviewed).toContain("未经独立人工语言审校")
  })

  it("keeps the responsibility notice qualified in both languages", () => {
    expect(zhCNUI.disclaimer.responsibilityBody).toContain("在法律允许的范围内")
    expect(zhCNUI.disclaimer.responsibilityBody).toContain("不能排除的权利或责任")
    expect(zhCNUI.disclaimer.responsibilityBody).not.toContain("免除全部责任")
  })
})
