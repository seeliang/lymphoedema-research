import { defineCollection } from "astro:content"
import { file, glob } from "astro/loaders"
import { z } from "astro/zod"

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use an ISO date: YYYY-MM-DD")
const editionVersion = z.string().regex(/^\d{4}\.\d{2}\.\d+$/, "Use calendar versioning: YYYY.MM.PATCH")

const sourceSchema = z.object({
  label: z.string().min(3),
  url: z.url().refine((value) => value.startsWith("https://"), "Sources must use HTTPS"),
  kind: z.enum(["guideline", "journal", "registry", "patient-resource"]),
  pmid: z.string().regex(/^\d+$/).optional(),
  doi: z.string().min(3).optional(),
})

const evidence = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/evidence" }),
  schema: z.object({
    edition: editionVersion,
    order: z.number().int().positive(),
    section: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase kebab-case section identifier").optional(),
    area: z.string().min(3),
    title: z.string().min(8),
    population: z.string().min(8),
    studyDesign: z.string().min(5),
    evidenceLevel: z.enum(["Randomised evidence", "Systematic review", "Early clinical evidence", "Mechanistic evidence"]),
    publicationDate: isoDate,
    takeaway: z.string().min(20),
    meaning: z.string().min(20),
    limitation: z.string().min(20),
    tags: z.array(z.string().min(2)).min(1),
    sources: z.array(sourceSchema).min(1),
  }),
})

const trialSchema = z.object({
  nctId: z.string().regex(/^NCT\d{8}$/),
  title: z.string().min(8),
  population: z.string().min(8),
  design: z.string().min(5),
  status: z.string().min(3),
  enrolment: z.number().int().positive(),
  resultsAvailable: z.boolean(),
  lastUpdated: isoDate,
  checkedOn: isoDate,
  url: z.url(),
  caution: z.string().min(20),
})

const deferredCandidateSchema = z.object({
  id: z.string().min(3),
  title: z.string().min(8),
  url: z.url().refine((value) => value.startsWith("https://"), "Deferred sources must use HTTPS"),
  reason: z.string().min(20),
  revisitWhen: z.string().min(20),
})

const childrenSummarySchema = z.object({
  publicationCandidates: z.number().int().nonnegative(),
  trialRecords: z.number().int().nonnegative(),
  summary: z.string().min(20),
  reviewUrl: z.url().refine((value) => value.startsWith("https://"), "Review links must use HTTPS"),
})

const editions = defineCollection({
  loader: file("src/data/editions.json"),
  schema: z.object({
    version: editionVersion,
    schemaVersion: z.number().int().positive(),
    status: z.enum(["current", "superseded", "withdrawn"]),
    reviewedOn: isoDate,
    nextReviewDue: isoDate,
    title: z.string().min(8),
    summary: z.string().min(20),
    changes: z.array(z.string().min(5)).min(1),
    childrenFocus: childrenSummarySchema.optional(),
    childrenSection: childrenSummarySchema.optional(),
    deferredCandidates: z.array(deferredCandidateSchema).optional(),
    trials: z.array(trialSchema),
  }).refine((edition) => !(edition.childrenFocus && edition.childrenSection), {
    message: "An edition cannot use both the legacy children focus and the children evidence section",
    path: ["childrenSection"],
  }),
})

export const collections = { evidence, editions }
