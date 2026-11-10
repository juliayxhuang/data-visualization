# Pairing illustrations scaled by area

This is a separate Processing experiment using the same four specific rows from [Hensel et al. (2021), Table 6](https://doi.org/10.1371/journal.pone.0249242) and the same provisional illustration mapping as `experiments/processing-pairing/`. The earlier repeated-illustration sketch and all of its exports are unchanged.

The student chose one square 2×2 comparison with illustration **area** proportional to the reported percentage. The sketch trims transparent margins in memory, then scales each drawing so the rectangular bounds of the visible artwork have area `percentage × one shared area constant`. The actual black line area varies by drawing and is not the encoded quantity. Exact percentages are printed beside the art. The four percentages overlap; they are not parts of a single 100% total.

The percentages measure the weighted share of U.S. women who reported **ever using** each form of clitoral stimulation during vaginal penetration to orgasm more often **or** have more pleasurable sex than penetration alone. They are not measured orgasm rates. “Solo Pairing” means self-applied stimulation during penetration, not solo sex. Details are in `research/notes/hensel-2021.md`.

Run `PairingSize/PairingSize.pde` in Processing 4. It writes a PNG and measurement manifest into a new timestamped `PairingSize/output/run-*` folder. The four copied PNGs in the sketch's `data/` folder are the student's original artwork; the originals in `/Users/julia/Desktop/illustrations/` were not modified.

The verified first export is `PairingSize/output/run-20261106-150137/`: one 2400×2400 PNG and a manifest. The manifest's bounding-box areas divided by their percentages agree across all four rows to the displayed precision.
