# Feltron, Processing, and data-to-image exploration

Research note, 2026-11-06. This records technical possibilities, not a selected visual direction.

## Feltron reference

- Nicholas Felton's [2013 Annual Report](https://feltron.com/FAR13.html) analyzes a year of conversations, SMS, calls, email, Facebook messages, and physical mail. It was released August 17, 2014. The report describes using text analysis and visualization to examine communication data and metadata.
- The useful precedent is a repeatable process: collect and describe a dataset, inspect its variables, write rules to turn values into visual marks, and refine the output. Felton has described writing Processing applications that he could audit when the output did not match expectations ([Designing Programs](https://www.creativeapplications.net/theory/designing-programs-theory/)). This does not imply that the 2013 report was generated entirely with Processing.
- Felton also offered a [Processing class](https://www.skillshare.com/en/classes/programming-data-visualizations-a-coding-toolkit-for-processing/1782124914) built around combining CSV importers, structural techniques, debugging, and refinements. The class is a reference, not a required dependency.

## Current Processing capabilities

- The current desktop application is [Processing 4](https://processing.org/download/macos/), a free, open-source sketching environment. No installation has been made for this project.
- [`loadTable()`](https://processing.org/reference/loadTable_) reads CSV/TSV data; [`loadJSONObject()`](https://processing.org/reference/loadJSONObject_) reads a local JSON file or URL.
- [`saveFrame()`](https://processing.org/reference/saveFrame_) exports raster images such as PNG; the built-in [PDF](https://processing.org/reference/libraries/pdf/) and [SVG](https://processing.org/reference/libraries/svg/) libraries export scalable vector graphics.
- A reproducible workflow would keep the original study CSV untouched, validate and transform it in a documented intermediate file if needed, have a sketch read that file, and save each output alongside its source citation and parameters.

## Subject-relevant data routes

1. **Existing published aggregates:** `data/raw/frederick-2018.csv`, `armstrong-2012.csv`, and other study-specific files already offer verified values. They are separate datasets with different measures. These are ready for small standalone experiments, subject to their recorded caveats.
2. **Study-level source data:** [Gesselman et al. (2024)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11217024/) says its dataset and syntax are at [OSF](https://osf.io/xyg6e/). The OSF page returned HTTP 403 via this research route, so its contents, permissions, and format have not been independently inspected. If accessible later, check documentation, consent/reuse terms, and survey weighting before analysis.
3. **Research metadata API:** [PubMed E-utilities](https://www.ncbi.nlm.nih.gov/home/develop/api/) or the [OpenAlex API](https://help.openalex.org/api/) can supply publication metadata for an experiment about the research literature. Their records are **not** orgasm outcome observations; a paper count would answer a different question.
4. **Other public health datasets:** CDC's [National Survey of Family Growth public-use files](https://www.cdc.gov/nchs/nsfg/nsfg-2022-2023-puf.htm) offer related sexual-behavior variables, but no relevant orgasm outcome variable has been verified. Do not use them as a substitute for orgasm-frequency data without checking the codebook and exact questions.

## Open technical choices for the student

- Choose a first data question and a single source before selecting visual rules.
- Decide whether outputs should be individual static images, a series, an interactive generator, or multiple independent experiments.
- Decide whether to use desktop Processing (strong raster/vector export) or browser-based p5.js (easy sharing and interaction). No framework or library change is implied by this note.
