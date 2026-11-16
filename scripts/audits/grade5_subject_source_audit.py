#!/usr/bin/env python3
"""Download and fingerprint official Grade 5 2026-27 Term 1 subject PDFs.
Only metadata and normalized per-page text hashes are retained; no PDF or full text is committed.
"""
from __future__ import annotations
import csv, hashlib, json, re, subprocess, tempfile, urllib.error, urllib.request
from datetime import datetime, timezone
from pathlib import Path

OUT = Path("audit-output")
OUT.mkdir(exist_ok=True)
BASE = "https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Primary/Primary5/Term1"
SOURCES = [
    {"id":"english_performance_assessments","subject":"English","track":"English","kind":"performance_assessment","url":f"{BASE}/Book_of_Performance_and_Evaluations/English_prim5_t1_Assmt.pdf"},
    {"id":"math_fr_performance_assessments_candidate","subject":"Mathematics","track":"French","kind":"performance_assessment_candidate","url":f"{BASE}/Book_of_Performance_and_Evaluations/Math_FR_prim5_t1_Assmt.pdf"},
    {"id":"math_fr_performance_assessments_lowercase_candidate","subject":"Mathematics","track":"French","kind":"performance_assessment_candidate","url":f"{BASE}/Book_of_Performance_and_Evaluations/Math_fr_prim5_t1_Assmt.pdf"},
    {"id":"french1_performance_assessments_candidate","subject":"French language","track":"French1","kind":"performance_assessment_candidate","url":f"{BASE}/Book_of_Performance_and_Evaluations/French1_prim5_t1_Assmt.pdf"},
    {"id":"french2_performance_assessments_candidate","subject":"French language","track":"French2","kind":"performance_assessment_candidate","url":f"{BASE}/Book_of_Performance_and_Evaluations/French2_prim5_t1_Assmt.pdf"},
    {"id":"math_fr_student_book","subject":"Mathematics","track":"French","kind":"student_book","url":f"{BASE}/StudentBook/Math_FR_prim5_TR1.pdf"},
    {"id":"english_student_book","subject":"English","track":"English","kind":"student_book","url":f"{BASE}/StudentBook/English_language_prim5_t1.pdf"},
]
for track, filename in [("French1","French1_prim5_tr1"),("French2","French2_prim5_tr1")]:
    for week in range(1, 8):
        SOURCES.append({
            "id":f"{track.lower()}_weekly_assessment_w{week}",
            "subject":"French language","track":track,"kind":"weekly_assessment",
            "week":week,
            "url":f"{BASE}/ClassrHomeAssessmentsTest/{filename}_w{week}.pdf",
        })

def sha256(path: Path) -> str:
    h=hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda:f.read(1024*1024), b""): h.update(chunk)
    return h.hexdigest()

def command(args):
    return subprocess.run(args, check=True, capture_output=True, text=True, errors="replace").stdout

