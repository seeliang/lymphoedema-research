import { access, readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const editions = JSON.parse(await readFile(join(root, "src/data/editions.json"), "utf8"))
const current = editions.filter((edition) => edition.status === "current")
const drafts = editions.filter((edition) => edition.status === "draft")

if (current.length !== 1) throw new Error(`Expected exactly one current edition, found ${current.length}`)

const englishRoot = await readFile(join(root, "dist", "index.html"), "utf8")
const chineseRoot = await readFile(join(root, "dist", "zh-cn", "index.html"), "utf8")
for (const [label, html] of [["English", englishRoot], ["Chinese", chineseRoot]]) {
  if (!html.includes(current[0].version)) throw new Error(`${label} root does not render current edition ${current[0].version}`)
  for (const draft of drafts) {
    if (html.includes(draft.version)) throw new Error(`${label} public root exposes draft edition ${draft.version}`)
  }
}

for (const draft of drafts) {
  for (const path of [
    join(root, "dist", "versions", draft.version, "index.html"),
    join(root, "dist", "zh-cn", "versions", draft.version, "index.html"),
  ]) {
    try {
      await access(path)
      throw new Error(`Public build exposes draft artifact: ${path}`)
    } catch (error) {
      if (error?.code !== "ENOENT") throw error
    }
  }
}

process.stdout.write(`Public build passed: ${current[0].version} is current and ${drafts.length} draft edition(s) are excluded.\n`)
