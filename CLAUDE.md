# Working rules for this repo

- **Do not edit code, content (Contentful), or site structure until explicitly and clearly instructed to.** Analysis, audits, reports, and recommendations are always fine to produce without asking. Implementation is not — wait for a clear, specific go-ahead each time, even if a broader plan was discussed earlier.
- This site ranks on page 1 of Google for several terms. Treat every change as high-stakes: explain what you're about to do and why before doing it, and prefer the smallest reversible change that accomplishes the goal.
- Verify changes in a real local build (`npm run build`) before pushing. If a change affects visual layout (CSS, image dimensions, component markup), do not rely on build success alone — flag that it needs visual verification, since a clean build does not guarantee correct rendering.

## Content writing: humanized and SEO-driven

Every page/post rewrite on this site should follow both of these together, not one at the expense of the other:

- **Real facts only, never fabricated.** Use only details already established elsewhere on the site or given by the user (e.g. Government of Abu Dhabi license, Abu Dhabi Chamber of Commerce membership, team background from major logistics companies, real transit-time ranges). Never invent statistics, testimonials, credentials, or specifics to fill space.
- **No filler.** Cut generic padding that doesn't serve the reader or the ranking — Wikipedia-style stats about a city's population/area, vague "choose wisely" advice, boilerplate mission statements. If a sentence doesn't inform or persuade, it doesn't belong.
- **Specific over generic.** "Licensed by the Government of Abu Dhabi and a Chamber of Commerce member" beats "a reputed, established provider." Genuine specifics both read better and differentiate from competing pages/companies using the same generic language.
- **Structure for the query, not just the topic.** A "best cargo service" query wants comparison/trust content (what to check, how we measure up) — different from a "cargo from X" query, which wants logistics/pickup-area content. Match the content's actual structure to real search intent, confirmed via GSC query data where possible, not just a generic template.
- **Natural keyword use, never stuffed.** A term should appear where it reads naturally, once or twice — not repeated to force density. Sitewide locality names are the same rule: one real mention beats a stuffed list (see the earlier keyword-stuffing cleanup this site needed).
- **Before rewriting a page that already ranks, check its real GSC position/impressions first.** If it has earned real equity (impressions, decent position), rewrite the content in place on the same URL rather than merging/redirecting it away — a redirect forfeits accumulated trust that a same-URL content fix preserves. Only merge/canonicalize into another page when the page truly has no distinct value and a clearly stronger page already serves the same intent (verify with real GSC data, not assumption).
- Run `content_humanize.py` (or equivalent AI-phrasing/watermark check, if available) on new or rewritten content before publishing.
