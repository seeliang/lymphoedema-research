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

if (edition.childrenSection) {
  for (const [label, html] of [["English current", englishCurrentHtml], ["English archive", englishHtml]]) {
    assertOrderedSections(html, ["evidence", "children", "understanding-diagnosis", "treatment", "deferred", "trials"], label)
    assertIncludes(html, "Evidence selected for this edition", `${label} evidence heading`)
    assertIncludes(html, "Children and adolescents", `${label} children heading`)
    assertIncludes(html, "No reviewed child-specific evidence in this edition", `${label} children empty state`)
    assertExcludes(html, "Main research focus", `${label} obsolete main-focus label`)
    assertIncludes(html, "Understanding and diagnosis", `${label} understanding heading`)
    assertIncludes(html, "Treatment and management", `${label} treatment heading`)
    assertIncludes(html, "Deferred evidence", `${label} deferred heading`)
    assertGroupNumbers(html, "children", "understanding-diagnosis", [], label)
    assertGroupNumbers(html, "understanding-diagnosis", "treatment", ["01", "02"], label)
    assertGroupNumbers(html, "treatment", "deferred", ["01", "02", "03"], label)
    assertTextOrder(
      html,
      'id="understanding-diagnosis"',
      "Genetic and tissue studies are refining disease mechanisms—not treatment yet",
      `${label} understanding section start`,
    )
    assertTextOrder(
      html,
      "Genetic and tissue studies are refining disease mechanisms—not treatment yet",
      "ICG lymphography is promising, but protocols are not yet consistent",
      `${label} understanding evidence order`,
    )
    assertTextOrder(
      html,
      "ICG lymphography is promising, but protocols are not yet consistent",
      'id="treatment"',
      `${label} treatment boundary`,
    )
    assertTextOrder(
      html,
      'id="treatment"',
      "New delivery options may make conservative care easier to manage",
      `${label} treatment section start`,
    )
    assertTextOrder(
      html,
      "New delivery options may make conservative care easier to manage",
      "Progressive resistance training may reduce lymphoedema risk after breast-cancer surgery",
      `${label} treatment evidence order`,
    )
  }
  for (const [label, html] of [["Chinese current", chineseCurrentHtml], ["Chinese archive", chineseHtml]]) {
    assertOrderedSections(html, ["evidence", "children", "understanding-diagnosis", "treatment", "deferred", "trials"], label)
    assertIncludes(html, "本期研究摘要", `${label} evidence heading`)
    assertIncludes(html, "儿童和青少年", `${label} children heading`)
    assertIncludes(html, "本期没有儿童专属证据完成审查", `${label} children empty state`)
    assertExcludes(html, "主要研究重点", `${label} obsolete main-focus label`)
    assertIncludes(html, "了解病因和诊断", `${label} understanding heading`)
    assertIncludes(html, "治疗与管理", `${label} treatment heading`)
    assertIncludes(html, "暂缓处理的证据", `${label} deferred heading`)
    assertIncludes(html, 'name="robots" content="noindex', `${label} noindex metadata`)
    assertGroupNumbers(html, "children", "understanding-diagnosis", [], label)
    assertGroupNumbers(html, "understanding-diagnosis", "treatment", ["01", "02"], label)
    assertGroupNumbers(html, "treatment", "deferred", ["01", "02", "03"], label)
    assertTextOrder(
      html,
      'id="understanding-diagnosis"',
      "基因和组织研究正在帮助理解病因，但还没有带来新的治疗",
      `${label} understanding section start`,
    )
    assertTextOrder(
      html,
      "基因和组织研究正在帮助理解病因，但还没有带来新的治疗",
      "吲哚菁绿（ICG）淋巴造影值得关注，但检查方法尚未统一",
      `${label} understanding evidence order`,
    )
    assertTextOrder(
      html,
      "吲哚菁绿（ICG）淋巴造影值得关注，但检查方法尚未统一",
      'id="treatment"',
      `${label} treatment boundary`,
    )
    assertTextOrder(
      html,
      'id="treatment"',
      "更灵活的加压和指导方式，可能让日常管理更容易",
      `${label} treatment section start`,
    )
    assertTextOrder(
      html,
      "更灵活的加压和指导方式，可能让日常管理更容易",
      "乳腺癌手术后，渐进式力量训练可能有助于降低淋巴水肿风险",
      `${label} treatment evidence order`,
    )
  }

  assertEqual(englishArtifact.childrenSection?.publicationCandidates, edition.childrenSection.publicationCandidates, "English publication candidate count")
  assertEqual(chineseArtifact.childrenSection?.publicationCandidates, edition.childrenSection.publicationCandidates, "Chinese publication candidate count")
  assertEqual(englishArtifact.childrenSection?.trialRecords, edition.childrenSection.trialRecords, "English child trial count")
  assertEqual(chineseArtifact.childrenSection?.trialRecords, edition.childrenSection.trialRecords, "Chinese child trial count")
  assertEqual(englishArtifact.deferredCandidates?.length, edition.deferredCandidates?.length, "English deferred candidate count")
  assertEqual(chineseArtifact.deferredCandidates?.length, edition.deferredCandidates?.length, "Chinese deferred candidate count")
  const expectedEvidenceSections = JSON.stringify({
    "understanding-diagnosis": ["primary-biology", "icg-imaging"],
    "treatment-management": ["compression-self-management", "microsurgery", "resistance-training"],
  })
  assertEqual(JSON.stringify(groupEvidenceSections(englishArtifact.evidence)), expectedEvidenceSections, "English evidence sections")
  assertEqual(JSON.stringify(groupEvidenceSections(chineseArtifact.evidence)), expectedEvidenceSections, "Chinese evidence sections")
  assertEqual(englishArtifact.evidence.filter((entry) => entry.section === "children-adolescents").length, 0, "English reviewed child-specific evidence count")
  assertEqual(chineseArtifact.evidence.filter((entry) => entry.section === "children-adolescents").length, 0, "Chinese reviewed child-specific evidence count")
  for (const entry of englishArtifact.evidence) {
    assertIncludes(englishCurrentHtml, entry.title, `English current evidence ${entry.id}`)
    assertIncludes(englishHtml, entry.title, `English archive evidence ${entry.id}`)
  }
  for (const entry of chineseArtifact.evidence) {
    assertIncludes(chineseCurrentHtml, entry.title, `Chinese current evidence ${entry.id}`)
    assertIncludes(chineseHtml, entry.title, `Chinese archive evidence ${entry.id}`)
  }

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

function assertExcludes(source, unexpected, label) {
  if (source.includes(unexpected)) throw new Error(`${label} is still present: ${unexpected}`)
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

function groupEvidenceSections(evidence) {
  return evidence.reduce((groups, entry) => {
    if (!entry.section) return groups
    const id = entry.id.split("/").at(-1)
    groups[entry.section] ??= []
    groups[entry.section].push(id)
    return groups
  }, {})
}

function assertGroupNumbers(html, startId, endId, expected, label) {
  const start = html.indexOf(`id="${startId}"`)
  const end = html.indexOf(`id="${endId}"`)
  const section = html.slice(start, end)
  const actual = [...section.matchAll(/<span class="evidence-number">(\d+)<\/span>/g)].map((match) => match[1])
  assertEqual(JSON.stringify(actual), JSON.stringify(expected), `${label} ${startId} card numbering`)
}
