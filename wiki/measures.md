# What the measures mean

These are source-linked working distinctions, not a combined dataset. The exact questions, denominators, sampling, and caveats live in the [source notes](sources.md) and [data dictionary](../data/README.md).

| Study | Observed measure | Guardrail for interpretation |
| --- | --- | --- |
| [Frederick](../research/notes/frederick-2018.md) | Share answering usually or always about orgasm when sexually intimate in the past month | Percentages describe responses in a self-selected survey, not a count of orgasms or a nationally representative rate. |
| [Gesselman](../research/notes/gesselman-2024.md) | Respondents' estimated percentage of sexual intercourse occasions with orgasm; the local [age CSV](../data/raw/gesselman-2024-age-model.csv) contains adjusted gender coefficients from separate age-band models | Coefficients are model terms, not observed men's or women's rates. A cross-sectional age comparison does not show how the same individuals change as they age. |
| [Herbenick](../research/notes/herbenick-2010.md) | Weighted share reporting orgasm at their most recent partnered sexual event, by men/women and five age bands | Actual percentages on a 0–100 scale, but one event per respondent, not usual orgasm frequency; data collected in 2009 among sexually active U.S. adults aged 18–59. |
| [Armstrong](../research/notes/armstrong-2012.md) | Whether orgasm occurred in a reported event; enjoyment reported separately | Event context and outcome differ from Frederick's usual-frequency question; an association does not establish that a relationship caused an orgasm. |
| [Hensel](../research/notes/hensel-2021.md) | Ever using specific clitoral-touch techniques during vaginal penetration to orgasm more often **or** increase pleasure | Technique-use prevalence is not an orgasm rate. “Solo Pairing” identifies self-applied touch during penetration, not solo sex. Rows overlap and cannot be summed. |
| [Hewings-Martin](../research/notes/hewings-martin-2026.md) | Mean 0–5 orgasm-frequency response for each activity among Flo app respondents | Scores are not percentages; each paired comparison has its own sample. This app sample is not population representative. |
| [Anderson](../research/notes/anderson-2025-online.md) | Standardized effects for sexual satisfaction and relationship satisfaction | Satisfaction outcomes are distinct from each other and from orgasm frequency; effect sizes are not percentages. |
| [Morar-Bolba](../research/notes/morar-bolba-2025-online.md) | Current local CSV holds only participant counts by relationship category | Counts describe the sample, not an outcome. Do not infer satisfaction values from them. |

## Implication for the current experiments

The [Frederick dot series](experiments.md#frederick-image-series) and [Hensel illustration series](experiments.md#pairing-illustration-series) encode different quantities from different samples. They can be discussed together as **choices in translating research into images**, but should not be visually or verbally presented as one comparable rate. This is an interpretation constraint, not a proposed story structure.

## Still to verify

See [open connections and checks](questions.md) and the more detailed [research questions](../research/open-questions.md). Add a new cross-study claim here only after tracing each component to its original study.
