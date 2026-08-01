import { readFile, readdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const argumentsAfterSeparator = process.argv.slice(2).filter((argument) => argument !== "--")
const version = argumentsAfterSeparator[0]
if (argumentsAfterSeparator.length !== 1 || !version || !/^\d{4}\.\d{2}\.\d+$/.test(version)) {
  throw new Error("Usage: pnpm release:check -- YYYY.MM.PATCH")
}

const editions = JSON.parse(await readFile(join(root, "src/data/editions.json"), "utf8"))
const edition = editions.find((entry) => entry.version === version)
if (!edition) throw new Error(`Edition ${version} is not present in src/data/editions.json`)
if (edition.status !== "current") throw new Error(`Only the current edition can be released; ${version} is ${edition.status}`)

const evidenceDirectory = join(root, "src/data/evidence", version)
const evidenceFiles = (await readdir(evidenceDirectory)).filter((file) => file.endsWith(".md"))
if (evidenceFiles.length === 0) throw new Error(`Edition ${version} has no evidence entries`)

for (const file of evidenceFiles) {
  const source = await readFile(join(evidenceDirectory, file), "utf8")
  if (!source.includes(`edition: "${version}"`)) throw new Error(`${file} does not declare edition ${version}`)
  if (!source.includes("limitation:")) throw new Error(`${file} has no limitation`)
  if (!/pmid:\s*["']?\d+/.test(source)) throw new Error(`${file} has no PMID source`)
}

const jsonArtifact = join(root, "dist", "versions", version, "edition.json")
try {
  JSON.parse(await readFile(jsonArtifact, "utf8"))
} catch {
  throw new Error(`Build artifact missing or invalid: ${jsonArtifact}. Run pnpm check first.`)
}

const notes = [
  `# Lymphoedema Research Brief ${version}`,
  "",
  `Reviewed: ${edition.reviewedOn}`,
  `Next review due: ${edition.nextReviewDue}`,
  `Content schema: ${edition.schemaVersion}`,
  "",
  "## Changes",
  "",
  ...edition.changes.map((change) => `- ${change}`),
  "",
  `Evidence entries: ${evidenceFiles.length}`,
  `Tracked trials: ${edition.trials.length}`,
  "",
  "General information only. Not medical advice. Source-reviewed; not clinician-reviewed.",
  "",
]

process.stdout.write(notes.join("\n"))
