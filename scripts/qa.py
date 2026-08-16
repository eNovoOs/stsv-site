#!/usr/bin/env python3
"""
Controle qualite du site construit.

Analyse la sortie de `npm run build` (dist/client) et signale ce qui casse
en production : liens morts, documents absents, incoherences entre les trois
langues, balises SEO manquantes, problemes d'accessibilite.

Usage :  python3 scripts/qa.py [chemin/vers/dist/client]
Sortie :  rapport texte + code de sortie 1 si des erreurs bloquantes existent.
"""
import json
import os
import re
import sys
from collections import defaultdict
from html import unescape
from pathlib import Path
from urllib.parse import unquote, urlparse

from bs4 import BeautifulSoup

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else "dist/client").resolve()

# Gravite : ERROR casse le site, WARN merite un oeil, INFO est indicatif.
findings = defaultdict(list)


def add(level, category, page, detail):
    findings[level].append((category, page, detail))


def rel(p: Path) -> str:
    return "/" + str(p.relative_to(ROOT)).replace("index.html", "").rstrip("/")


def url_to_path(href: str) -> Path | None:
    """Traduit une URL interne en fichier sur le disque."""
    clean = unquote(urlparse(href).path)
    if not clean.startswith("/"):
        return None
    target = ROOT / clean.lstrip("/")
    if target.is_dir():
        return target / "index.html"
    if target.suffix:
        return target
    # Route sans extension -> dossier/index.html
    return target.with_suffix("") / "index.html" if not target.exists() else target


pages = sorted(ROOT.rglob("*.html"))
docs = {p.name for p in ROOT.rglob("*.pdf")}

# Le mini-site de la carte vit dans /carte/ et n'utilise pas le système i18n
# d'Astro. À ne pas confondre avec /carte-acces et /carte-des-arrets.
STANDALONE = ("/carte", "/carte/")


def is_standalone(page: str) -> bool:
    return page == "/carte" or page.startswith("/carte/")


def hidden_from_a11y(el) -> bool:
    """Un élément `hidden` ou aria-hidden ne parvient pas au lecteur d'écran."""
    for parent in [el, *el.parents]:
        if getattr(parent, "attrs", None) is None:
            continue
        if parent.has_attr("hidden") or parent.get("aria-hidden") == "true":
            return True
    return False


def named_by_ancestor(img) -> bool:
    """L'image est-elle déjà décrite par le bouton ou le lien qui la contient ?"""
    holder = img.find_parent(["a", "button"])
    if not holder:
        return False
    return bool(holder.get("aria-label") or holder.get("aria-labelledby")
                or holder.get_text(strip=True))

# ---------------------------------------------------------------- collecte
meta = {}          # page -> {title, description, canonical, lang, hreflang}
anchors = {}       # page -> set d'id disponibles
outlinks = []      # (page, href)

