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
    expect(zhCNUI.evidenceFirst.navigation.whatWorks).toBe("有效方法")
    expect(zhCNUI.evidenceFirst.heroButton).toBe("先看有效方法")
    expect(zhCNUI.evidenceFirst.navigation.medicines).toBe("药物")
    expect(zhCNUI.evidenceFirst.overview.references).toBe("直接查看依据")
    expect(zhCNUI.evidenceFirst.review.languageNotReviewed).toContain("未经独立人工语言审校")
  })

  it("uses patient-facing efficacy language for treatment outcomes in 8.5", () => {
    const translation = zhCNEditionTranslations["2026.08.5"]

    expect(translation.translationRevision).toBe(3)
    expect(translation.evidence["compression-self-management"].title).toBe("更灵活的加压和指导方式，可能让日常护理更容易")
    expect(translation.evidence["compression-self-management"].title).not.toContain("日常管理")
    expect(translation.evidence.microsurgery.title).toBe("显微手术可能减少蜂窝织炎，但不同疗效并不一致")
    expect(translation.evidence.microsurgery.title).not.toContain("结局")
    expect(translation.evidence["resistance-training"].takeaway).toContain("肢体状况也有所改善")
    expect(translation.evidence["resistance-training"].takeaway).not.toContain("肢体结局")
  })

  it("explains specialist research language for readers with a middle-school education in 8.5", () => {
    const translation = zhCNEditionTranslations["2026.08.5"]
    const chineseCopy = JSON.stringify(translation)

    expect(translation.evidence["compression-self-management"].studyDesign).toContain("看前者减小小腿体积的效果是否不比后者差")
    expect(translation.evidence.microsurgery.studyDesign).toContain("汇总了多篇系统综述")
    expect(translation.evidence.microsurgery.studyDesign).toContain("用显微手术把淋巴管接到小静脉")
    expect(translation.evidence.microsurgery.takeaway).toContain("蜂窝织炎（一种皮肤感染）")
    expect(translation.evidence.microsurgery.limitation).toContain("评估疗效的指标")
    expect(translation.evidence["primary-biology"].takeaway).toContain("淋巴系统细胞之间传递信息的方式")
    expect(translation.evidenceOverview?.["established-foundations"].summary).toContain("把多种护理方法组合使用")
    expect(translation.trials.NCT07012642.design).toContain("这种药物用于淋巴水肿患者的初步研究")
    expect(translation.trials.NCT07012642.design).toContain("所有参加者都知道自己接受了什么治疗")
    expect(translation.trials.NCT07012642.design).toContain("没有设置对照组")
    expect(chineseCopy).not.toContain("非劣效性")
    expect(chineseCopy).not.toContain("前瞻性单组")
    expect(chineseCopy).not.toContain("伞状综述")
    expect(chineseCopy).not.toContain("异质性")
    expect(chineseCopy).not.toContain("开放标签")
    expect(chineseCopy).not.toContain("单组干预")
    expect(chineseCopy).not.toContain("证据网络连通性")
    expect(chineseCopy).not.toContain("伞状")
    expect(chineseCopy).not.toContain("网状荟萃")
    expect(chineseCopy).not.toContain("前瞻性监测")
    expect(chineseCopy).not.toContain("血管通透性")
    expect(chineseCopy).not.toContain("淋巴信号")
  })

  it("keeps the responsibility notice qualified in both languages", () => {
    expect(zhCNUI.disclaimer.responsibilityBody).toContain("在法律允许的范围内")
    expect(zhCNUI.disclaimer.responsibilityBody).toContain("不能排除的权利或责任")
    expect(zhCNUI.disclaimer.responsibilityBody).not.toContain("免除全部责任")
  })
})
