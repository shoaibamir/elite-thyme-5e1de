# Working rules for this repo

- **Do not edit code, content (Contentful), or site structure until explicitly and clearly instructed to.** Analysis, audits, reports, and recommendations are always fine to produce without asking. Implementation is not — wait for a clear, specific go-ahead each time, even if a broader plan was discussed earlier.
- This site ranks on page 1 of Google for several terms. Treat every change as high-stakes: explain what you're about to do and why before doing it, and prefer the smallest reversible change that accomplishes the goal.
- Verify changes in a real local build (`npm run build`) before pushing. If a change affects visual layout (CSS, image dimensions, component markup), do not rely on build success alone — flag that it needs visual verification, since a clean build does not guarantee correct rendering.
