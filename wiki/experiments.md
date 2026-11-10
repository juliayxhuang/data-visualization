# Experiment map

This is a technical map of existing work. It does not select which work belongs in a future story or how it should look. Student-approved choices are recorded in the [decision log](../docs/decisions.md).

The [generated image gallery](../experiments/gallery.html) lists every Processing run and links to a separate image page for each one.

## Frederick image series

- [Sketch and README](../experiments/processing-frederick/README.md) read the [Frederick CSV](../data/raw/frederick-2018.csv), whose source details are in the [Frederick note](../research/notes/frederick-2018.md).
- The student chose six groups, dots, straight rows and concentric rings, square outputs, and a temporary color per group. A later run compares variable counts with fixed 100 positions. See the experiment README for verified output location and encoding details.
- One dot represents a percentage point, not an individual respondent. See [measures](measures.md).

## Pairing illustration series

- [Repeated-drawing experiment](../experiments/processing-pairing/README.md) and [area-scaled experiment](../experiments/processing-pairing-size/README.md) both read four rows of the [Hensel CSV](../data/raw/hensel-2021-pairing.csv). The [Hensel note](../research/notes/hensel-2021.md) gives the exact question and sample.
- The repeated version creates four single-technique images plus a 2×2 comparison; the size version creates one 2×2 comparison with each drawing's rectangular bounds scaled by percentage. The illustration-to-technique mapping is provisional for student review.
- The reported percentages concern ever using a technique to orgasm more often **or** have more pleasurable sex during penetration. They are overlapping technique-use shares, not four parts of a whole and not observed orgasm rates. See [measures](measures.md).

## Age image concepts

- [Concept sheet](../experiments/processing-age/CONCEPTS.md) compares possible ways to encode the five adjusted age-band coefficients in the [Gesselman CSV](../data/raw/gesselman-2024-age-model.csv). Julia chose an aligned-interval first test; its [sketch, export, and settings](../experiments/processing-age/README.md) are separate from earlier runs.
- The first export uses the story's `#CF0B2E` on white. The 35–49 published confidence interval is rendered as printed and visibly flagged for verification before final use. See the [Gesselman note](../research/notes/gesselman-2024.md).

## Age event-percentage image tests

- [Two-version Processing sketch](../experiments/processing-age-event/README.md) uses [Herbenick et al. Table 3](../data/raw/herbenick-2010-age-event-orgasm.csv) and produces paired bars and proportionally sized illustrations for five age bands. The [current gallery page](../experiments/gallery/age-event-run-20261109-174111.html) shows both images. An [earlier marker experiment](../experiments/gallery/age-event-run-20261109-173549.html) remains available.
- **Observed result:** each rate is the weighted share reporting orgasm at the most recent partnered event. These are 0–100% age-group percentages for the study's men/women categories, not heterosexual-only or usual-frequency rates.
- **Interpretation:** the two images encode the same values with different marks. In the new illustration version, drawing height equals the reported percentage of the shared 0–100 plot height; aspect ratios remain intact. The student has not selected a final version.
- **Open question:** which mark and any further style changes best fit the larger project? See the [source note](../research/notes/herbenick-2010.md) before using either image in the article.

## Earlier browser experiments

- The [browser experiment README](../experiments/README.md) documents the student-directed gender-gap scroll test and separate concept placeholders. Those experiments are preserved; inclusion in the future experience remains undecided.

## Future work

The student has mentioned separate sound and motion coding experiments. Their data, behavior, and role in the story are not documented yet. Add links here when those artifacts exist; do not infer their meaning from this page.
