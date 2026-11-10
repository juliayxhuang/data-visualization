# Visualization experiments

These pages are separate sandboxes. The gender-gap scroll experiment implements the student's supplied screenshot and icon files. The other four pages remain browser-default concept placeholders. No experiment is integrated into the article.

## Generated image gallery

Open `gallery.html` to choose among all Processing runs. Each run has its own page in `gallery/`, with a navigation bar for switching runs, previous/next links, and thumbnails that open full-size PNGs. The overview shows one preview per run. The pages use browser-default typography and colors with a simple responsive grid for browsing; they are not a proposed article design. They work from local file URLs with no server or dependency. After making new Processing exports, run `python3 experiments/build-gallery.py` from the project root to refresh the overview and run pages.

## Open

Open `experiments/index.html` directly in a browser, or follow the **Experiments** link on the article homepage. The five links in the index open independently accessible HTML pages. No server or build step is required.

## Edit locations

| Page | Future concept | Edit here |
| --- | --- | --- |
| `gender-gap/index.html` | Student-designed 95% / 65% scroll reveal | `gender-gap/config.js` for values; `gender-gap/scroll.js` for reveal logic; `gender-gap/styles.css` for layout and scroll distance; `gender-gap/assets/` for supplied icons |
| `gender-orientation/01-dot-matrix.html` | 100-unit dot matrix per group | That HTML page only |
| `gender-orientation/02-dot-plot.html` | Shared 0–100% dot plot | That HTML page only |
| `gender-orientation/03-typography.html` | Numeric typography and percentage-point difference | That HTML page only |
| `gender-orientation/04-bars.html` | Aligned horizontal bars | That HTML page only |

## Gender-gap scroll experiment

`config.js` stores the two Frederick percentages. `scroll.js` creates one icon per percentage unit and maps scroll progress to a shared count from 0 to 95. The women's group appears first and stops at 65, while the men's group continues to 95. The groups sit side by side when space permits, with at most 20 icons per line in each; on narrow phones they stack. The composition is centered, and hovering over or focusing a gender symbol reveals its group label. Scrolling upward reverses the count. Users who request reduced motion see all icons immediately.

In `styles.css`, `--reveal-distance` sets the scroll distance over which the count increases; a larger value makes each icon require more scrolling. The 20-column icon grid and phone stacking breakpoint are also in that file. To reuse the experiment in the article later, move the section markup and the three linked files into the article while preserving their paths or updating the references. No integration has been done yet.

## Data and interpretation

All five pages link to the existing `../data/raw/frederick-2018.csv`; there is no duplicate data file. The six values are aggregate percentages of participants in each reported group who answered **usually or always** to the paper's question about orgasm when sexually intimate in the past month. The exact item, five-point response scale, group counts, survey recruitment, and limitations are recorded in `../research/notes/frederick-2018.md`. Source: [Frederick et al. (2018)](https://doi.org/10.1007/s10508-017-0939-z), Figure 1 and Table 1, checked against the student-supplied full PDF.

A 100-unit representation would show a percentage, not 100 individual people. The six groups have very different sample sizes. The sample was self-selected through an NBC News website survey of adults in relationships who reported intimacy in the past month. Avoid implying representative national estimates, a causal explanation, or individual-level observations.

## Decisions reserved for the student

Choose whether the scroll experiment belongs in the article. Decide the layout, typography, colors, marks, ordering, and interaction for the remaining concept pages before implementation. Keep experiment work separate and reversible.
