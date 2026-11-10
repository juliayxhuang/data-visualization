# GSAP notes for the story experiment

Checked 2026-11-09 against the official GSAP documentation. No GSAP files or packages have been added to the project.

- [GSAP timelines](https://gsap.com/docs/v3/GSAP/Timeline/) can sequence the exit of one set of illustration elements and the entrance of another, with editable timing and easing. This is a fit if the student chooses a specific transition for the category switch or for parts of a generated image.
- [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) can start, scrub, pin, or reverse a timeline based on scroll position. It would be relevant when the later still and moving image sections are designed. It is not needed for the current immediate category swap.
- [gsap.matchMedia()](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/) supports viewport-specific animation setups and honoring reduced-motion preferences.
- [Installation options](https://gsap.com/docs/v3/Installation/) include npm and a script tag. A script tag would fit this small static project if GSAP is later chosen; npm would make sense if the project gains a build step.

Before adding GSAP, decide which *individual elements* should move, how they should move, and whether the motion follows a click or the reader's scroll. The current six source illustrations are PNGs, so animating separate strokes or symbols would require separate image layers or a vector redraw rather than just animating one image element.
