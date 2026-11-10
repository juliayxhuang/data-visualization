# AGENTS.md — Data Visualization Scroll Article

## Project intent
An experimental, research-grounded, scrollable editorial website about the orgasm gap, sexual pleasure, age, sexual orientation, and relationship structure. The exact thesis and title remain undecided. Do not force a conclusion.

This is a student-led design project. The agent is a technical/research assistant, not the creative director.

## Creative ownership — highest priority
- The student makes all meaningful decisions about layout, typography, colors, composition, visual metaphors, transitions, animation, and visualizations.
- Ask before making a design choice, including a seemingly obvious one.
- Do not create charts, decorative visuals, animation, visual identity, or polished UI without explicit direction.
- Build only a minimal, legible, unstyled HTML reading scaffold for now. Use browser defaults wherever possible.
- Offer technical alternatives and tradeoffs without choosing a visual direction.
- Do not replace or reinterpret the student's designs when refactoring.
- Keep experiments separate and reversible; never overwrite prior sketches or experiments.

## Stack
- Start with simple HTML, CSS, and JavaScript unless a concrete need warrants something else.
- The stack is not locked: recommend alternatives with reasons, tradeoffs, and maintenance implications, and get approval before installing dependencies or changing frameworks.
- Do not install D3, GSAP, t-SNE packages, or any other visualization/animation tools yet.
- Prefer clear, accessible, documented code over clever abstractions.

## Source retrieval, copyright, and attribution
- Primary editorial reference: Scientific American, “How to Close the 'Orgasm Gap' for Heterosexual Couples”:
  https://www.scientificamerican.com/podcast/episode/how-to-close-the-orgasm-gap-for-heterosexual-couples/
- Fetch public pages using permitted access methods; obey access restrictions and do not bypass paywalls, bot protections, or site controls.
- Store source URLs, titles, authors, publication dates, access dates, and notes.
- The Scientific American article is a reference, not a license to republish. Do not copy its full text into the website or repository. Keep original editorial writing in Markdown, with only brief, properly attributed quotations where justified.
- Do not paraphrase source passages so closely that they become substitutes for the article.
- If retrieval fails, report the limitation and create a placeholder; do not fabricate a transcript.
- Do not download or reuse images/audio without permission.

## Research integrity
- Keep each study's data and metadata separate. Do not merge results from different samples as if they were a single dataset.
- Distinguish orgasm frequency, sexual enjoyment, sexual satisfaction, and relationship satisfaction.
- Record exact question wording, denominator, sample, dates, groups, units, confidence intervals, limitations, and original table/figure references when available.
- Never invent numbers, sample sizes, statistical significance, or missing subgroup values.
- Flag secondary reporting and unverified values as such; prioritize primary papers.
- Distinguish correlations from causal claims. Note selection bias, nonrepresentative samples, and different definitions of monogamy/CNM.
- Do not silently infer age-specific rates from a published range or convert effect sizes into percentages.
- Use respectful, inclusive language; retain the studies' actual participant categories and explain their limitations.

## Research sources to investigate
1. Frederick et al. (2018), “Differences in Orgasm Frequency Among Gay, Lesbian, Bisexual, and Heterosexual Men and Women”
   https://doi.org/10.1007/s10508-017-0939-z
2. Gesselman et al. (2024), “The Lifelong Orgasm Gap”
   https://pmc.ncbi.nlm.nih.gov/articles/PMC11217024/
3. Armstrong, England & Fogarty (2012), “Accounting for Women's Orgasm and Sexual Enjoyment in College Hookups and Relationships”
   https://doi.org/10.1177/0003122412445802
4. Anderson et al. (2025 online), “Countering the Monogamy-Superiority Myth: A Meta-Analysis”
   https://doi.org/10.1080/00224499.2025.2462988
5. Morar-Bolba, Banse & Conley, “Consensual Non-Monogamy: Considering Sexual Minorities and Moving Away from a Dyadic Conceptualization”
   https://pubmed.ncbi.nlm.nih.gov/42016775/
6. “Sexual Motivation and Satisfaction Among Consensually Non-Monogamous and Monogamous Individuals”
   https://pubmed.ncbi.nlm.nih.gov/32205084/
7. McElroy & Perry (2024), “The Gender Gap in Partnered Orgasm: A Scoping Review of Evidence with Graphical Comparisons”
   https://doi.org/10.1080/00224499.2024.2390672

Verify bibliographic details from original sources; report inaccessible papers rather than guessing.

## File structure (suggested; adapt only with explanation)
- index.html — minimal reading scaffold
- src/main.js — simple content loading or rendering
- src/styles.css — minimal functional CSS only, if necessary
- content/draft.md — original, provisional article text and section placeholders
- content/outline.md — editable story outline and open questions
- research/sources.md — annotated bibliography, links, retrieval status
- research/notes/ — one Markdown file per source
- data/raw/ — source-derived tabular data, preserved separately by study
- data/processed/ — optional cleaned copies with documented transformations
- data/README.md — data dictionary, provenance, caveats
- docs/decisions.md — questions asked, user decisions, and agent contributions

## Current task boundaries
1. Inventory and retrieve permitted research material.
2. Extract verifiable tables, chart values, and notes; save CSV/JSON where suitable.
3. Draft a brief original article outline and clearly marked placeholder sections, not a finished argument.
4. Create a minimal unstyled reading page with placeholders and links/citations.
5. Verify the page loads and report what was completed, unavailable, or needs review.
6. Stop before styling, visualizations, scroll animations, and additional libraries.

## Working style
- Ask targeted questions when creative choices are required.
- Make small, inspectable changes and explain them succinctly.
- Do not overwrite student writing without permission.
- Label any generated prose as draft.
- Log source attribution and data transformations.
- Clearly separate observed data, interpretation, and design ideas.
