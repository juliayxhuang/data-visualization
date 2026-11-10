# Data provenance and dictionary

Access date for the public sources: 2026-11-02. Files in `raw/` are small manual transcriptions of published aggregate values, not participant-level data. Each study stays in its own file. No values from different studies have been pooled.

## Files

| File | Source and location | Measure |
| --- | --- | --- |
| `raw/frederick-2018.csv` | [Publisher abstract](https://doi.org/10.1007/s10508-017-0939-z) and Figure 1 in student-supplied PDF | Percentage reporting “usually–always” orgasm when sexually intimate during the past month, by the authors’ six categories. The full PDF confirms the five-point question on printed page 276. |
| `raw/gesselman-2024-age-model.csv` | [Gesselman et al. Table 3](https://academic.oup.com/smoa/article/12/3/qfae042/7702123) | Five age-specific adjusted **gender regression coefficients** and printed 95% confidence intervals. The outcome was a self-estimated 0–100 orgasm rate during sexual intercourse. These coefficients are not the observed rates for men or women in each age group. |
| `raw/herbenick-2010-age-event-orgasm.csv` | [Herbenick et al. Table 3](https://doi.org/10.1111/j.1743-6109.2010.02020.x) | Weighted percentage of men and women reporting orgasm at their most recent partnered sexual event, in five age bands; printed 95% confidence intervals. |
| `raw/armstrong-2012.csv` | [Journal Table 1 and Figure 1](https://doi.org/10.1177/0003122412445802) | Event-level orgasm occurrence and “very much” enjoyment. Table 1 proportions were multiplied by 100 to show percent; Figure 1 values were already reported as percent in the article text. |
| `raw/anderson-2025-online.csv` | [Publisher PDF abstract](https://doi.org/10.1080/00224499.2025.2462988) | Standardized mean difference (Hedges’ g), confidence interval, and p value for two distinct satisfaction outcomes. These are not percentages. |
| `raw/morar-bolba-2025-online.csv` | [PMC Table 1](https://pmc.ncbi.nlm.nih.gov/articles/PMC13094264/) | Participant counts by the paper’s four relationship-type categories. These are sample characteristics, not outcome rates. |
| `raw/hewings-martin-2026-paired-activities.csv` | [Hewings-Martin et al. Table 5](https://link.springer.com/content/pdf/10.1007/s10508-025-03393-y.pdf) | Paired mean **0–5 orgasm-frequency scores** for related solo and partnered activities; each pair has its own sample size. These are not percentages. |
| `raw/hensel-2021-pairing.csv` | [Hensel et al. Table 6](https://pmc.ncbi.nlm.nih.gov/articles/PMC8046227/) | Weighted prevalence of ever using specified combinations of clitoral stimulation and vaginal penetration to orgasm more often **or** make sex more pleasurable. This is technique use, not an orgasm rate. |

## Column meanings

- `measure`: the reported outcome, never a generic “pleasure” variable.
- `group` / `context`: category as described by the study. Do not harmonize across studies without a documented reason.
- `value`: reported aggregate or a conversion specified above.
- `unit`: percent or people. Anderson’s separate `hedges_g` column is a standardized effect size.
- `denominator_n`: group/sample size when the accessible source supplies it; blank means not verified.
- `source_location`: abstract, table, or figure as identified in the publication.
- `notes`: relevant wording, overlap, rounding, or interpretation limits.
- `studies_k`, `ci_lower`, `ci_upper`, and `p_value` in the Anderson file: number of included studies for that outcome, 95% confidence interval bounds, and reported p value. `total_sample_n` is the full review sample, not an outcome-specific denominator.

The Frederick outcome concerns usual frequency during sexual intimacy; Armstrong reports occurrence in one event and a separate enjoyment outcome; Anderson analyzes satisfaction. Gesselman asks for a participant’s estimated percentage of sexual intercourse occasions with orgasm. None of these can be treated as interchangeable. A percentage in one file is not a percentage point difference in another. The Anderson effects must not be converted to percentages.

The Hewings-Martin scores are coded response means. A mean of 3.54 does not mean 3.54 orgasms or 70.8% of encounters. The Hensel “Solo Pairing” label means that the respondent, rather than a partner, provided clitoral touch *during penetration*; it must not be presented as a solo-sex category. Hensel's rows overlap and do not add to 100%. See each source note for exact wording and sampling limits. These two files were accessed and manually transcribed on 2026-11-06.

`raw/` contains no Gesselman observed age-group rates because the published ranges do not identify each age group. The separate model CSV records only Table 3's adjusted coefficients, including the seemingly asymmetric printed 35–49 confidence interval. The age interval experiment reproduces that interval as printed and flags it on the image; verify it with the authors before final use. The other relationship-structure papers and the scoping review currently have no verified outcome table values in this repository. Morar-Bolba has only Table 1 sample counts here.

The Herbenick values are **actual 0–100% event-level percentages**, not estimates of each respondent's usual orgasm rate. The five age bands are 18–24, 25–29, 30–39, 40–49, and 50–59. The `ci_95_*` fields are the paper's printed 95% confidence interval limits. Exact age-band denominators for this outcome are not verified; the overall analyzed sample was 1,931. The public PDF text extraction garbles some table rows, so check the page image before publication. See the [source note](../research/notes/herbenick-2010.md).
