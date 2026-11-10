# Pairing illustration experiment

This separate Processing sketch uses four specific rows from [Hensel et al. (2021), Table 6](https://doi.org/10.1371/journal.pone.0249242), transcribed in `data/raw/hensel-2021-pairing.csv`. It exports four square images and one comparison image into a new timestamped `output/run-*` folder on every run. Earlier Processing experiments are untouched.

The first-pass artwork mapping is provisional for review:

| Technique | Illustration |
| --- | --- |
| Self-applied finger | `IMG_1712.PNG` (vulva drawing) |
| Self-applied toy | `IMG_1731.PNG` (toy drawing) |
| Partner-applied finger | `IMG_1713.PNG` (vulva drawing) |
| Partner-applied toy | `IMG_1732.PNG` (toy drawing) |

The four PNGs in `PairingIllustrations/data/` are copies of the student's originals in `/Users/julia/Desktop/illustrations/`; the originals were not altered. Swap filenames in `ART_FILES` to explore other drawings. The sketch trims transparent margins in memory, without modifying source files.

Each full drawing represents one percentage point on a 100-position grid. Because the published values have one decimal place, the final drawing is clipped to the reported tenth; the remaining positions stay blank. This represents **the weighted percentage of women who reported ever using each technique to orgasm more often or have more pleasurable sex during penetration**. The four percentages overlap and must not be added together. “Solo Pairing” in the source means self-applied clitoral stimulation during penetration, not solo sex. See `research/notes/hensel-2021.md` for wording and sampling limits.

The exports use black line art on white, as requested. Typography is only functional labeling for this test; no typeface or visual identity has been selected.

To rerun the sketch in Processing 4, open `PairingIllustrations/PairingIllustrations.pde` and run it. Each run writes five PNGs and a CSV manifest to a new timestamped folder inside `PairingIllustrations/output/`. The first verified export is `run-20261106-145301/` (four individual images and a 2×2 comparison, each 2400×2400 physical pixels).
