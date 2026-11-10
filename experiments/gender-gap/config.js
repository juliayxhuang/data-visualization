// Aggregate percentages from Frederick et al. (2018), Figure 1.
// Group sample sizes are from Table 1 in the student-supplied PDF.
// These units represent percentage points, not individual respondents.
window.orgasmGapExperimentConfig = Object.freeze({
  source: 'https://doi.org/10.1007/s10508-017-0939-z',
  groups: Object.freeze([
    Object.freeze({ id: 'heterosexual-women', label: 'Heterosexual women', percent: 65, sampleSize: 24102 }),
    Object.freeze({ id: 'heterosexual-men', label: 'Heterosexual men', percent: 95, sampleSize: 26032 })
  ])
});
