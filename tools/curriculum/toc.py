#!/usr/bin/env python3
"""
Deterministic table-of-contents extraction.

The ministry PDFs carry a real text layer, so contents can be read directly —
no OCR, no vision API, no quota. Two quirks have to be undone first:

1. Arabic lines are stored in visual order, i.e. with the word order reversed.
   Reversing the words restores logical Arabic.
2. The lam-alef ligature is decomposed into "ا" + "ل" + "ا" style sequences
   ("األ" for "الأ"). These are repaired by table.

Page numbers in the contents are the *printed* numbers. The offset to the PDF
page index is detected per book by finding the most common difference between
a page's printed number and its position.
"""

import re
import unicodedata
from collections import Counter
from typing import Optional

import fitz

# Ligature repairs: NFKC leaves these broken, so fix them explicitly.
LIGATURES = [
    ("األ", "الأ"), ("اإل", "الإ"), ("اآل", "الآ"),
    ("ألا", "ألا"), ("إل", "إل"),
]

ARABIC_RE = re.compile(r"[\u0600-\u06FF]")
# Arabic-Indic (0-9) and Extended Arabic-Indic digits -> ASCII.
DIGITS = str.maketrans("٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹",
                       "01234567890123456789")


def digits(s: str) -> str:
    """Convert Arabic-Indic numerals to ASCII."""
    return unicodedata.normalize("NFKC", s).translate(DIGITS)
# "12. . . . . . . title" — number, dot leader, then the title.
ENTRY_RE = re.compile(r"^\s*(\d{1,4})\s*\.\s*(?:\.\s*){2,}\s*\x03?\s*(.+?)\s*$", re.M)
TITLE_LEADER_RE = re.compile(r"^(.*?)\x03[\s.]*(?:\.\s*){2,}(\d{1,4})\s*$", re.M)
ENGLISH_UNIT_RE = re.compile(r"^(Unit\s+\d+\s*[:.].*|Theme\s+\d+\s*\|.*)$")
UNIT_RE = re.compile(r"(الوحدة|المحور|الوحده)")
DOT_LEADER_RE = re.compile(r"[\s.\u00b7\u2026]*\.{2,}[\s.\u00b7\u2026]*")


def norm(s: str) -> str:
    """Normalise and repair Arabic extracted from these PDFs."""
    s = unicodedata.normalize("NFKC", s)
    for bad, good in LIGATURES:
        s = s.replace(bad, good)
    return s


def fix_visual_order(line: str) -> str:
    """These PDFs store Arabic words in visual order. Reverse the words."""
    if not ARABIC_RE.search(line):
        return line
    words = line.split()
    return " ".join(reversed(words))


# Letters that can precede the definite article (و ف ب ك ل + أ لل). A mid-word
# "ال" after one of these is a real article and must be left alone.
PREFIX_LETTERS = set("وفبكلأ")


def fix_lam_alef(word: str) -> str:
    """
    The lam-alef ligature is stored reversed as "ال" instead of "لا".
    Repair only mid-word occurrences, and never a prefixed article
    (بالمدرسة, والكتاب stay intact).
    """
    if len(word) < 3 or ARABIC_RE.search(word) is None:
        return word
    # Protect a leading definite article, including after a prefix letter.
    protected = 0
    if word.startswith("ال"):
        protected = 2
    elif len(word) > 2 and word[0] in PREFIX_LETTERS and word[1:3] == "ال":
        protected = 3
    head, tail = word[:protected], word[protected:]
    return head + tail.replace("ال", "لا")


def clean_title(raw: str, reverse: bool = True) -> str:
    """
    Reverse defaults to True for dot-leader books, whose lines are stored in
    visual order. Social Studies' primary lines are already logical, so its
    caller passes reverse=False.
    """
    raw = raw.replace("\x03", " ").strip()
    if reverse:
        raw = fix_visual_order(raw)
    # A colon that ended up attached to the wrong side after reversal.
    raw = re.sub(r"\s+:", ":", raw)
    raw = re.sub(r":(\S)", r": \1", raw)
    # Unit headings read "الوحدة: الأولى …" once reversed; the colon belongs
    # after the ordinal: "الوحدة الأولى: …".
    m = re.match(r"^(الوحدة|المحور)\s*:\s*(\S+)\s*(.*)$", raw)
    if m:
        rest = f" {m.group(3)}" if m.group(3) else ""
        raw = f"{m.group(1)} {m.group(2)}:{rest}"
    return re.sub(r"\s{2,}", " ", raw).strip(" .")


