# Age event percentages: two image tests

This standalone Processing 4 sketch reads [Herbenick et al. (2010), Table 3](../../data/raw/herbenick-2010-age-event-orgasm.csv) and makes two wide PNGs in a fresh `output/run-*` directory: paired bars and scaled illustrations. The illustration version uses the student's existing `story/assets/female.png` and `male.png` with no stems. Each illustration's bottom sits on 0 and its top reaches its percentage on the shared axis; original aspect ratios are preserved. Both versions use the story's `#CF0B2E` red on white.

The vertical axis represents the weighted percentage of respondents reporting orgasm at their most recent partnered sexual event. It has only 0% and 100% numeric endpoint labels, with a small tick at each of the ten reported values. Women are first within each pair. The five age bands are **18–24, 25–29, 30–39, 40–49, and 50–59**, as printed in the source; they differ from the age groups in the student's visual reference. The output's `manifest.csv` records the inputs and styling basics.

To change size, spacing, typography, or color, edit the settings at the top of `AgeEventCompare/AgeEventCompare.pde` and the local layout values in `renderScaledIllustrations()`. Run with Processing 4:

```
/Applications/Processing.app/Contents/MacOS/Processing cli --sketch="/Users/julia/Desktop/data vis/experiments/processing-age-event/AgeEventCompare" --run
```

These are study-group rates for one reported event, not heterosexual-only estimates, personal predictions, or Gesselman's usual-rate coefficients. See the [source note](../../research/notes/herbenick-2010.md). The images are visual drafts for student review.
