# Project handoff — The Big O

This is Julia's student-led, research-grounded exploration of sexual pleasure and the orgasm gap. The intended form is a vertical, interactive story that incorporates code-generated still and moving images; the thesis, full story order, ending, and final visual styling remain open. Julia makes the creative decisions. Earlier ideas about a conventional scroll article and showing the coding process are background, not the current direction.

Read `AGENTS.md` for project principles, but its initial “stop before styling/animation” boundary predates Julia's later explicit requests for the current styled prototype and Processing experiments. The later decisions are recorded in `docs/decisions.md`.

## Current story prototype

Open `story/index.html` locally. It has a large red-on-white “The Big O” opening, a short provisional introduction, a note about the study's limited categories, and a two-stage study-group choice. Readers choose Female or Male, then Straight/Bisexual/Lesbian or Straight/Bisexual/Gay as applicable. The choices use Julia's drawings. A chosen group reveals a circular 100-dot image: filled dots show its reported percentage; outlined dots complete 100. The dot ring sits beside the two chosen drawings, which animate into the side panel. Readers can change their answer. Labels appear on hover or keyboard focus and remain visible on touch screens. Reduced-motion preferences disable the entrance animation. The page uses plain HTML, CSS, and JavaScript; GSAP was researched but not installed. `story/README.md` explains the implementation. The opening is a prototype, not a finished article.

## Data and image experiments

- `data/raw/frederick-2018.csv` records six percentages for people who said they **usually or always** orgasmed during sexual intimacy in the past month: heterosexual men 95%, gay men 89%, bisexual men 88%, lesbian women 86%, bisexual women 66%, heterosexual women 65%. These are aggregate values from a self-selected sample, not personal predictions. The exact wording of the study's sex/gender survey item is unavailable; the reported categories do not cover all identities.
- `experiments/processing-frederick/` contains Processing 4 sketches and exported dot-image variations for all six groups. `experiments/gender-gap/` is an older, separate scroll experiment.
- `data/raw/hensel-2021-pairing.csv` supports illustration-based Processing experiments in `experiments/processing-pairing/` (repeated drawings) and `experiments/processing-pairing-size/` (drawing area proportional to percentage). Its four selected technique values are 30.9%, 20.1%, 43.1%, and 17.5%. They measure whether women had **ever used** specified self- or partner-applied clitoral stimulation during vaginal penetration to orgasm more often **or** make sex more pleasurable. They are overlapping categories, not four orgasm rates or a total. “Solo pairing” means self-applied stimulation during penetration, not sex alone.
- `experiments/gallery.html` is a local browser for the generated runs, with separate pages and navigation for each run. The source drawings in the Processing sketches are copies of Julia's originals.

## Project records

`wiki/index.md` maps the research, measures, experiments, and unresolved questions. `research/sources.md` and `research/notes/` hold source-specific evidence and access notes. `data/README.md` defines the CSVs and warns against combining different measures or samples. `docs/decisions.md` records Julia's choices and agent changes. `content/story-intro.md` marks the opening prose as draft. The root `index.html` is an earlier reading scaffold; the active story prototype is under `story/`.

The visual references included Pudding stories, Nicholas Felton's 2013 Annual Report, and Julia's own title, choice, and result mockups. The live page uses a temporary system serif and temporary Processing colors. Julia supplied Gramercy trial fonts, but they were not embedded because the trial desktop files are not licensed for live web use. Local browser automation previously could not inspect `file://` pages because of the browser tool's URL policy; code and asset checks passed, but the latest result layout still needs human visual review.
