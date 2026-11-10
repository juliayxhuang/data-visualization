# Age image series — concepts for Julia to choose from

The student first selected concept exploration, then chose the aligned-interval version. Its first Processing export and editable settings are described in [README.md](README.md). The other structures below remain unbuilt ideas.

## Data that can be encoded

Use the five age-specific **adjusted gender coefficients** from Gesselman et al. (2024), Table 3, in `../../data/raw/gesselman-2024-age-model.csv`. The outcome is a self-estimated 0–100 orgasm rate during sexual intercourse. The five coefficients are about −20.5 to −25.3 outcome-scale points. They are model terms with income, year, orientation, and gender × orientation terms, not five observed orgasm percentages or a person's probability. The study has no published men/women raw rate for each age band. The 35–49 printed interval needs verification before uncertainty is drawn.

## Possible image structures

1. **Five aligned intervals:** one mark per age band on a common −30 to 0 coefficient axis, with the 95% interval shown as a thinner extension. Closest to an analytic graphic; easy to compare all five values, but less pictorial.
2. **A repeated cut or space:** five otherwise identical fields of red marks, each interrupted by an empty region proportional to the absolute coefficient on a shared 0–30 model-point scale. This could feel more like generated art, but the labels and shared scale must make clear that the empty space is a model coefficient, not a share of people.
3. **One print per age band:** the same composition repeated five times, with one parameter driven by the coefficient and optional interval boundaries. The series emphasizes small variation and persistence; side-by-side comparison would need a sixth composite image or a gallery view.

The age bands are independent cross-sectional survey groups. None of these structures should imply that the same people were followed as they aged. The current Frederick 100-dot ring should not be reused unchanged for this measure.

## Suggested generator controls

The aligned-interval sketch now keeps editable settings together at its top and validates the separate study CSV before drawing. The same control pattern could serve later structures; a browser generator could instead use a small `settings.json`.

| Control | Purpose | Initial value/status |
| --- | --- | --- |
| `INK_COLOR` | Main marks and labels | `#CF0B2E`, matching `story/styles.css` |
| `PAPER_COLOR` | Background | `#FFFFFF`, matching the story prototype |
| `CANVAS_WIDTH`, `CANVAS_HEIGHT` | Export shape and resolution | Julia to choose |
| `LAYOUT_MODE` | Aligned intervals, repeated cuts, or five prints | Julia to choose |
| `SCALE_MIN`, `SCALE_MAX` | Shared model-point scale | Proposed −30 to 0; confirm with chosen structure |
| `MARK_SIZE`, `MARK_GAP`, `STROKE_WEIGHT` | Density and line character | Julia to choose |
| `SHOW_INTERVALS` | Whether to draw 95% intervals | On in the first test; the 35–49 interval is reproduced as printed and flagged |
| `LABEL_SIZE`, `LABEL_PLACEMENT` | Age/value/source labels | Julia to choose |
| `RANDOM_SEED`, `JITTER` | Controlled variation, if desired | Default jitter 0 so values stay legible |

Every run should write its own output folder plus a manifest and settings file, as the Frederick generator does. Changing color or mark geometry would not change the source values.
