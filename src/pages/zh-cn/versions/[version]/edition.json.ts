import type { APIRoute } from "astro"
import { getAllEditions, getEditionBundle } from "../../../../lib/content"
import { hasZhCNTranslation, localizeEditionBundle, type LocalizedEditionBundle } from "../../../../lib/i18n"

export async function getStaticPaths() {
  const editions = (await getAllEditions()).filter((edition) => hasZhCNTranslation(edition.data.version))
  return Promise.all(editions.map(async (edition) => ({
    params: { version: edition.data.version },
    props: { bundle: localizeEditionBundle(await getEditionBundle(edition.data.version), "zh-CN") },
  })))
}

export const GET: APIRoute<{ bundle: LocalizedEditionBundle }> = ({ props }) => {
  const { edition, evidence, notices, locale, translation } = props.bundle
  return new Response(JSON.stringify({
    id: edition.id,
    locale,
    sourceLocale: translation?.sourceLocale,
    translationStatus: translation?.status,
    translationRevision: translation?.revision,
    translatedOn: translation?.translatedOn,
    sourceEditionPath: `/versions/${edition.data.version}/`,
    ...edition.data,
    evidence: evidence.map((entry) => ({ id: entry.id, ...entry.data })),
    notices: notices.map((entry) => ({ id: entry.id, ...entry.data })),
  }, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  })
}