for f in pages:
    soup = BeautifulSoup(f.read_text(encoding="utf-8", errors="replace"), "lxml")
    page = rel(f)

    html_tag = soup.find("html")
    lang = html_tag.get("lang") if html_tag else None

    robots = soup.find("meta", attrs={"name": "robots"})
    noindex = "noindex" in (robots.get("content", "") if robots else "")

    title = soup.title.get_text(strip=True) if soup.title else ""
    desc_tag = soup.find("meta", attrs={"name": "description"})
    desc = desc_tag.get("content", "").strip() if desc_tag else ""
    canon = soup.find("link", rel="canonical")
    canon = canon.get("href") if canon else None

    hreflang = {
        l.get("hreflang"): l.get("href")
        for l in soup.find_all("link", rel="alternate")
        if l.get("hreflang")
    }

    meta[page] = dict(title=title, desc=desc, canon=canon, lang=lang,
                      hreflang=hreflang, file=f)
    anchors[page] = {e["id"] for e in soup.find_all(id=True)}

    # --- accessibilite ---------------------------------------------------
    for img in soup.find_all("img"):
        if img.get("alt") is None:
            add("ERROR", "a11y", page, f"<img> sans attribut alt : {img.get('src', '?')[:70]}")
        elif not img["alt"].strip() and not named_by_ancestor(img):
            # alt vide légitime si le lien ou le bouton porte déjà le nom.
            add("INFO", "a11y", page, f"alt vide sans nom alternatif : {img.get('src', '?')[:70]}")
        if not img.get("width") and not img.get("height"):
            add("INFO", "perf", page, f"<img> sans dimensions, risque de saut de mise en page : {img.get('src','?')[:60]}")

    # Seuls les <h1> réellement exposés comptent : le 404 rend les trois
    # langues mais en masque deux.
    h1s = [h for h in soup.find_all("h1") if not hidden_from_a11y(h)]
    if len(h1s) == 0:
        add("ERROR", "a11y", page, "aucun <h1> visible")
    elif len(h1s) > 1:
        add("WARN", "a11y", page, f"{len(h1s)} <h1> exposes (un seul attendu)")

    levels = [int(h.name[1]) for h in soup.find_all(re.compile("^h[1-6]$"))]
    for prev, cur in zip(levels, levels[1:]):
        if cur > prev + 1:
            add("WARN", "a11y", page, f"saut de niveau h{prev} -> h{cur}")
            break

    for field in soup.find_all(["input", "select", "textarea"]):
        if field.get("type") in ("hidden", "submit", "button"):
            continue
        fid = field.get("id")
        labelled = (
            (fid and soup.find("label", attrs={"for": fid}))
            or field.get("aria-label")
            or field.get("aria-labelledby")
            or field.find_parent("label")
        )
        if not labelled:
            add("ERROR", "a11y", page,
                f"champ sans etiquette : <{field.name} name={field.get('name')}>")

    for a in soup.find_all("a"):
        text = a.get_text(strip=True) or a.get("aria-label", "")
        if not text and not a.find("img") and not a.find("svg"):
            add("WARN", "a11y", page, f"lien sans texte : {a.get('href', '?')[:60]}")
        if a.get("target") == "_blank" and "noopener" not in (a.get("rel") or []):
            add("WARN", "securite", page, f"target=_blank sans rel=noopener : {a.get('href','?')[:60]}")

    # --- liens ------------------------------------------------------------
    for a in soup.find_all("a", href=True):
        outlinks.append((page, a["href"]))

    # --- JSON-LD ----------------------------------------------------------
    for s in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(s.string or "")
        except (json.JSONDecodeError, TypeError) as e:
            add("ERROR", "seo", page, f"JSON-LD invalide : {e}")
            continue
        # Un document @graph est valide : les @type vivent dans ses noeuds.
        nodes = []
        for block in (data if isinstance(data, list) else [data]):
            if isinstance(block, dict):
                nodes.extend(block["@graph"] if isinstance(block.get("@graph"), list) else [block])
        for node in nodes:
            if isinstance(node, dict) and "@type" not in node:
                add("WARN", "seo", page, f"noeud JSON-LD sans @type : {list(node)[:4]}")

    # --- restes de l'ancien site -----------------------------------------
    raw = f.read_text(encoding="utf-8", errors="replace")
    for pattern, label in [
        (r"gohighlevel|msgsndr|leadconnector", "reste GoHighLevel"),
        (r"lorem ipsum", "texte de remplissage"),
        (r"\bTODO\b|\bFIXME\b|\bXXX\b", "marqueur de travail"),
        (r"undefined(?![\w-])", "valeur 'undefined' rendue"),
        (r"\[object Object\]", "objet mal serialise"),
        (r"NaN(?![\w-])", "valeur NaN rendue"),
    ]:
        if re.search(pattern, raw, re.I):
            add("ERROR" if "undefined" in pattern or "object" in pattern else "WARN",
                "contenu", page, label)

    # --- SEO --------------------------------------------------------------
    if not lang:
        add("ERROR", "a11y", page, "attribut lang absent sur <html>")

    # Les pages en noindex (404, mini-site de la carte) n'ont pas à porter
    # de balises destinées aux moteurs : les controler serait du bruit.
    if not noindex:
        if not title:
            add("ERROR", "seo", page, "titre absent")
        elif not (15 <= len(title) <= 65):
            add("WARN", "seo", page, f"titre de {len(title)} caracteres (viser 15-65) : {title[:60]}")
        if not desc:
            add("ERROR", "seo", page, "meta description absente")
        elif not (70 <= len(desc) <= 165):
            add("WARN", "seo", page, f"description de {len(desc)} caracteres (viser 70-165)")
        if not canon:
            add("WARN", "seo", page, "canonical absent")
        if not soup.find("meta", property="og:title"):
            add("WARN", "seo", page, "og:title absent")
        if not soup.find("meta", property="og:image"):
            add("WARN", "seo", page, "og:image absent")

