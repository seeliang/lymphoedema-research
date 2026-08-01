import { readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const argumentsAfterSeparator = process.argv.slice(2).filter((argument) => argument !== "--")
const version = argumentsAfterSeparator[0]

if (argumentsAfterSeparator.length !== 1 || !version || !/^\d{4}\.\d{2}\.\d+$/.test(version)) {
  throw new Error("Usage: pnpm check:publication -- YYYY.MM.PATCH")
}

const editions = JSON.parse(await readFile(join(root, "src/data/editions.json"), "utf8"))
const edition = editions.find((entry) => entry.version === version)
if (!edition) throw new Error(`Edition ${version} is not present in src/data/editions.json`)

const englishHtml = await readRequired(join(root, "dist", "versions", version, "index.html"))
const chineseHtml = await readRequired(join(root, "dist", "zh-cn", "versions", version, "index.html"))
const englishCurrentHtml = await readRequired(join(root, "dist", "index.html"))
const chineseCurrentHtml = await readRequired(join(root, "dist", "zh-cn", "index.html"))
const englishArtifact = JSON.parse(await readRequired(join(root, "dist", "versions", version, "edition.json")))
const chineseArtifact = JSON.parse(await readRequired(join(root, "dist", "zh-cn", "versions", version, "edition.json")))

assertIncludes(englishHtml, `Edition ${version}`, "English version heading")
assertIncludes(chineseHtml, `第 ${version} 版`, "Chinese version heading")
assertEqual(englishArtifact.version, version, "English artifact version")
assertEqual(chineseArtifact.version, version, "Chinese artifact version")
assertEqual(chineseArtifact.locale, "zh-CN", "Chinese artifact locale")

if (edition.childrenFocus) {
  for (const [label, html] of [["English current", englishCurrentHtml], ["English archive", englishHtml]]) {
    assertOrderedSections(html, ["children", "evidence", "deferred", "trials"], label)
    assertIncludes(html, "Children and adolescents", `${label} children heading`)
    assertIncludes(html, "Other current evidence", `${label} secondary evidence heading`)
    assertIncludes(html, "Deferred evidence", `${label} deferred heading`)
    assertTextOrder(
      html,
      "Genetic and tissue studies are refining disease mechanisms—not treatment yet",
      "Progressive resistance training may reduce lymphoedema risk after breast-cancer surgery",
      `${label} evidence order`,
    )
  }
  for (const [label, html] of [["Chinese current", chineseCurrentHtml], ["Chinese archive", chineseHtml]]) {
    assertOrderedSections(html, ["children", "evidence", "deferred", "trials"], label)
    assertIncludes(html, "儿童和青少年", `${label} children heading`)
    assertIncludes(html, "其他现有证据", `${label} secondary evidence heading`)
    assertIncludes(html, "暂缓处理的证据", `${label} deferred heading`)
    assertIncludes(html, 'name="robots" content="noindex', `${label} noindex metadata`)
    assertTextOrder(
      html,
      "基因和组织研究正在帮助理解病因，但还没有带来新的治疗",
      "乳腺癌手术后，渐进式力量训练可能有助于降低淋巴水肿风险",
      `${label} evidence order`,
    )
  }

  assertEqual(englishArtifact.childrenFocus?.publicationCandidates, edition.childrenFocus.publicationCandidates, "English publication candidate count")
  assertEqual(chineseArtifact.childrenFocus?.publicationCandidates, edition.childrenFocus.publicationCandidates, "Chinese publication candidate count")
  assertEqual(englishArtifact.childrenFocus?.trialRecords, edition.childrenFocus.trialRecords, "English child trial count")
  assertEqual(chineseArtifact.childrenFocus?.trialRecords, edition.childrenFocus.trialRecords, "Chinese child trial count")
  assertEqual(englishArtifact.deferredCandidates?.length, edition.deferredCandidates?.length, "English deferred candidate count")
  assertEqual(chineseArtifact.deferredCandidates?.length, edition.deferredCandidates?.length, "Chinese deferred candidate count")

}

const archiveNotices = JSON.parse(await readFile(join(root, "src/data/archive-notices.json"), "utf8"))
for (const notice of archiveNotices.filter((entry) => entry.replacementVersion === version)) {
  const correctedEnglishHtml = await readRequired(join(root, "dist", "versions", notice.version, "index.html"))
  const correctedChineseHtml = await readRequired(join(root, "dist", "zh-cn", "versions", notice.version, "index.html"))
  assertIncludes(correctedEnglishHtml, notice.message, `English correction notice for ${notice.version}`)
  assertIncludes(correctedChineseHtml, notice.messageZhCN, `Chinese correction notice for ${notice.version}`)
}

process.stdout.write(`Publication contract passed for ${version}: rendered English and Chinese hierarchy verified.\n`)

async function readRequired(path) {
  try {
    return await readFile(path, "utf8")
  } catch (error) {
    if (error?.code === "ENOENT") throw new Error(`Required build artifact is missing: ${path}. Run pnpm build first.`)
    throw error
  }
}

function assertIncludes(source, expected, label) {
  if (!source.includes(expected)) throw new Error(`${label} is missing: ${expected}`)
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) throw new Error(`${label} mismatch: expected ${expected}, received ${actual}`)
}

function assertOrderedSections(html, ids, locale) {
  for (let index = 1; index < ids.length; index += 1) {
    assertTextOrder(html, `id="${ids[index - 1]}"`, `id="${ids[index]}"`, `${locale} section order`)
  }
}

function assertTextOrder(source, first, second, label) {
  const firstIndex = source.indexOf(first)
  const secondIndex = source.indexOf(second)
  if (firstIndex < 0 || secondIndex < 0 || firstIndex >= secondIndex) {
    throw new Error(`${label} mismatch: expected "${first}" before "${second}"`)
  }
}
