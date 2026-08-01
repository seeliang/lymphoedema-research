const base = import.meta.env.BASE_URL.replace(/\/$/, "")

export function withBase(path = "/"): string {
  const normalised = path.startsWith("/") ? path : `/${path}`
  const withTrailingSlash = normalised.endsWith("/") || normalised.includes(".") ? normalised : `${normalised}/`
  return `${base}${withTrailingSlash}` || "/"
}