def _toks(s: str) -> list[str]:
    return [w.strip(":") for w in s.split()]


def dedupe_echo_line(line: str) -> str:
    """
    Some heading lines carry the title twice: once correct and once reversed,
    run together. When the halves are reverses of each other, keep the one that
    starts with a unit label.
    """
    words = line.split()
    if len(words) < 4 or len(words) % 2:
        return line
    h = len(words) // 2
    # A doubled label ("الوحدة … الوحدة") means the echo is run together.
    for lab in ("الوحدة", "المحور"):
        if line.count(lab) >= 2:
            # Interleaved primary+echo: keep the label and its ordinal only.
            m = re.search(lab + r"\s+(\S+)", line)
            return f"{lab} {m.group(1)}".strip(" :") if m else lab
    if _toks(" ".join(words[h:])) == list(reversed(_toks(" ".join(words[:h])))):
        first, second = " ".join(words[:h]), " ".join(words[h:])
        for cand in (second, first):
            if re.match(r"^(الوحدة|المحور|مراجعة)", cand):
                return cand
        return first
    return line


# Letters only — excludes digits. Covers Arabic and Latin, since the English
# books have their own contents pages.
LETTER_RE = re.compile(r"[\u0621-\u064A A-Za-z]")


def has_title_text(s: str) -> bool:
    """A real title has at least two letters, not just numerals."""
    return len(LETTER_RE.findall(s)) >= 2


def _toc_pages(doc) -> list[int]:
    """
    Pages near the front that look like a table of contents. Two shapes:
    a dot-leader list, or a contents heading with many bare numerals.
    """
    hits = []
    for i in range(min(12, doc.page_count)):
        t = norm(doc[i].get_text())
        if "قائمة المحتوى" in t or "المحتويات" in t or "قائمة املحتوى" in t:
            hits.append(i)
            continue
        if len(ENTRY_RE.findall(t)) >= 3:
            hits.append(i)
            continue
        # Layout B: several lines that are only a page number.
        bare = sum(
            1
            for l in t.split("\n")
            if digits(l).strip(" .-|").isdigit() and l.strip()
        )
        if bare >= 5 and "الدرس" in t:
            hits.append(i)
            continue
        # English books: dot-leader entries after the title.
        if len(TITLE_LEADER_RE.findall(t)) >= 3 or "Table of Contents" in t:
            hits.append(i)
            continue
        # Layout D: two-column contents — a column of page numbers down the
        # left edge, with titles beside them.
        if _looks_two_column(doc[i]):
            hits.append(i)
    return hits


def _looks_two_column(page) -> bool:
    """True when the left edge holds a column of bare page numbers."""
    width = page.rect.width
    band = width * 0.32
    rows: dict[int, bool] = {}
    for w in page.get_text("words"):
        if not w[4].strip():
            continue
        if w[2] <= band and digits(w[4]).strip(" .-|–").isdigit():
            rows[round((w[1] + w[3]) / 2 / 4)] = True
    return len(rows) >= 6


def _detect_offset(doc) -> int:
    """
    Printed page number -> PDF page index offset.
    Scan pages for a bare number and take the most common difference.
    """
    diffs = Counter()
    for i in range(min(60, doc.page_count)):
        lines = [l.strip() for l in doc[i].get_text().split("\n") if l.strip()]
        # Page numbers usually sit in the first or last couple of lines.
        for cand in (lines[:2] + lines[-2:]):
            digits = unicodedata.normalize("NFKC", cand).strip(" .-|")
            if digits.isdigit():
                n = int(digits)
                if 1 <= n <= doc.page_count:
                    diffs[(i + 1) - n] += 1
    return diffs.most_common(1)[0][0] if diffs else 0


