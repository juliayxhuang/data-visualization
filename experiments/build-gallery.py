"""Build the local Processing run gallery without dependencies.

Run from anywhere: python3 experiments/build-gallery.py
Writes experiments/gallery.html and one page per run in experiments/gallery/.
All links work from local file URLs; original PNGs remain in their run folders.
"""

from html import escape
from os.path import relpath
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parent
OVERVIEW = ROOT / "gallery.html"
RUN_PAGES = ROOT / "gallery"

SERIES = (
    {
        "slug": "frederick",
        "title": "Frederick dot images",
        "output": "processing-frederick/FrederickSeries/output",
        "readme": "processing-frederick/README.md",
        "note": "../research/notes/frederick-2018.md",
        "description": "Usually or always orgasming during sexual intimacy, by the study’s six groups. Dots represent percentage points, not respondents.",
    },
    {
        "slug": "pairing-repeated",
        "title": "Pairing: repeated illustrations",
        "output": "processing-pairing/PairingIllustrations/output",
        "readme": "processing-pairing/README.md",
        "note": "../research/notes/hensel-2021.md",
        "description": "Four overlapping technique-use percentages during penetration. These are not observed orgasm rates.",
    },
    {
        "slug": "pairing-area",
        "title": "Pairing: illustration area",
        "output": "processing-pairing-size/PairingSize/output",
        "readme": "processing-pairing-size/README.md",
        "note": "../research/notes/hensel-2021.md",
        "description": "The same four technique-use percentages, encoded by each illustration’s rectangular bounding-box area.",
    },
    {
        "slug": "age-intervals",
        "title": "Age: adjusted model intervals",
        "output": "processing-age/AgeIntervals/output",
        "readme": "processing-age/README.md",
        "note": "../research/notes/gesselman-2024.md",
        "description": "Five age-band gender coefficients with published confidence intervals. These are adjusted model terms, not observed orgasm rates.",
    },
)


def href(from_page: Path, target: Path) -> str:
    relative = Path(relpath(target, from_page.parent)).as_posix()
    return escape(quote(relative, safe="/.-"), quote=True)


def anchor(from_page: Path, target: Path, text: str) -> str:
    return f'<a href="{href(from_page, target)}">{escape(text)}</a>'


def label(path: Path) -> str:
    return path.stem.replace("fixed100", "fixed 100").replace("-", " ").title()


def ordered_images(run: Path) -> list[Path]:
    return sorted(
        run.glob("*.png"),
        key=lambda p: (0 if "comparison" in p.name else 1, p.name),
    )


def figure(page: Path, image: Path, caption: str) -> str:
    image_url = href(page, image)
    return (
        "<figure>"
        f'<a href="{image_url}"><img src="{image_url}" alt="{escape(caption, quote=True)}" '
        'loading="lazy" width="320" height="320"></a>'
        f"<figcaption>{escape(caption)}</figcaption>"
        "</figure>"
    )


def page(title: str, main: str) -> str:
    return """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <title><!-- TITLE --></title>
  <style>
    main { max-width: 1100px; margin: 0 auto; padding: 1rem; }
    nav { margin-block: 1rem 2rem; }
    nav ul { display: flex; flex-wrap: wrap; gap: .5rem 1rem; list-style: none; padding: 0; }
    nav li { white-space: nowrap; }
    .gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 1rem; }
    figure { margin: 0; }
    figure img { display: block; width: 100%; height: auto; }
    figcaption { margin-block-start: .35rem; }
    section { margin-block: 2rem; }
  </style>
</head>
<body>
  <main>
    <!-- MAIN -->
  </main>
</body>
</html>
""".replace("<!-- TITLE -->", escape(title)).replace("<!-- MAIN -->", main)


runs = []
for series in SERIES:
    folders = sorted(p for p in (ROOT / series["output"]).glob("run-*") if p.is_dir())
    for number, folder in enumerate(folders, 1):
        images = ordered_images(folder)
        if not images:
            continue
        item = dict(series)
        item.update(
            folder=folder,
            images=images,
            number=number,
            latest=number == len(folders),
            page=RUN_PAGES / f'{series["slug"]}-{folder.name}.html',
            nav_label=f'{series["title"]} · run {number}' if len(folders) > 1 else series["title"],
        )
        runs.append(item)


def navigation(current_page: Path) -> str:
    items = []
    for target, text in [(OVERVIEW, "All runs")] + [(run["page"], run["nav_label"]) for run in runs]:
        if target == current_page:
            items.append(f'<li><strong aria-current="page">{escape(text)}</strong></li>')
        else:
            items.append(f"<li>{anchor(current_page, target, text)}</li>")
    return '<nav aria-label="Image runs"><ul>' + "".join(items) + "</ul></nav>"


RUN_PAGES.mkdir(exist_ok=True)
for index, run in enumerate(runs):
    current = run["page"]
    previous = anchor(current, runs[index - 1]["page"], "← Previous run") if index else ""
    following = anchor(current, runs[index + 1]["page"], "Next run →") if index + 1 < len(runs) else ""
    pager = f'<p>{previous} {" · " if previous and following else ""} {following}</p>'
    cards = "\n".join(figure(current, image, label(image)) for image in run["images"])
    title = f'{run["title"]} — {run["folder"].name}'
    body = (
        f"<h1>{escape(title)}</h1>"
        + navigation(current)
        + f'<p>{escape(run["description"])}</p>'
        + f'<p>{len(run["images"])} images · {anchor(current, ROOT / run["readme"], "Experiment notes")} · {anchor(current, ROOT / run["note"], "Source note")}</p>'
        + pager
        + f'<div class="gallery">{cards}</div>'
        + pager
    )
    current.write_text(page(title, body), encoding="utf-8")

sections = []
for series in SERIES:
    group = [run for run in runs if run["slug"] == series["slug"]]
    if not group:
        continue
    previews = []
    for run in reversed(group):
        preview = run["images"][0]
        caption = f'{run["folder"].name}{" · latest" if run["latest"] else ""} · {len(run["images"])} images'
        previews.append(
            "<div>"
            + figure(OVERVIEW, preview, caption)
            + f'<p>{anchor(OVERVIEW, run["page"], "View this run")}</p>'
            + "</div>"
        )
    sections.append(
        f'<section><h2>{escape(series["title"])}</h2>'
        f'<p>{escape(series["description"])}</p>'
        f'<div class="gallery">{"".join(previews)}</div></section>'
    )

overview_body = (
    "<h1>Generated images</h1>"
    + "<p>Choose a run to see all its images. Use the navigation on each run page to move between versions.</p>"
    + navigation(OVERVIEW)
    + "\n".join(sections)
    + f'<p>{anchor(OVERVIEW, ROOT / "index.html", "Back to experiments")}</p>'
)
OVERVIEW.write_text(page("Generated images — all runs", overview_body), encoding="utf-8")
print(f"Wrote overview and {len(runs)} run pages with {sum(len(run['images']) for run in runs)} images")
