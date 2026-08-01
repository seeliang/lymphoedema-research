import { readFile, readdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import {
  formatDigest,
  normalisePubmedSummary,
  normaliseTrial,
  retractionWarnings,
} from "./research-scan-lib.mjs"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const windowDays = positiveInteger(process.env.RESEARCH_SCAN_DAYS ?? "45", "RESEARCH_SCAN_DAYS")
const contactEmail = process.env.NCBI_EMAIL?.trim()
const toolName = "lymphoedema_research_brief"
const projectUrl = "https://github.com/seeliang/lymphoedema-research"
const editions = JSON.parse(await readFile(join(root, "src/data/editions.json"), "utf8"))
const currentEditions = editions.filter((edition) => edition.status === "current")

if (currentEditions.length !== 1) throw new Error(`Expected one current edition, found ${currentEditions.length}`)
const current = currentEditions[0]

const evidenceFiles = await walk(join(root, "src/data/evidence"))
const trackedPmids = new Set()
for (const file of evidenceFiles.filter((path) => path.endsWith(".md"))) {
  const source = await readFile(file, "utf8")
  for (const match of source.matchAll(/\bpmid:\s*["']?(\d+)["']?/g)) trackedPmids.add(match[1])
}

const pubmedQuery = '("Lymphedema"[MeSH Terms] OR lymphedema[Title/Abstract] OR lymphoedema[Title/Abstract])'
const armQuery = `${pubmedQuery} AND (arm[Title/Abstract] OR "upper limb"[Title/Abstract] OR "upper-limb"[Title/Abstract] OR "upper extremity"[Title/Abstract] OR "upper-extremity"[Title/Abstract])`
const trunkAbdomenQuery = `${pubmedQuery} AND (truncal[Title/Abstract] OR trunk[Title/Abstract] OR torso[Title/Abstract] OR abdominal[Title/Abstract] OR abdomen[Title/Abstract] OR "abdominal wall"[Title/Abstract] OR "chest wall"[Title/Abstract] OR "breast edema"[Title/Abstract] OR "breast oedema"[Title/Abstract])`
const [discoveredPmids, armPmids, trunkAbdomenPmids] = await Promise.all([
  searchPubmed(pubmedQuery),
  searchPubmed(armQuery),
  searchPubmed(trunkAbdomenQuery),
])
const discoveredPublications = await fetchPubmedSummaries(discoveredPmids)
const trackedPublications = await fetchPubmedSummaries([...trackedPmids])
const newPublications = discoveredPublications.filter((record) => !trackedPmids.has(record.pmid))
const armPmidSet = new Set(armPmids)
const trunkAbdomenPmidSet = new Set(trunkAbdomenPmids)
const armPublications = newPublications.filter((record) => armPmidSet.has(record.pmid))
const trunkAbdomenPublications = newPublications.filter((record) => trunkAbdomenPmidSet.has(record.pmid))
const frenchPublications = newPublications.filter((record) => record.languages.includes("fre"))
const germanPublications = newPublications.filter((record) => record.languages.includes("ger"))
const chinesePublications = newPublications.filter((record) => record.languages.includes("chi"))
const japanesePublications = newPublications.filter((record) => record.languages.includes("jpn"))

const ctVersion = await fetchJson("https://clinicaltrials.gov/api/v2/version")
const allTrials = await fetchClinicalTrials()
const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000
const trackedById = new Map(current.trials.map((trial) => [trial.nctId, trial]))
const discoveredById = new Map(allTrials.map((trial) => [trial.nctId, trial]))
const changedTrials = []

for (const [nctId, tracked] of trackedById) {
  const fresh = discoveredById.get(nctId) ?? normaliseTrial(await fetchJson(`https://clinicaltrials.gov/api/v2/studies/${nctId}`))
  if (
    fresh.status.toLowerCase() !== tracked.status.toLowerCase()
    || fresh.lastUpdated !== tracked.lastUpdated
    || fresh.hasResults !== tracked.resultsAvailable
    || fresh.enrolment !== tracked.enrolment
  ) changedTrials.push(fresh)
}

const newTrials = allTrials.filter((trial) => {
  if (!trial.nctId || trackedById.has(trial.nctId)) return false
  const updated = Date.parse(`${trial.lastUpdated}T00:00:00Z`)
  return Number.isFinite(updated) && updated >= cutoff
})

const now = new Date()
const reviewMonth = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  timeZone: "Australia/Sydney",
}).format(now)

process.stdout.write(formatDigest({
  reviewMonth,
  windowDays,
  currentVersion: current.version,
  nextReviewDue: current.nextReviewDue,
  newPublications,
  armPublications,
  trunkAbdomenPublications,
  frenchPublications,
  germanPublications,
  chinesePublications,
  japanesePublications,
  trackedWarnings: retractionWarnings(trackedPublications),
  changedTrials,
  newTrials,
  clinicalTrialsTimestamp: ctVersion.dataTimestamp,
}))

async function searchPubmed(term) {
  const params = new URLSearchParams({
    db: "pubmed",
    retmode: "json",
    retmax: "200",
    sort: "pub date",
    datetype: "edat",
    reldate: String(windowDays),
    term,
    tool: toolName,
  })
  if (contactEmail) params.set("email", contactEmail)
  const response = await fetchJson(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?${params}`)
  return response.esearchresult?.idlist ?? []
}

async function fetchPubmedSummaries(pmids) {
  const records = []
  for (let start = 0; start < pmids.length; start += 100) {
    const batch = pmids.slice(start, start + 100)
    if (batch.length === 0) continue
    const params = new URLSearchParams({
      db: "pubmed",
      retmode: "json",
      id: batch.join(","),
      tool: toolName,
    })
    if (contactEmail) params.set("email", contactEmail)
    const response = await fetchJson(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?${params}`)
    const uids = response.result?.uids ?? []
    for (const uid of uids) records.push(normalisePubmedSummary(uid, response.result[uid]))
  }
  return records
}

async function fetchClinicalTrials() {
  const trials = []
  let pageToken
  let pages = 0
  do {
    const params = new URLSearchParams({
      "query.cond": "Lymphedema",
      pageSize: "100",
      format: "json",
    })
    if (pageToken) params.set("pageToken", pageToken)
    const response = await fetchJson(`https://clinicaltrials.gov/api/v2/studies?${params}`)
    trials.push(...(response.studies ?? []).map(normaliseTrial))
    pageToken = response.nextPageToken
    pages += 1
    if (pages >= 10 && pageToken) throw new Error("ClinicalTrials.gov search exceeded 1,000 records; narrow the query")
  } while (pageToken)
  return trials
}

async function fetchJson(url) {
  let lastError
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { accept: "application/json", "user-agent": `${toolName}/0.1 (${projectUrl})` },
        signal: AbortSignal.timeout(25_000),
      })
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
      return await response.json()
    } catch (error) {
      lastError = error
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 750))
    }
  }
  throw new Error(`Request failed after three attempts: ${url}\n${String(lastError)}`)
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  }))
  return nested.flat()
}

function positiveInteger(value, name) {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error(`${name} must be a positive integer`)
  return parsed
}
