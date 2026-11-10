# Gesselman age-model interval experiment

This standalone Processing 4 sketch reads `../../data/raw/gesselman-2024-age-model.csv` and exports a wide image with five aligned intervals. The five dots are adjusted gender coefficients from [Gesselman et al. (2024), Table 3](https://doi.org/10.1093/sexmed/qfae042); the thin lines are the published 95% confidence intervals. The outcome model uses respondents' self-estimated 0–100 orgasm rate during sexual intercourse. These terms are **not observed age-specific orgasm rates**, individual predictions, or a picture of the same people aging over time.

The student's first-run choices were a wide landscape canvas, age labels and numerical values with a short source note, thin red intervals with larger estimate marks, and the story's red `#CF0B2E` on white. Georgia is a temporary system-serif match. This is a styling test, not a final visual direction.

Edit the settings block at the top of `AgeIntervals/AgeIntervals.pde` to vary canvas size, paper and ink colors, font, scale, row spacing, interval weight, estimate diameter, and text sizes. The sketch validates the separate CSV before drawing. Each run writes a PNG, data manifest, and settings CSV into a new timestamped `AgeIntervals/output/run-*` folder. Run it in Processing 4, or from a terminal:

```
/Applications/Processing.app/Contents/MacOS/Processing cli --sketch="/Users/julia/Desktop/data vis/experiments/processing-age/AgeIntervals" --run
```

The first visually checked clean run is `AgeIntervals/output/run-20261109-171135/` (3200 × 1800 PNG on this Mac). The published 35–49 interval is asymmetric around its coefficient; it is reproduced as printed and explicitly flagged in the image. Confirm that interval with the authors before treating its width as a settled estimate. Source details and broader limitations are in `../../research/notes/gesselman-2024.md`.
