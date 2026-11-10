# Hensel Pairing question image

This separate Processing experiment reuses the four Table 6 rows in [`data/raw/hensel-2021-pairing.csv`](../../data/raw/hensel-2021-pairing.csv). It keeps the earlier Pairing sketches and exports intact.

The question at the top is an editorial paraphrase of the paper's Pairing measure: women answered yes/no to ever using each form of clitoral touch during vaginal penetration to orgasm more often **or** have more pleasurable sex than penetration alone. The weighted percentages describe technique use, not orgasm rates. The four rows overlap.

The student specified the slimmer finger drawing, `IMG_1744.PNG`, for both self-applied and partner-applied finger rows. The two toy drawings are carried forward from the previous Pairing experiment. The drawings' cropped bounding-box areas are proportional to their percentages; exact values are also printed. Original assets were copied and the copies are recolored in memory to the story's red (`#cf0b2e`).

Run `PairingQuestion/PairingQuestion.pde` in Processing 4. Each run writes an image and a measurement manifest to a new timestamped folder under `PairingQuestion/output/`.

Source: [Hensel et al. (2021), Table 6](https://doi.org/10.1371/journal.pone.0249242.t006), weighted analyzed N = 2,877.
