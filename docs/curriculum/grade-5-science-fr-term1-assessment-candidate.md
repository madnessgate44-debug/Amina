# Grade 5 Sciences en français — Term 1 assessment-book candidate audit

**Disposition:** [CANDIDATE] A Ministry-branded, third-party-hosted copy was found in the user's Library. It is useful for a provisional assessment-content inventory but is not accepted as the canonical Ministry source until an official Ministry endpoint or authenticated original is located.

## Source and file evidence

- Third-party listing: https://mozkratgahza.com/pdf/7054
- Listing metadata: published 27 October 2026; labels the file as prepared by the Ministry of Education; lists 68 pages and approximately 33 MB.
- Direct download target exposed by the listing: https://drive.usercontent.google.com/download?export=download&id=1x5sXWZ5gIv_YNMymiF_jrSATqvMmekI4
- Library copy inspected: 33,873,471 bytes; 69 PDF pages; SHA-256: 1385118877a70afeca75e8ad4f616b6a4db1ea1a4edb80285297d5de0ef29b43.
- PDF metadata: Creator/Producer PDFsharp 1.50.4000-netstandard; creation/modification timestamp 2026-10-27 14:57:04 UTC; Keywords field names the third-party download site.
- PDF pages 1–68 contain the Ministry-branded assessment book; PDF page 68 is the back cover; PDF page 69 is a promotional advertisement for the third-party site. This explains the listing's 68-page count versus 69 PDF pages.
- The cover reads “Performances et Évaluations — Sciences — Cinquième primaire — Premier semestre” and displays the Ministry seal. The back cover displays a Ministry copyright line, ISBN 978-633-8530-59-4, and 72 printed pages. These are visible imprint markers, not proof that the downloaded file is an untouched Ministry original.
- PDF text extraction returned no readable embedded text; the document is image-based. OCR was sampled on pages 5, 30–32, 42, 44, 48, 52, 58, 61 and 62. A full 69-page OCR and visual review has not been completed.

## Provisional content alignment

The sampled pages contain assessment material that aligns with topics in the 2026–2027 French Science StudentBook:

| Assessment PDF pages | Observed topic | StudentBook chapter alignment | Evidence |
|---:|---|---|---|
| 5 | Muscle contraction/relaxation; arm movement; classroom performance and homework | Chapter 1 — Les os et les muscles | OCR sample |
| 30–32 | Germination, cotyledons, light, fertilizer, air, weekly tests | Chapters 3–4 — Germination and plant growth | OCR sample |
| 42, 44 | Healthy growth, sleep, nutrition, activity; monthly assessment spanning germination and luffa-flower/pollination concepts | Chapters 3–6 | OCR sample |
| 48, 52 | Animal growth, birth, egg-laying, parental care, reproduction | Chapter 7 — Croissance et reproduction des animaux | OCR sample |
| 58, 61–62 | Evaporation, condensation, clouds and the water cycle | Chapter 9 — Le cycle de l’eau | OCR sample |

This establishes only that the sampled pages contain relevant topics. It does not establish full coverage, correct sequencing, exact lesson-to-assessment mapping, answer-key accuracy, or that all nine StudentBook chapters are represented.

## Official-source verification status

- The official StudentBook endpoint is known and separately audited in the verified lesson map.
- No canonical Ministry-hosted endpoint for this French Science assessment book was located in the official blob-storage path or the accessible search results during this run.
- The third-party listing's claim that the file was prepared by the Ministry is not treated as independent authentication.
- The PDFsharp metadata and repeated third-party watermark demonstrate repackaging. The content may be a copy of a Ministry publication, but byte/layout equivalence to an official Ministry original is unverified.
- Do not use this candidate to overwrite, expand or mark any lesson as officially assessed until an authoritative source or a complete page-by-page review is available.

## Next verification work

1. Locate the canonical Ministry assessment-book endpoint or an authenticated school-issued copy.
2. Compare the candidate against that source page by page, recording PDF page count, printed pagination, bytes, SHA-256 and normalized text/OCR fingerprints.
3. Review all assessment prompts, diagrams, weekly/monthly tests and answer keys against the nine-chapter StudentBook.
4. Only then add lesson-level assessment coverage to the official Science registry. No PDF or full extracted text is committed to the repository.
