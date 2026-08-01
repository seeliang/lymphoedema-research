import { describe, expect, it } from "vitest"
import {
  compareEditionVersions,
  editionTag,
  isPatchEdition,
  parseEditionVersion,
} from "../src/lib/versioning"

describe("edition versioning", () => {
  it("parses calendar editions", () => {
    expect(parseEditionVersion("2026.08.0")).toEqual({ year: 2026, month: 8, patch: 0 })
    expect(parseEditionVersion("2026.08.12")).toEqual({ year: 2026, month: 8, patch: 12 })
  })

  it("rejects invalid months and formats", () => {
    expect(() => parseEditionVersion("1.2.3")).toThrow("Invalid edition version")
    expect(() => parseEditionVersion("2026.13.0")).toThrow("Invalid edition month")
  })

  it("sorts monthly and patch editions", () => {
    expect(compareEditionVersions("2026.08.1", "2026.08.0")).toBeGreaterThan(0)
    expect(compareEditionVersions("2026.09.0", "2026.08.9")).toBeGreaterThan(0)
  })

  it("creates public release tags", () => {
    expect(isPatchEdition("2026.08.1")).toBe(true)
    expect(isPatchEdition("2026.08.0")).toBe(false)
    expect(editionTag("2026.08.0")).toBe("research-2026.08.0")
  })
})