# ---------------------------------------------------------------- liens
for page, href in outlinks:
    if href.startswith(("http://", "https://", "mailto:", "tel:", "javascript:")):
        continue
    if href.startswith("#"):
        if href[1:] and href[1:] not in anchors[page]:
            add("ERROR", "liens", page, f"ancre inexistante : {href}")
        continue
    target = url_to_path(href)
    if target is None:
        add("WARN", "liens", page, f"lien relatif inattendu : {href}")
        continue
    if not target.exists():
        alt = ROOT / unquote(urlparse(href).path).lstrip("/") / "index.html"
        if not alt.exists():
            add("ERROR", "liens", page, f"cible inexistante : {href}")
    if href.endswith(".pdf") and Path(unquote(href)).name not in docs:
        add("ERROR", "documents", page, f"PDF absent : {href}")

# ---------------------------------------------------------------- i18n
def family(page: str) -> str:
    """Cle commune aux trois versions d'une meme page, via hreflang."""
    hl = meta[page]["hreflang"]
    return "|".join(sorted(hl.values())) if hl else page


groups = defaultdict(dict)
for page, m in meta.items():
    if is_standalone(page):   # mini-site de la carte, hors systeme i18n
        continue
    groups[family(page)][m["lang"] or "?"] = page

for key, langs in groups.items():
    if key.startswith("/"):
        continue
    missing = {"fr", "en-CA", "es"} - {l.split("-")[0] if l.split("-")[0] != "en" else l
                                       for l in langs}
    have = {l.split("-")[0] for l in langs}
    if len(have) < 3 and len(langs) > 1:
        add("WARN", "i18n", ", ".join(langs.values()),
            f"famille incomplete, langues presentes : {sorted(have)}")

# hreflang reciproque
for page, m in meta.items():
    if not m["hreflang"]:
        continue
    if "x-default" not in m["hreflang"]:
        add("INFO", "i18n", page, "hreflang sans x-default")

# titres et descriptions dupliques entre pages de meme langue
by_lang = defaultdict(lambda: defaultdict(list))
for page, m in meta.items():
    if is_standalone(page):
        continue
    by_lang[m["lang"]]["t:" + m["title"]].append(page)
    by_lang[m["lang"]]["d:" + m["desc"]].append(page)

for lang, buckets in by_lang.items():
    for key, plist in buckets.items():
        if len(plist) > 1 and key[2:]:
            kind = "titre" if key.startswith("t:") else "description"
            add("WARN", "seo", ", ".join(plist), f"{kind} identique en {lang} : {key[2:][:60]}")

# fuite de langue : mots-outils francais sur une page espagnole ou anglaise
LEAKS = {
    "es": [r"\bnous\b", r"\bvotre\b", r"\bhoraire\b", r"\bavec\b", r"\bpour vous\b"],
    "en": [r"\bnous\b", r"\bvotre\b", r"\bhoraires?\b", r"\bavec\b"],
}
for page, m in meta.items():
    lang = (m["lang"] or "")[:2]
    if lang not in LEAKS or is_standalone(page):
        continue
    soup = BeautifulSoup(m["file"].read_text(encoding="utf-8"), "lxml")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    body = soup.find("body")
    text = unescape(body.get_text(" ", strip=True)) if body else ""
    for pat in LEAKS[lang]:
        hit = re.search(pat, text, re.I)
        if hit:
            ctx = text[max(0, hit.start() - 45):hit.end() + 45]
            add("WARN", "i18n", page, f"francais possible sur page {lang} : «...{ctx}...»")
            break

# ---------------------------------------------------------------- rapport
ORDER = ["ERROR", "WARN", "INFO"]
LABEL = {"ERROR": "ERREURS", "WARN": "AVERTISSEMENTS", "INFO": "INDICATIONS"}

print(f"\nQA — {len(pages)} pages HTML, {len(docs)} PDF, {len(outlinks)} liens analyses")
print("=" * 78)

for level in ORDER:
    items = findings[level]
    print(f"\n{LABEL[level]} : {len(items)}")
    if not items:
        print("  aucun")
        continue
    grouped = defaultdict(list)
    for cat, page, detail in items:
        grouped[cat].append((page, detail))
    for cat in sorted(grouped):
        print(f"\n  [{cat}] {len(grouped[cat])}")
        seen = set()
        for page, detail in grouped[cat]:
            key = (detail[:70])
            if key in seen and len(grouped[cat]) > 12:
                continue
            seen.add(key)
            print(f"    {page:<38} {detail}")

print("\n" + "=" * 78)
sys.exit(1 if findings["ERROR"] else 0)
