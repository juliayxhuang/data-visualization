# Hensel Pairing landscape

This separate Processing experiment preserves the earlier Pairing sketches and exports. It uses the same four Table 6 rows from [`data/raw/hensel-2021-pairing.csv`](../../data/raw/hensel-2021-pairing.csv).

The student requested a wide landscape with one row of four illustrations, a centered title, the story's Georgia serif, and equal illustration size. The sketch gives each cropped drawing the same rectangular bounding-box area while preserving its aspect ratio. Numbers, not drawing size, show the percentages.

The slimmer finger drawing, `IMG_1744.PNG`, appears for both finger techniques. The two toy drawings and project red (`#cf0b2e`) carry over from the prior run. Source PNGs are copied, and recoloring occurs in memory.

The percentages are weighted shares of U.S. women who reported ever using each technique during vaginal penetration to orgasm more often **or** make sex more pleasurable than penetration alone. They are not orgasm rates, and techniques overlap. Source: [Hensel et al. (2021), Table 6](https://doi.org/10.1371/journal.pone.0249242.t006), analyzed N = 2,877.

Run `PairingLandscape/PairingLandscape.pde` in Processing 4. Each run writes an image and measurement manifest into a new timestamped `output/run-*` folder.
