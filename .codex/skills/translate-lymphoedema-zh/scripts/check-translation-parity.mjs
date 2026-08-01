import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { resolve } from "node:path"

const version = process.argv[2]
if (!version || !/^\d{4}\.\d{2}\.\d+$/.test(version)) {
  throw new Error("Usage: node check-translation-parity.mjs YYYY.MM.PATCH")
}

const root = fileURLToPath(new URL("../../../../", import.meta.url))
const englishPath = resolve(root, "dist", "versions", version, "edition.json")
const chinesePath = resolve(root, "dist", "zh-cn", "versions", version, "edition.json")
const chineseIndexPath = resolve(root, "dist", "zh-cn", "index.html")

const [english, chinese, chineseIndex] = await Promise.all([
  readJson(englishPath),
  readJson(chinesePath),
  readFile(chineseIndexPath, "utf8"),
])

assert(chinese.version === version, `Chinese artifact version is ${chinese.version ?? "missing"}`)
assert(chinese.locale === "zh-CN", `Chinese artifact locale is ${chinese.locale ?? "missing"}`)
assert(chinese.sourceLocale === "en-AU", `Chinese source locale is ${chinese.sourceLocale ?? "missing"}`)
assert(Number.isInteger(chinese.translationRevision) && chinese.translationRevision >= 0, "Chinese translation revision is invalid")
assert(["ai-assisted", "human-reviewed"].includes(chinese.translationStatus), "Chinese translation status is invalid")

assertSame(
  english.evidence.map((entry) => ({
    id: entry.id,
    sources: entry.sources.map((source) => source.url),
  })),
  chinese.evidence.map((entry) => ({
    id: entry.id,
    sources: entry.sources.map((source) => source.url),
  })),
  "evidence IDs and source URLs",
)

assertSame(
  english.trials.map((trial) => ({ nctId: trial.nctId, url: trial.url })),
  chinese.trials.map((trial) => ({ nctId: trial.nctId, url: trial.url })),
  "trial IDs and registry URLs",
)

const translatedFields = ["title", "population", "studyDesign", "takeaway", "meaning", "limitation"]
for (const entry of chinese.evidence) {
  for (const field of translatedFields) {
    assert(typeof entry[field] === "string" && entry[field].trim().length > 0, `${entry.id} has no Chinese ${field}`)
  }
}

if (chinese.translationStatus === "ai-assisted") {
  assert(chineseIndex.includes('<meta name="robots" content="noindex,follow"'), "AI-assisted Chinese page is not noindex")
}

process.stdout.write([
  `Translation parity passed for ${version}`,
  `Evidence entries: ${chinese.evidence.length}`,
  `Trials: ${chinese.trials.length}`,
  `Translation: revision ${chinese.translationRevision} (${chinese.translationStatus})`,
  "",
].join("\n"))

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"))
  } catch (error) {
    throw new Error(`Cannot read built artifact ${path}. Run pnpm check first.\n${String(error)}`)
  }
}

function assertSame(left, right, label) {
  assert(JSON.stringify(left) === JSON.stringify(right), `English and Chinese ${label} differ`)
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}
