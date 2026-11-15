# Grade 5 Term 1 curriculum source audit (2026–2027)

This directory contains the evidence-first subject audit for Egyptian Primary Grade 5, 2026–2027, Term 1.

## Files

- `subject-source-audit.json` — URL, retrieval timestamp, HTTP result, byte count, SHA-256, PDF metadata, page count and text-marker results for each attempted source.
- `subject-page-fingerprints.csv` — one row per successful PDF page with normalized extracted-text SHA-256 and character count.
- `subject-page-headings.csv` — first three non-empty extracted lines per page, as heading candidates for navigation/reconciliation.
- `math-fr-lesson-reconciliation.csv` — all 46 lessons in the retrieved French Mathematics book TOC, matched to current app lesson records.
- `math-fr-extra-record-review.csv` — review of the four additional French-extract Math records.
- `english-unit-reconciliation.csv` — the six English Term 1 units in the official scope-and-sequence and current app registry coverage.
- `subject-status.md` — consolidated Science, Mathematics, French-language and English status, source caveats, PR state and remaining gates.

## Method

Source retrieval and page fingerprints were generated on GitHub Actions run [43713024112](https://github.com/madnessgate44-debug/Amina/actions/runs/43713024112), using Ubuntu 24.04, Poppler `pdfinfo` / `pdftotext`, and SHA-256. The run attempted 16 Ministry-hosted URLs and retrieved 15 PDFs. It fingerprinted 300 pages across the successful Math, English, French1 and French2 PDFs.

The Math TOC (PDF pages 2–4) and English Term 1 scope-and-sequence (PDF pages 3–5) were extracted to a short-lived, one-day Actions artifact for review. The repository retains only metadata, hashes, concise page-heading candidates and reconciliation matrices. Lesson titles in the Math matrix are normalized from extracted TOC text to remove duplicate extraction lines and line-wrap artifacts; visual review of the printed TOC has not been performed. It does not contain source PDFs or full extracted textbook text.

## Interpretation limits

- A successful Ministry-hosted URL retrieval does not prove that a PDF is an untouched publisher original. The Math and English student-book files have third-party PDF-processing metadata.
- Page fingerprints compare normalized extracted text only. They do not prove visual/layout identity, diagram fidelity, publisher authenticity or pedagogical equivalence.
- Weekly French assessments establish the existence of French1 and French2 assessment tracks, not which coursebook École Girard assigns.
- TOC and scope-and-sequence matching is not full lesson-page review, assessment-key verification, school pacing confirmation or learner mastery evidence.
- App-authored teaching material must be labelled as such; never present it as verbatim textbook prose or an official Ministry teacher guide.

## Copyright and privacy

Do not add source PDFs, full extracted textbook text, private learner information, credentials or secrets. Store concise summaries, page references, metadata, hashes, and original app-authored teaching material only.
