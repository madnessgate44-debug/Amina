# Grade 5 French Science Term 1 — source audit outputs

This branch contains durable, machine-readable audit outputs for the 2026–2027 Ministry-hosted Grade 5 French Science Term 1 student book.

- `ministry-page-fingerprints.csv`: 109 per-page normalized-text fingerprints extracted from the `page_text_fingerprints` array in the successful Ministry source-audit artifact from [Actions run 43706201870](https://github.com/madnessgate44-debug/Amina/actions/runs/43706201870), artifact ID `14158542215`.
- `library-page-fingerprints.csv`: 110 per-page normalized-text fingerprints from the separately supplied Library PDF. The CSV was independently recomputed against all 110 Library PDF pages.
- `library-comparison.json`: independently reproduced result: canonical pages 1–109 and Library pages 1–109 have 109/109 exact normalized-text SHA-256 matches, 0 missing pages and 0 mismatches. Library page 110 is the sole extra page and has no extractable text.
- `source-audit.json`: the raw JSON payload, including the 109 fingerprints, is retained in Actions artifact `14158542215`; the updated workflow in PR #200 will publish refreshed JSON and CSV outputs here after it is merged and run on `main`.

The canonical PDF is 109 pages (62,976,199 bytes; SHA-256 `dc4b2d55b2e34fd21fd3f5e54c5614e727718b27dd8079d087d9cd0fa3cbbae5`). The Library PDF is 110 pages (59,040,102 bytes; SHA-256 `6fe1d9fdcf2108c76e73c6a148277629b2d71a9a95acec427f533190b163779c`). The two PDFs are not byte-identical.

The original PDFs and full extracted text are deliberately not committed. Fingerprint equivalence applies only to normalized extracted text; it does not prove identical page images, layout, diagrams, typography, untouched publisher-original provenance, source authenticity or pedagogical equivalence.
