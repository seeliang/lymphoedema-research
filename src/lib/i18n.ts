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
        deferredCandidates: bundle.edition.data.deferredCandidates?.map((candidate) => ({
          ...candidate,
          ...translated.deferredCandidates?.[candidate.id],
        })),
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
    },
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
