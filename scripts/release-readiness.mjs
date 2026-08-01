export function assertEvidenceFirstReleaseReady(edition, chineseTranslation) {
  if (!edition.evidenceOverview) return

  const clinicalReview = edition.clinicalReview
  if (!clinicalReview) {
    throw new Error(`Edition ${edition.version} must declare its clinical review status`)
  }
  if (clinicalReview.status === "approved") {
    for (const field of ["reviewerName", "credentials", "reviewedOn"]) {
      if (!clinicalReview[field]) {
        throw new Error(`Edition ${edition.version} approved clinical review is missing ${field}`)
      }
    }
  } else if (clinicalReview.status === "not-reviewed") {
    for (const field of ["reviewerName", "credentials", "reviewedOn"]) {
      if (clinicalReview[field]) {
        throw new Error(`Edition ${edition.version} not-reviewed clinical status must not include ${field}`)
      }
    }
  } else {
    throw new Error(`Edition ${edition.version} has an unsupported clinical review status`)
  }

  if (!chineseTranslation) {
    throw new Error(`Edition ${edition.version} requires a Simplified Chinese artifact before release`)
  }
  const languageReview = chineseTranslation.languageReview
  if (chineseTranslation.translationStatus === "human-reviewed") {
    if (languageReview?.status !== "approved") {
      throw new Error(`Edition ${edition.version} human-reviewed Chinese translation requires approved language review`)
    }
    for (const field of ["reviewerName", "reviewerRole", "reviewedOn"]) {
      if (!languageReview[field]) {
        throw new Error(`Edition ${edition.version} approved Chinese language review is missing ${field}`)
      }
    }
  } else if (chineseTranslation.translationStatus === "ai-assisted") {
    if (languageReview?.status !== "not-reviewed") {
      throw new Error(`Edition ${edition.version} AI-assisted Chinese translation must be marked not-reviewed`)
    }
    for (const field of ["reviewerName", "reviewerRole", "reviewedOn"]) {
      if (languageReview[field]) {
        throw new Error(`Edition ${edition.version} not-reviewed Chinese status must not include ${field}`)
      }
    }
  } else {
    throw new Error(`Edition ${edition.version} has an unsupported Chinese translation status`)
  }
}
