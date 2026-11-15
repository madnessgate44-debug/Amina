# Grade 5 Term 1 curriculum source audit (2026–2027)

This directory stores evidence from the Egyptian Ministry-hosted Grade 5 Term 1 source retrieval audit and the subject-by-subject reconciliation status.

## Files

- `subject-source-audit.json`: per-source retrieval timestamp, URL, HTTP result, byte count, SHA-256, PDF metadata, page count, and extraction markers.
- `subject-page-fingerprints.csv`: one row per PDF page with a normalized extracted-text SHA-256 and character count.
- `subject-status.md`: consolidated status, coverage gaps, evidence limits, and next steps.

## Method and limitations

The audit ran on GitHub Actions run [43711609764](https://github.com/madnessgate44-debug/Amina/actions/runs/43711609764), using Ubuntu 24.04, Poppler `pdfinfo` and `pdftotext`, and Python SHA-256 hashing. It attempted 16 Ministry-hosted URLs. It retained only metadata and normalized page fingerprints; no source PDF or full extracted textbook text is stored in this repository.

A page fingerprint proves only that extracted text was available and hashed for that page. It does not prove publisher authenticity, byte identity with an original, visual/layout identity, diagram fidelity, or pedagogical equivalence. The student-book PDFs have third-party PDF-processing metadata; this is explicitly recorded in the JSON. Weekly assessment PDFs' metadata identifies a document-production tool/author, not an independently verified Ministry author. The host URL is evidence of location, not sufficient proof of authorship.

No student-specific timetable, Girard book list, French1/French2 assignment, or teacher guide was available in this audit. Do not infer those facts.

## Copyright and privacy

Do not add source PDFs, full extracted text, private learner data, credentials, or secrets. Store concise app-authored summaries, source references, audit metadata, and page fingerprints only.
