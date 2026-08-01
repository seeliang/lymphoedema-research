import type { EditionBundle, EditionEntry, EvidenceEntry, NoticeEntry } from "./content"
import { getZhCNTranslation, hasZhCNTranslation } from "../i18n/zh-CN"

export type SiteLocale = "en-AU" | "zh-CN"

type LocalizedEvidenceData = Omit<EvidenceEntry["data"], "area" | "evidenceLevel"> & {
  area: string
  evidenceLevel: string
}

export type LocalizedEditionBundle = {
  locale: SiteLocale
  edition: { id: string; data: EditionEntry["data"] }
  evidence: Array<{ id: string; data: LocalizedEvidenceData }>
  notices: NoticeEntry[]
  translation: null | {
    status: "ai-assisted" | "human-reviewed"
    revision: number
    translatedOn: string
    sourceLocale: "en-AU"
    languageReview?: {
      status: "not-reviewed" | "approved"
      reviewerName?: string
      reviewerRole?: string
      reviewedOn?: string
    }
  }
}

export function localizeEditionBundle(bundle: EditionBundle, locale: SiteLocale): LocalizedEditionBundle {
  if (locale === "en-AU") {
    return {
      locale,
      edition: { id: bundle.edition.id, data: bundle.edition.data },
      evidence: bundle.evidence.map((entry) => ({ id: entry.id, data: entry.data })),
      notices: bundle.notices,
      translation: null,
    }
  }

  const translated = getZhCNTranslation(bundle.edition.data.version)
  const evidenceIds = new Set(bundle.evidence.map((entry) => evidenceSlug(entry.id)))
  const translatedEvidenceIds = Object.keys(translated.evidence)
  const trialIds = new Set(bundle.edition.data.trials.map((trial) => trial.nctId))
  const translatedTrialIds = Object.keys(translated.trials)
  const deferredIds = new Set(bundle.edition.data.deferredCandidates?.map((candidate) => candidate.id) ?? [])
  const translatedDeferredIds = Object.keys(translated.deferredCandidates ?? {})

  assertMatchingIds(evidenceIds, translatedEvidenceIds, "evidence", bundle.edition.data.version)
  assertMatchingIds(trialIds, translatedTrialIds, "trial", bundle.edition.data.version)
  assertMatchingIds(deferredIds, translatedDeferredIds, "deferred candidate", bundle.edition.data.version)
  if (bundle.edition.data.childrenFocus && !translated.childrenFocus) {
    throw new Error(`Chinese children-focus copy is missing for ${bundle.edition.data.version}`)
  }
  if (bundle.edition.data.childrenSection && !translated.childrenSection) {
    throw new Error(`Chinese children-section copy is missing for ${bundle.edition.data.version}`)
  }
  if (bundle.edition.data.evidenceOverview && !translated.evidenceOverview) {
    throw new Error(`Chinese evidence-overview copy is missing for ${bundle.edition.data.version}`)
  }
  if (bundle.edition.data.sectionContexts && !translated.sectionContexts) {
    throw new Error(`Chinese section-context copy is missing for ${bundle.edition.data.version}`)
  }

  const evidenceOverview = bundle.edition.data.evidenceOverview && translated.evidenceOverview
    ? {
        items: bundle.edition.data.evidenceOverview.items.map((item) => {
          const translatedItem = translated.evidenceOverview?.[item.id]
          if (!translatedItem) throw new Error(`Chinese evidence-overview item is missing: ${item.id}`)
          if (translatedItem.sourceLabels.length !== item.sources.length) {
            throw new Error(`Chinese evidence-overview source-label count does not match ${item.id}`)
          }
          return {
            ...item,
            title: translatedItem.title,
            summary: translatedItem.summary,
            sources: item.sources.map((source, index) => ({ ...source, label: translatedItem.sourceLabels[index] })),
          }
        }),
      }
    : undefined

  const sectionContexts = bundle.edition.data.sectionContexts && translated.sectionContexts
    ? {
        treatmentManagement: localizeSectionContext(
          bundle.edition.data.sectionContexts.treatmentManagement,
          translated.sectionContexts.treatmentManagement,
          "treatment and management",
        ),
        medicines: localizeSectionContext(
          bundle.edition.data.sectionContexts.medicines,
          translated.sectionContexts.medicines,
          "medicines",
        ),
      }
    : undefined

  const evidence = bundle.evidence.map((entry) => {
    const item = translated.evidence[evidenceSlug(entry.id)]
    if (item.sourceLabels.length !== entry.data.sources.length) {
      throw new Error(`Chinese source-label count does not match ${entry.id}`)
    }
    return {
      id: entry.id,
      data: {
        ...entry.data,
        area: item.area,
        title: item.title,
        population: item.population,
        studyDesign: item.studyDesign,
        evidenceLevel: item.evidenceLevel,
        takeaway: item.takeaway,
        meaning: item.meaning,
        limitation: item.limitation,
        sources: entry.data.sources.map((source, index) => ({ ...source, label: item.sourceLabels[index] })),
      },
    }
  })

  return {
    locale,
    edition: {
      id: bundle.edition.id,
      data: {
        ...bundle.edition.data,
        title: translated.title,
        summary: translated.summary,
        changes: translated.changes,
        childrenFocus: bundle.edition.data.childrenFocus && translated.childrenFocus
          ? { ...bundle.edition.data.childrenFocus, summary: translated.childrenFocus.summary }
          : undefined,
        childrenSection: bundle.edition.data.childrenSection && translated.childrenSection
          ? { ...bundle.edition.data.childrenSection, summary: translated.childrenSection.summary }
          : undefined,
        deferredCandidates: bundle.edition.data.deferredCandidates?.map((candidate) => ({
          ...candidate,
          ...translated.deferredCandidates?.[candidate.id],
        })),
        evidenceOverview,
        sectionContexts,
        clinicalReview: bundle.edition.data.clinicalReview
          ? { ...bundle.edition.data.clinicalReview, scope: translated.clinicalReview?.scope ?? bundle.edition.data.clinicalReview.scope }
          : undefined,
        trials: bundle.edition.data.trials.map((trial) => ({ ...trial, ...translated.trials[trial.nctId] })),
      },
    },
    evidence,
    notices: bundle.notices.map((notice) => ({
      ...notice,
      data: { ...notice.data, message: notice.data.messageZhCN ?? notice.data.message },
    })),
    translation: {
      status: translated.translationStatus,
      revision: translated.translationRevision,
      translatedOn: translated.translatedOn,
      sourceLocale: translated.sourceLocale,
      languageReview: translated.languageReview,
    },
  }
}

function localizeSectionContext<T extends { intro: string; sources: Array<Record<string, unknown> & { label: string }> }>(
  source: T,
  translated: { intro: string; sourceLabels: string[] },
  section: string,
): T {
  if (translated.sourceLabels.length !== source.sources.length) {
    throw new Error(`Chinese source-label count does not match the ${section} context`)
  }
  return {
    ...source,
    intro: translated.intro,
    sources: source.sources.map((item, index) => ({ ...item, label: translated.sourceLabels[index] })),
  }
}

export { getZhCNTranslation, hasZhCNTranslation }

function evidenceSlug(id: string): string {
  return id.split("/").at(-1) ?? id
}

function assertMatchingIds(expected: Set<string>, translated: string[], kind: string, version: string): void {
  const missing = [...expected].filter((id) => !translated.includes(id))
  const extra = translated.filter((id) => !expected.has(id))
  if (missing.length || extra.length) {
    throw new Error(`Chinese ${kind} coverage mismatch for ${version}; missing: ${missing.join(", ") || "none"}; extra: ${extra.join(", ") || "none"}`)
  }
}
