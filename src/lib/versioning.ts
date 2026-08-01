export const EDITION_VERSION_PATTERN = /^(\d{4})\.(\d{2})\.(\d+)$/

export type ParsedEditionVersion = {
  year: number
  month: number
  patch: number
}

export function parseEditionVersion(version: string): ParsedEditionVersion {
  const match = EDITION_VERSION_PATTERN.exec(version)
  if (!match) throw new Error(`Invalid edition version: ${version}`)

  const parsed = {
    year: Number(match[1]),
    month: Number(match[2]),
    patch: Number(match[3]),
  }

  if (parsed.month < 1 || parsed.month > 12) {
    throw new Error(`Invalid edition month: ${version}`)
  }

  return parsed
}

export function compareEditionVersions(left: string, right: string): number {
  const a = parseEditionVersion(left)
  const b = parseEditionVersion(right)
  return a.year - b.year || a.month - b.month || a.patch - b.patch
}

export function isPatchEdition(version: string): boolean {
  return parseEditionVersion(version).patch > 0
}

export function editionTag(version: string): string {
  parseEditionVersion(version)
  return `research-${version}`
}
