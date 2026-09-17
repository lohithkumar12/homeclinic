"""Rule-based red-flag triage. Does NOT diagnose."""

from __future__ import annotations

import re

# Phrases checked with word-boundary-ish matching (case-insensitive).
RED_FLAG_PATTERNS: list[tuple[str, str]] = [
    (r"\bchest pain\b", "chest pain"),
    (r"\bheart attack\b", "possible cardiac emergency language"),
    (r"\bpressure in (the )?chest\b", "chest pressure"),
    (r"\bdifficulty breathing\b", "difficulty breathing"),
    (r"\bshortness of breath\b", "shortness of breath"),
    (r"\bcan'?t breathe\b", "can't breathe"),
    (r"\bunable to breathe\b", "unable to breathe"),
    (r"\bunconscious\b", "unconscious"),
    (r"\bunresponsive\b", "unresponsive"),
    (r"\bpassed out\b", "passed out"),
    (r"\bheavy bleeding\b", "heavy bleeding"),
    (r"\bsevere bleeding\b", "severe bleeding"),
    (r"\bbleeding won'?t stop\b", "bleeding won't stop"),
    (r"\bstroke\b", "stroke-like language"),
    (r"\bface drooping\b", "face drooping"),
    (r"\bslurred speech\b", "slurred speech"),
    (r"\bsudden weakness\b", "sudden weakness"),
    (r"\banaphylaxis\b", "anaphylaxis"),
    (r"\bsevere allergic reaction\b", "severe allergic reaction"),
    (r"\bthroat swelling\b", "throat swelling"),
    (r"\bsuicidal\b", "crisis language"),
    (r"\bkill myself\b", "crisis language"),
    (r"\bwant to die\b", "crisis language"),
    (r"\bseizure not stopping\b", "prolonged seizure language"),
    (r"\bvomiting blood\b", "vomiting blood"),
    (r"\bblack stools?\b", "black stools"),
]


def check_red_flags(*texts: str) -> tuple[bool, list[str]]:
    combined = " ".join(t or "" for t in texts).lower()
    reasons: list[str] = []
    for pattern, label in RED_FLAG_PATTERNS:
        if re.search(pattern, combined, flags=re.IGNORECASE):
            if label not in reasons:
                reasons.append(label)
    return (len(reasons) > 0, reasons)
