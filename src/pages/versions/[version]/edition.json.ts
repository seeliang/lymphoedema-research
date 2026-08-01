import type { APIRoute } from "astro"
import { getAllEditions, getEditionBundle, type EditionBundle } from "../../../lib/content"

export async function getStaticPaths() {
  const editions = await getAllEditions()
  return Promise.all(editions.map(async (edition) => ({
    params: { version: edition.data.version },
    props: { bundle: await getEditionBundle(edition.data.version) },
  })))
}

export const GET: APIRoute<{ bundle: EditionBundle }> = ({ props }) => {
  const { edition, evidence, notices } = props.bundle
  return new Response(JSON.stringify({
    id: edition.id,
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