def _parse_two_column(doc, page_index: int, offset: int) -> list[dict]:
    """
    Layout D (Arabic Language books): a two-column contents page. Page numbers
    sit in a narrow left band, titles in the right column at the same height.
    Text is already in logical order with full diacritics, so nothing is
    reversed here. Each row pairs a title with the page range beside it.
    """
    page = doc[page_index]
    width = page.rect.width
    words = [w for w in page.get_text("words") if w[4].strip()]
    if not words:
        return []

    # The left band is the number column; everything else is the title column.
    number_band = width * 0.32
    rows: dict[int, list] = {}
    for w in words:
        x0, y0, x1, y1, text = w[0], w[1], w[2], w[3], w[4]
        rows.setdefault(round((y0 + y1) / 2 / 4), []).append((x0, x1, text))

    entries = []
    for key in sorted(rows):
        # Keep the content-stream order: it already yields logical Arabic
        # (right-to-left) word order, so no sorting is needed.
        row = rows[key]
        nums, title_words = [], []
        for x0, x1, text in row:
            if x1 <= number_band:
                nums.append(text)
            else:
                title_words.append(text)
        page_no = _page_from_tokens(nums)
        title = clean_title(" ".join(title_words), reverse=False)
        if page_no is None or not title or not has_title_text(title):
            continue
        # Reject rows that are only stray numbers (e.g. a page-range fragment
        # that drifted past the number band).
        if len(LETTER_RE.findall(title)) < len(re.findall(r"\d", title)) + 2:
            continue
        entries.append(_entry(page_no, title, offset, doc.page_count))

    # A real contents page yields many rows; a stray page does not.
    return entries if len(entries) >= 6 else []


def _page_from_tokens(tokens: list[str]) -> Optional[int]:
    """
    Page number from the left band. Ranges read right-to-left ("9 - 6" is
    pages 6 to 9), so the lowest number is the page the lesson starts on.
    """
    found = [int(digits(t).strip(" .-|–")) for t in tokens if digits(t).strip(" .-|–").isdigit()]
    return min(found) if found else None


