import { getCollection, type CollectionEntry } from "astro:content"
import archiveNoticeRows from "../data/archive-notices.json"

export type EditionEntry = CollectionEntry<"editions">
export type EvidenceEntry = CollectionEntry<"evidence">
export type ArchiveNoticeData = {
  version: string
  type: "correction" | "retraction" | "safety" | "withdrawal"
  publishedOn: string
  message: string
  replacementVersion?: string
  sourceUrl?: string
}
export type NoticeEntry = { id: string; data: ArchiveNoticeData }

export type EditionBundle = {
  edition: EditionEntry
  evidence: EvidenceEntry[]
  notices: NoticeEntry[]
}

export async function getAllEditions(): Promise<EditionEntry[]> {
  const editions = await getCollection("editions")
  return editions.sort((a, b) => b.data.version.localeCompare(a.data.version, undefined, { numeric: true }))
}

export async function getCurrentEdition(): Promise<EditionEntry> {
  const editions = await getAllEditions()
  const current = editions.filter((entry) => entry.data.status === "current")

  if (current.length !== 1) {
    throw new Error(`Expected exactly one current edition, found ${current.length}`)
  }

  return current[0]
}

export async function getEditionBundle(version: string): Promise<EditionBundle> {
  const [editions, evidence] = await Promise.all([
    getAllEditions(),
    getCollection("evidence"),
  ])
  const notices: NoticeEntry[] = (archiveNoticeRows as ArchiveNoticeData[]).map((data, index) => ({
    id: `${data.version}-${data.type}-${index + 1}`,
    data,
  }))
  const edition = editions.find((entry) => entry.data.version === version)

  if (!edition) {
    throw new Error(`Unknown edition: ${version}`)
  }

  return {
    edition,
    evidence: evidence
      .filter((entry) => entry.data.edition === version)
      .sort((a, b) => a.data.order - b.data.order),
    notices: notices.filter((entry) => entry.data.version === version),
  }
}