reports=[]
page_rows=[]
toc_reviews=[]
page_text_reviews=[]
with tempfile.TemporaryDirectory(prefix="grade5-source-audit-") as tmp:
    tmpdir=Path(tmp)
    for source in SOURCES:
        item={**source,"retrieved_at_utc":datetime.now(timezone.utc).isoformat(),"http_status":None}
        pdf=tmpdir/(source["id"]+".pdf")
        req=urllib.request.Request(source["url"],headers={"User-Agent":"Amina-Grade5-Curriculum-Audit/1.0"})
        try:
            with urllib.request.urlopen(req,timeout=180) as response:
                item["http_status"]=response.status
                item["content_type"]=response.headers.get("Content-Type")
                with pdf.open("wb") as out:
                    while True:
                        chunk=response.read(1024*1024)
                        if not chunk: break
                        out.write(chunk)
            if pdf.read_bytes()[:5] != b"%PDF-":
                item["result"]="NOT_PDF"
                item["bytes"]=pdf.stat().st_size
            else:
                item["result"]="PDF_RETRIEVED"
                item["bytes"]=pdf.stat().st_size
                item["sha256"]=sha256(pdf)
                info=command(["pdfinfo",str(pdf)])
                metadata={}
                for line in info.splitlines():
                    if ":" in line:
                        k,v=line.split(":",1); metadata[k.strip()]=v.strip()
                item["pdf_metadata"]=metadata
                item["pdf_pages"]=int(metadata.get("Pages","0"))
                extracted=command(["pdftotext","-layout",str(pdf),"-"])
                pages=extracted.split("\f")
                if pages and not pages[-1].strip(): pages.pop()
                ocr_pages_attempted = 0
                ocr_pages_with_text = 0
                ocr_languages = (
                    "fra+eng" if source["subject"] == "Mathematics"
                    else "eng+ara" if source["subject"] == "English"
                    else "fra+ara"
                )
                for page_index, page_text in enumerate(pages):
                    if len(" ".join(page_text.split())) < 20:
                        page_number = page_index + 1
                        prefix = tmpdir / (source["id"] + "-page-" + str(page_number))
                        subprocess.run(
                            ["pdftoppm","-f",str(page_number),"-l",str(page_number),"-r","140","-png","-singlefile",str(pdf),str(prefix)],
                            check=True,capture_output=True
                        )
                        png = Path(str(prefix)+".png")
                        ocr_text = command(["tesseract",str(png),"stdout","-l",ocr_languages,"--psm","6"])
                        pages[page_index] = ocr_text
                        ocr_pages_attempted += 1
                        if len(" ".join(ocr_text.split())) >= 20:
                            ocr_pages_with_text += 1
                        png.unlink(missing_ok=True)
                item["ocr_pages_attempted"] = ocr_pages_attempted
                item["ocr_pages_with_text"] = ocr_pages_with_text
                item["ocr_languages"] = ocr_languages if ocr_pages_attempted else None
                item["extraction_method"] = (
                    "pdftotext -layout with Tesseract OCR fallback for low-text pages"
                    if ocr_pages_attempted else "pdftotext -layout"
                )
                extracted = "\n".join(pages)
                for number, text in enumerate(pages,1):
                    # Full source text is retained only in the one-day Actions artifact
                    # so reviewers can inspect lesson explanations and exercises. It is
                    # never copied to the repository or included in published audit CSVs.
                    page_text_reviews.append("\n\n### " + source["id"] + " — PDF page " + str(number) + "\n" + text.strip() + "\n")
                    normalized=" ".join(text.split())
                    digest=hashlib.sha256(normalized.encode("utf-8")).hexdigest()
                    heading_lines = [re.sub(r"\s+", " ", line).strip() for line in text.splitlines() if line.strip()]
                    heading = " | ".join(line[:100] for line in heading_lines[:3] if len(line) <= 140 and not line.isdigit())
                    page_rows.append({
                        "source_id":source["id"],"subject":source["subject"],
                        "track":source["track"],"kind":source["kind"],
                        "week":source.get("week",""),"pdf_page":number,
                        "page_heading_candidate":heading[:140],
                        "normalized_text_characters":len(normalized),
                        "normalized_text_sha256":digest,
                    })
                item["page_fingerprints_complete"]=(item["pdf_pages"]==len(pages) and len(pages)>0)
                item["text_markers"]={
                    "french_common_words":bool(re.search(r"\b(le|la|les|des|une|et|dans)\b",extracted,re.I)),
                    "english_common_words":bool(re.search(r"\b(the|and|with|from|this)\b",extracted,re.I)),
                    "isbn_marker":bool(re.search(r"ISBN",extracted,re.I)),
                }
        except urllib.error.HTTPError as e:
            item["http_status"]=e.code
            item["result"]="HTTP_ERROR"
            item["error_reason"]=str(e.reason)
        except Exception as e:
            item["result"]="RETRIEVAL_OR_PDF_ERROR"
            item["error_reason"]=f"{type(e).__name__}: {e}"
        reports.append(item)
        if pdf.exists(): pdf.unlink()

report={
    "audit_kind":"official_grade5_2026_2027_term1_source_retrieval_and_page_text_fingerprints",
    "generated_at_utc":datetime.now(timezone.utc).isoformat(),
    "sources_attempted":len(reports),
    "sources_pdf_retrieved":sum(x.get("result")=="PDF_RETRIEVED" for x in reports),
    "sources":reports,
    "limitations":[
        "PDF retrieval and metadata do not authenticate publisher authorship by themselves.",
        "Page hashes cover normalized extracted text only, not visual layout, diagrams, or pedagogical equivalence.",
        "Weekly assessments are evidence of assessment content, not proof of the school's assigned French1/French2 track.",
        "No full PDF or extracted textbook text is retained in the repository."
    ]
}
(OUT/"toc-review.txt").write_text("\n".join(toc_reviews)+"\n",encoding="utf-8")
(OUT/"instructional-page-text-review.txt").write_text("".join(page_text_reviews), encoding="utf-8")
(OUT/"grade5-subject-source-audit.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
with (OUT/"grade5-subject-page-fingerprints.csv").open("w",newline="",encoding="utf-8") as f:
    fields=["source_id","subject","track","kind","week","pdf_page","page_heading_candidate","normalized_text_characters","normalized_text_sha256"]
    w=csv.DictWriter(f,fieldnames=fields); w.writeheader(); w.writerows(page_rows)
with (OUT/"grade5-subject-page-headings.csv").open("w",newline="",encoding="utf-8") as f:
    fields=["source_id","subject","track","kind","week","pdf_page","page_heading_candidate"]
    w=csv.DictWriter(f,fieldnames=fields); w.writeheader()
    w.writerows({key:row.get(key,"") for key in fields} for row in page_rows)
print(json.dumps({
    "sources_attempted":len(reports),
    "sources_pdf_retrieved":report["sources_pdf_retrieved"],
    "results":[{"id":x["id"],"status":x.get("http_status"),"result":x["result"],"pages":x.get("pdf_pages"),"bytes":x.get("bytes")} for x in reports]
},ensure_ascii=False,indent=2))