def parse_toc(pdf_path: str) -> dict:
    """
    Return {"offset": int, "units": [...], "confidence": str}.
    Two contents layouts occur and both are handled:
      A) "12. . . . . .  title"          (dot leader — Science, Math)
      B) "title" then "12" below it      (Social Studies)
    These PDFs also emit each heading twice, the second copy word-reversed.
    Layout B therefore skips echo lines, and a page is only accepted when
    enough entries survive. A page that yields nothing usable is reported as
    low confidence rather than guessed at.
    """
    doc = fitz.open(pdf_path)
    try:
        offset = _detect_offset(doc)
        units: list[dict] = []
        current: Optional[dict] = None
        accepted = 0

        for i in _toc_pages(doc):
            lines = [norm(l) for l in doc[i].get_text().split("\n")]
            lines = [l.strip() for l in lines if l.strip()]
            page_entries: list[dict] = []
            seen: set[tuple] = set()

            for j, line in enumerate(lines):
                # Layout A
                m = ENTRY_RE.match(line)
                if m:
                    title = clean_title(m.group(2))
                    if title and has_title_text(title):
                        key = (int(m.group(1)), title)
                        if key not in seen:
                            seen.add(key)
                            page_entries.append(_entry(int(m.group(1)), title, offset, doc.page_count))
                    continue

                # Layout B: a bare number, title on a preceding line.
                # Digits in these lines are visual too, so a multi-digit
                # number must be reversed ("٦١" is really 16).
                num = digits(line).strip(" .-|")
                if num.isdigit() and len(num) <= 3:
                    if len(num) > 1:
                        num = num[::-1]
                    title = _preceding_title(lines, j)
                    if title:
                        key = (int(num), title)
                        if key not in seen:
                            seen.add(key)
                            page_entries.append(_entry(int(num), title, offset, doc.page_count))
                    continue

                # Layout C: "Title\x03. . . . . . 12" — dot-leader after title.
                m = TITLE_LEADER_RE.match(line)
                if m:
                    title = clean_title(m.group(1), reverse=False)
                    if title and has_title_text(title):
                        n = int(digits(m.group(2)))
                        key = (n, title)
                        if key not in seen:
                            seen.add(key)
                            page_entries.append(_entry(n, title, offset, doc.page_count))
                    continue

            if len(page_entries) < 4 and _looks_two_column(doc[i]):
                # The flat text had no usable line structure here, so read
                # this page by coordinates instead.
                page_entries = _parse_two_column(doc, i, offset)

            # A two-column page also has a flat-text reading, but it is
            # usually garbled. Prefer whichever reading yields more entries.
            if _looks_two_column(doc[i]):
                coord = _parse_two_column(doc, i, offset)
                if len(coord) > len(page_entries):
                    page_entries = coord

            if len(page_entries) >= 4:
                accepted += len(page_entries)
                for e in page_entries:
                    current = _attach(units, current, e)

            # Unit / mahwar headings on any contents page.
            for line in lines:
                em = ENGLISH_UNIT_RE.match(line.strip())
                if em:
                    current = {"unit": line.strip(), "lessons": []}
                    units.append(current)
                    continue
                if UNIT_RE.search(line) and not ENTRY_RE.match(line):
                    heading = clean_title(
                        DOT_LEADER_RE.sub(" ", dedupe_echo_line(line)), reverse=False
                    )
                    if 2 <= len(heading) <= 90:
                        current = {"unit": heading, "lessons": []}
                        units.append(current)

        units = [u for u in units if u["lessons"]]

        return {
            "offset": offset,
            "units": units,
            "confidence": "high" if accepted >= 8 else ("low" if accepted else "none"),
        }
    finally:
        doc.close()


LABEL_RE = re.compile(r"^(الدرس|الوحدة|المحور|الظاهرة|المفهوم|املفهوم|تعلّم|شارك|تساءل|مشروع)\b")


def _wordbag(s: str) -> frozenset:
    return frozenset(re.findall(r"[\u0600-\u06FF]+", s))


def _is_echo(cand: str, prev: str) -> bool:
    """True when cand is a reversed duplicate of prev (a bidi artefact)."""
    a, b = _wordbag(cand), _wordbag(prev)
    if not a or not b:
        return False
    return a == b


def _preceding_title(lines: list[str], j: int) -> Optional[str]:
    """
    The lesson title for the number at lines[j]. Walk back up to two lines,
    skipping reversed-duplicate echoes and bare labels like "الدرس الأوّل:".
    """
    for k in (j - 1, j - 2):
        if k < 0:
            break
        cand = lines[k].strip()
        if not cand or not has_title_text(cand):
            continue
        if LABEL_RE.match(cand):
            continue
        if k - 1 >= 0 and _is_echo(cand, lines[k - 1]):
            continue
        title = clean_title(dedupe_echo_line(cand), reverse=False)
        if title and has_title_text(title):
            return title
    return None


def _entry(printed: int, title: str, offset: int, page_count: int) -> dict:
    resolved = printed - 1 + offset
    return {
        "title": title,
        "printedPage": printed,
        "page": resolved if 0 < resolved <= page_count else None,
    }


def _attach(units: list, current: Optional[dict], entry: dict) -> dict:
    """Append an entry to the open unit, opening a default one if needed."""
    if current is None:
        current = {"unit": "المحتوى", "lessons": []}
        units.append(current)
    current["lessons"].append(entry)
    return current


if __name__ == "__main__":
    import json
    import sys

    for p in sys.argv[1:]:
        r = parse_toc(p)
        print(f"\n=== {p}  offset={r['offset']}  units={len(r['units'])} ===")
        for u in r["units"]:
            print(f"  {u['unit']}")
            for l in u["lessons"][:6]:
                print(f"     p{l['printedPage']:>4} (pdf {l['page']})  {l['title']}")
