import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const editions = JSON.parse(await readFile(join(root, "src/data/editions.json"), "utf8"))
const current = editions.filter((edition) => edition.status === "current")

if (current.length !== 1) throw new Error(`Expected exactly one current edition, found ${current.length}`)

const versions = editions.map((edition) => edition.version)
if (new Set(versions).size !== versions.length) throw new Error("Edition versions must be unique")

for (const edition of editions) {
  if (!/^\d{4}\.\d{2}\.\d+$/.test(edition.version)) throw new Error(`Invalid edition version: ${edition.version}`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(edition.reviewedOn) || !/^\d{4}-\d{2}-\d{2}$/.test(edition.nextReviewDue)) {
    throw new Error(`Edition ${edition.version} has an invalid review date`)
  }
  if (edition.reviewedOn >= edition.nextReviewDue) throw new Error(`Edition ${edition.version} review due date must follow its review date`)
}

const today = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Australia/Sydney",
}).format(new Date())

if (today > current[0].nextReviewDue) {
  throw new Error(`Edition ${current[0].version} is overdue for review (due ${current[0].nextReviewDue}, today ${today})`)
}

console.log(`Freshness check passed: ${current[0].version} is current through ${current[0].nextReviewDue}`)
