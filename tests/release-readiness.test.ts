import { describe, expect, it } from "vitest"
import { assertEvidenceFirstReleaseReady } from "../scripts/release-readiness.mjs"

const approvedEdition = {
  version: "2026.08.5",
  evidenceOverview: { items: [] },
  clinicalReview: {
    status: "approved",
    reviewerName: "Clinical Reviewer",
    credentials: "Registered clinician",
    reviewedOn: "2026-08-01",
  },
}

const approvedChinese = {
  translationStatus: "human-reviewed",
  languageReview: {
    status: "approved",
    reviewerName: "Language Reviewer",
    reviewerRole: "Independent Chinese reviewer",
    reviewedOn: "2026-08-01",
  },
}

const disclosedEdition = {
  version: "2026.08.5",
  evidenceOverview: { items: [] },
  clinicalReview: { status: "not-reviewed" },
}

const disclosedChinese = {
  translationStatus: "ai-assisted",
  languageReview: { status: "not-reviewed" },
}

describe("evidence-first release readiness", () => {
  it("accepts publication with explicit non-review disclosures", () => {
    expect(() => assertEvidenceFirstReleaseReady(disclosedEdition, disclosedChinese)).not.toThrow()
  })

  it("rejects an unsupported clinical review status", () => {
    expect(() => assertEvidenceFirstReleaseReady({
      ...approvedEdition,
      clinicalReview: { status: "pending" },
    }, approvedChinese)).toThrow("unsupported clinical review status")
  })

  it("requires an AI-assisted translation to be marked not-reviewed", () => {
    expect(() => assertEvidenceFirstReleaseReady(disclosedEdition, {
      ...disclosedChinese,
      languageReview: { status: "approved" },
    })).toThrow("must be marked not-reviewed")
  })

  it("requires public reviewer attribution for an approved review", () => {
    expect(() => assertEvidenceFirstReleaseReady({
      ...approvedEdition,
      clinicalReview: { ...approvedEdition.clinicalReview, reviewerName: undefined },
    }, approvedChinese)).toThrow("missing reviewerName")
  })

  it("accepts both completed reviews", () => {
    expect(() => assertEvidenceFirstReleaseReady(approvedEdition, approvedChinese)).not.toThrow()
  })

  it("rejects reviewer attribution on a not-reviewed status", () => {
    expect(() => assertEvidenceFirstReleaseReady({
      ...disclosedEdition,
      clinicalReview: { status: "not-reviewed", reviewerName: "Someone" },
    }, disclosedChinese)).toThrow("must not include reviewerName")
  })

  it("rejects a false human-reviewed translation status", () => {
    expect(() => assertEvidenceFirstReleaseReady(disclosedEdition, {
      translationStatus: "human-reviewed",
      languageReview: { status: "not-reviewed" },
    })).toThrow("requires approved language review")
  })

  it("does not add the new gate to legacy editions", () => {
    expect(() => assertEvidenceFirstReleaseReady({ version: "2026.08.4" }, undefined)).not.toThrow()
  })
})
