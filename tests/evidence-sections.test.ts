import { describe, expect, it } from "vitest"
import { partitionEvidenceSections } from "../src/lib/evidence-sections"

describe("evidence section partitioning", () => {
  it("keeps unfamiliar and unlabelled research visible in the fallback section", () => {
    const unfamiliar = { id: "quality-of-life", data: { section: "quality-of-life", area: "School participation" } }
    const unlabelled = { id: "health-economics", data: { area: "Health economics" } }
    const groups = partitionEvidenceSections([unfamiliar, unlabelled])

    expect(groups.otherResearch).toEqual([unfamiliar, unlabelled])
  })

  it("allows child-specific evidence from any research area", () => {
    const childEvidence = {
      id: "paediatric-quality-of-life",
      data: { section: "children-adolescents", area: "Education and quality of life" },
    }

    expect(partitionEvidenceSections([childEvidence]).children).toEqual([childEvidence])
  })
})
