# Grade 5 French Science — Library fingerprint verification

**Audit date:** 17 November 2026
**Repository base:** `main` at `527df4fb7da32d6f3badb5f31d1172ffc0de6eec`
**Science continuation:** [PR #200](https://github.com/madnessgate44-debug/Amina/pull/200); implementation head before this audit report was added: `969f0f9fcb2bc119f8fdf3899767b582bccd1a93`
**Scope:** Grade 5, Egyptian Ministry 2026–2027 French Science, Term 1 only.

## Outcome

- **[VERIFIED]** The existing Library page-fingerprint CSV reproduces exactly against the 110-page Library PDF copy: 110 pages compared, zero missing pages and zero mismatches.
- **[VERIFIED]** The extracted-text fingerprint for PDF page 110 is empty. The inspected Library copy therefore has 109 pages of book content plus an appended page with no extractable text.
- **[LIMIT]** This verifies the internal consistency of the Library PDF and its CSV. It does **not** independently compare the Library copy with the canonical Ministry-hosted PDF, prove visual identity, or authenticate untouched publisher-original bytes.
- **[VERIFIED]** The later canonical Actions artifact from run [43706201870](https://github.com/madnessgate44-debug/Amina/actions/runs/43706201870), artifact `14158542215`, contains 109 per-page fingerprints. Compared with Library pages 1–109, all 109 normalized-text SHA-256 values and character counts match: 109/109, 0 missing, 0 mismatches.
- **[VERIFIED]** The canonical and Library CSVs and the comparison JSON are now preserved in the [source-results branch](https://github.com/madnessgate44-debug/Amina/tree/audit/ministry-science-source-results).
- **[LIMIT]** This establishes normalized extracted-text equivalence only; it does not establish visual/layout identity, byte identity, untouched publisher-original provenance or pedagogical equivalence.
- **[UNPROVEN]** Automatic publication by the updated workflow in PR #200 has not yet been exercised end-to-end.

## Library source files and hashes

| Artifact | Size | SHA-256 |
|---|---:|---|
| Library Science PDF | 59,040,102 bytes | `6fe1d9fdcf2108c76e73c6a148277629b2d71a9a95acec427f533190b163779c` |
| Library page-fingerprint CSV | 8,143 bytes | `b5f8cd0eba7b4a36875242bd5bc1a194e87633158470302caa93bf62b732117e` |

The PDF metadata reports 110 pages and identifies PDFsharp 1.50.4000-netstandard as Creator/Producer. The Library copy carries the Ministry 2026–2027 imprint and ISBN 978-633-8530-17-4, but its third-party assembly/processing history remains a provenance limitation.

## Reproduction method and result

The PDF and CSV were materialized from the Library. For each PDF page 1–110, the audit ran Poppler `pdftotext -layout -f N -l N`, collapsed extracted whitespace with `' '.join(text.split())`, counted normalized characters, and computed SHA-256 over the normalized UTF-8 text. Each resulting tuple was compared with the CSV row for the same `pdf_page`.

**Verification ledger — 17 November 2026, 07:45:13 UTC**

| Action | Exit | Raw result |
|---|---:|---|
| `pdfinfo <Library PDF>` | 0 | `Pages: 110`; `File size: 59040102 bytes` |
| `sha256sum <Library PDF>` | 0 | `6fe1d9fdcf2108c76e73c6a148277629b2d71a9a95acec427f533190b163779c` |
| `sha256sum <Library CSV>` | 0 | `b5f8cd0eba7b4a36875242bd5bc1a194e87633158470302caa93bf62b732117e` |
| Per-page Poppler/Python comparison | 0 | `csv_rows=110 unique_pdf_pages=110 compared_pages=110 missing_pages=0 mismatches=0` |

PDF page 110 has `normalized_text_characters=0` and SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

## Canonical Ministry endpoint: what is and is not reproduced

- **[VERIFIED]** GitHub Actions run [43705922358](https://github.com/madnessgate44-debug/Amina/actions/runs/43705922358) downloaded the canonical endpoint `https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1/StudentBook/Science_FR_prim5_TR1.pdf`: HTTP 200, `application/pdf`, 62,976,199 bytes, 109 PDF pages, SHA-256 `dc4b2d55b2e34fd21fd3f5e54c5614e727718b27dd8079d087d9cd0fa3cbbae5`.
- **[VERIFIED]** The retained artifact for run `43705922358` contains `download.txt`, `file-size.txt`, `pdfinfo.txt`, `sha256.txt` and `source-audit.json`, but that earlier artifact has no per-page fingerprint inventory.
- **[VERIFIED]** A later successful source-audit run [43706201870](https://github.com/madnessgate44-debug/Amina/actions/runs/43706201870), artifact `14158542215`, contains `source-audit.json` with 109 `page_text_fingerprints`. This run's artifact was downloaded and its fingerprints were independently compared with the Library CSV: 109/109 exact normalized-text SHA-256 and character-count matches, 0 missing and 0 mismatches.
- **[VERIFIED]** The canonical CSV was derived from that Actions JSON artifact; the Library CSV was checked against all 110 Library PDF pages. Both CSVs and the updated `library-comparison.json` are preserved in `audit/ministry-science-source-results`.
- **[LIMIT]** The canonical and Library PDF hashes differ. Matching extracted text does not prove matching page images, diagrams, layout, typography, byte identity, untouched publisher-original provenance or pedagogical equivalence.
- **[VERIFIED]** PR #200's updated workflow additionally exports the page fingerprints to CSV and publishes refreshed JSON/CSV reports to `audit/ministry-science-source-results`.
- **[UNPROVEN]** Automatic publication by that updated workflow remains untested because PR #200 is still open and unmerged. No merge or dispatch was performed in this run.

## Student-book page review and chapter coverage

The Library PDF contents page is PDF page 6 (printed page 5). It lists the following nine exact TOC headings. Chapter-opening banner variants are separate lesson-level wording and do not replace the TOC titles.

| Chapter | Exact TOC heading | Printed chapter span | Numbered lesson spans | Separate source sections |
|---:|---|---:|---|---|
| 1 | Les os et les muscles | 6–19 | 6–17 | Enrichment 18–19 |
| 2 | Les changements des saisons | 20–27 | 20–25 | Enrichment 26–27 |
| 3 | Les conditions de germination | 28–43 | 28–42 | Enrichment 43 |
| 4 | Les conditions de croissance | 44–51 | 44–49 | Enrichment 50–51 |
| 5 | De la fleur au fruit | 52–63 | 52–62 | Review 63 |
| 6 | La croissance et la reproduction humaines | 64–71 | 64–71 | — |
| 7 | La croissance et la reproduction des animaux | 72–79 | 72–79 | — |
| 8 | Les changements météorologiques | 80–91 | 80–89 | Enrichment 90–91 |
| 9 | Le cycle de l’eau | 92–103 | 92–101 | Enrichment 102–103 |

The scientific-method appendix is separately printed on pages 104–107. The nine chapters contain 28 numbered lessons. The 28 Miss Noor teaching plans remain app-authored; their explanations, demonstrations, guided/independent practice, answer keys, misconception diagnoses, remediation and mastery checks are not attributed to a Ministry teacher guide.

**[VERIFIED]** Text extraction for the TOC, all nine chapter spans, enrichment/review pages and appendix pages was inspected in this continuation. This is not a high-resolution review of every illustration/diagram or an independent scientific peer review of every sentence.

## Ministry teacher guide

**[BLOCKED]** No exact Egyptian Ministry 2026–2027 Grade 5 French Science teacher guide was authenticated in the Library or the public-source searches performed for this continuation. A third-party `دفتر تحضير` listing is not accepted as proof of Ministry authorship or French-track alignment. The current Miss Noor pack remains explicitly app-authored; no substitute guide has been silently imported.

## PR verification snapshot

Baseline PR #200 merge-ref checks from 16 November 2026:

- **[PASS]** CI run [43824642684](https://github.com/madnessgate44-debug/Amina/actions/runs/43824642684), merge ref `b6143c1d6e4bb4d018e424db875aca2ec21c81b2`: `npm run lint` (script runs `tsc --noEmit`) succeeded; `npm test` reported `TEST SUITE SUMMARY: 39 PASSED, 0 FAILED`; the curriculum registry reported `54 PASSED, 0 FAILED`; `npm run build` transformed 1,792 modules and completed in 587 ms.
- **[PASS]** Engineering Execution OS compliance run [43824642653](https://github.com/madnessgate44-debug/Amina/actions/runs/43824642653) reported `ENGINEERING EXECUTION OS COMPLIANCE: PASS`.
- **[PASS]** Latest inspected 17 November CI run [44041594104](https://github.com/madnessgate44-debug/Amina/actions/runs/44041594104), on merge ref `77b1c0b125bb797ff9398f5c699c3d936fd40aa8` for PR head `ad5929ca51fe04f40d5164a9d50eb5f4d36bd22a`, passed `npm run lint` (`tsc --noEmit`), `npm test` (39 passed, 0 failed; curriculum registry 54 passed, 0 failed; all 28 page ranges exact with 0 mismatches) and `npm run build` (1,792 modules; 715 ms).
- **[PASS]** Engineering Execution OS compliance run [44041594042](https://github.com/madnessgate44-debug/Amina/actions/runs/44041594042) reported `ENGINEERING EXECUTION OS COMPLIANCE: PASS`.
- **[VERIFIED]** The curriculum registry log explicitly reports all 28 Science lesson page ranges with 0 mismatches.
- **[UNPROVEN]** These are PR merge-ref checks, not a merge to main, a production deployment, or a phone-sized learner walkthrough.

## Next action

After owner approval to merge PR #200, run the updated source-audit workflow on `main` to refresh and automatically publish the JSON and CSV evidence, then compare the new output with the preserved 17 November fingerprints to detect any source drift. High-resolution diagram review, independent pedagogical review and the phone-sized learner walkthrough remain open. Keep the teacher-guide status blocked until an exact matching Ministry document is authenticated. Do not extend this Term 1 result into a full-year or full-book completion claim.
