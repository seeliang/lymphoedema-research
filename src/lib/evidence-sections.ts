export const knownEvidenceSectionIds = [
  "children-adolescents",
  "understanding-diagnosis",
  "treatment-management",
] as const

type SectionedEvidence = {
  data: Record<string, unknown> & {
    section?: string
  }
}

export function partitionEvidenceSections<T extends SectionedEvidence>(evidence: readonly T[]) {
  const knownSections = new Set<string>(knownEvidenceSectionIds)

  return {
    children: evidence.filter((entry) => entry.data.section === "children-adolescents"),
    understandingDiagnosis: evidence.filter((entry) => entry.data.section === "understanding-diagnosis"),
    treatmentManagement: evidence.filter((entry) => entry.data.section === "treatment-management"),
    otherResearch: evidence.filter((entry) => !entry.data.section || !knownSections.has(entry.data.section)),
  }
}
