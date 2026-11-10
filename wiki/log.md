# Wiki change log

Append one entry for each source ingestion, meaningful synthesis update, or consistency check. This log describes wiki maintenance; [docs/decisions.md](../docs/decisions.md) remains the record of student choices.

## [2026-11-08] setup | Initial linked research wiki

- Added an index, source map, measure distinctions, experiment map, open checks, and scoped maintenance instructions.
- Linked existing source-specific notes, study CSVs, experiment READMEs, and decision record. No source files, student prose, sketches, or generated images were changed.
- No new empirical claim was extracted from a paper. Existing notes and CSVs remain the underlying local records; original publications must be consulted for new claims.
- Open: student review of what recurring topics deserve dedicated pages as the project develops.

## [2026-11-09] update | Image gallery link

- Linked the new local [generated image gallery](../experiments/gallery.html) from the [experiment map](experiments.md).
- The gallery is a way to review existing outputs; it adds no new empirical interpretation or creative selection.

## [2026-11-09] update | Run navigation

- Reworked the gallery into an overview and one page per Processing run, with links between runs. Existing output images and source records are unchanged.

## [2026-11-09] update | Gesselman age-model image exploration

- Linked five Table 3 adjusted gender coefficients in a separate [CSV](../data/raw/gesselman-2024-age-model.csv) and three ungenerated [image concepts](../experiments/processing-age/CONCEPTS.md).
- Distinguished these model terms from observed age-specific orgasm rates and from the Frederick percentages. The printed 35–49 confidence interval remains flagged for verification before final use.
- Julia then selected a wide aligned-interval image with red lines, larger estimate marks, labels, and a short source note. The Processing sketch produced a visually checked first export and the gallery now links its run pages. The 35–49 interval is shown as printed with an on-image caveat.

## [2026-11-09] source | Age-specific 0–100% orgasm occurrence

- Added [Herbenick et al. (2010)](../research/notes/herbenick-2010.md) and a separate [Table 3 CSV](../data/raw/herbenick-2010-age-event-orgasm.csv) with ten weighted percentages and printed confidence intervals for five age bands by the paper's men/women categories.
- These rates concern orgasm at one most recent partnered event. They are separate from Gesselman's adjusted model coefficients and Frederick's usually/always frequency figures. No new image was generated.
- Open: verify the public PDF's page image against the CSV before publication; its extracted text is garbled in some unrelated rows. Age-band denominators for the orgasm item remain unverified.

## [2026-11-09] experiment | Age event percentages

- Added a separate [Processing sketch](../experiments/processing-age-event/README.md) and [gallery page](../experiments/gallery/age-event-run-20261109-173549.html) with paired bars and the student's illustrations as value markers. Both use Herbenick's ten 0–100% event-level percentages, a 0/100 axis, and one axis tick per reported value.
- Both PNGs were generated and visually inspected. The earlier Gesselman age experiment and all previous outputs remain intact.

## [2026-11-09] correction | Illustration size

- Julia clarified that each illustration itself, rather than a stem and marker, should encode the percentage. The [new run](../experiments/gallery/age-event-run-20261109-174111.html) scales each full drawing from the shared 0 baseline to its value, preserving aspect ratio. The wider plot fits five pairs without overlap. The first marker run remains available for comparison.
