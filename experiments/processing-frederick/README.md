# Frederick Processing image series

This standalone Processing sketch generates a student-directed series of data images. It is separate from the earlier browser experiments.

## Source

`FrederickSeries/FrederickSeries.pde` reads `data/raw/frederick-2018.csv` directly from the project. The CSV is not copied. The sketch checks the six expected groups, measure, unit, percent range, and denominators before rendering. The values are published aggregate percentages, not participant-level records. One dot represents one percentage point, not one survey respondent.

## First series

- Two counting methods are generated: **variable** draws one filled dot per percentage point; **fixed100** uses 100 positions, filling the reported percentage and outlining the remainder. Neither method represents individual survey respondents.
- For each counting method, two images show all six groups (straight rows and six concentric rings), and twelve images show each group separately in those two arrangements.
- The square 1200-logical-pixel canvas, dot size, gaps, and six colors are temporary test settings at the top of the sketch. On this Mac's Retina display, the PNGs export at 2400 × 2400 pixels. The student selected dots, both output scopes, those two arrangements, square exports, and one color per group.
- Every run creates a new timestamped folder under `FrederickSeries/output/` with 28 variant PNGs, a four-panel `comparison-sheet.png`, a `manifest.csv`, and a `settings.csv` recording the parameters and palette. Previous runs are preserved.
- Each image includes the measure, group labels, denominator, citation, and a note explaining the dots.

## Run status and next step

Processing 4.5.7 was installed with student approval on 2026-11-06. The official GitHub release DMG matched its published SHA-256 checksum. The Processing CLI compiled and ran the sketch, and the outputs were inspected. To make another run, open `FrederickSeries/FrederickSeries.pde` in Processing and click Run, or use Processing's CLI. The current output is an exploratory test, not a selected final visual direction.

The latest verified run is `FrederickSeries/output/run-20261106-142959/`. Earlier test runs remain in their own timestamped folders.
