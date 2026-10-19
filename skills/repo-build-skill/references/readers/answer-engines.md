# Answer engines

Make the repository easy to identify, quote and link. Structured files help a reader retrieve the right facts; they do not promise search placement.

## One identity

Use the same name, lead, description and canonical URLs in README, package metadata, GitHub About and llms.txt. Keep them in `.repo-build/facts.json` and generate repeated surfaces. Use a clear category noun and say what the product gives. Label the canonical repository, package page, documentation and site so a reader can connect the entity across surfaces.

## llms.txt

Follow the [llms.txt proposal](https://llmstxt.org/): an H1, a short blockquote describing the project, useful context and grouped Markdown links. Give every link a descriptive label and an absolute URL. For released instructions use a tag-pinned path; use the package registry for current version queries.

Generate llms.txt from facts and docs headings. Check its lead against the README and its links against shipped files. Treat it as an index, then keep authoritative explanations in the linked documents. Agents may read it during installation even when direct crawler traffic is low.

## Answers worth citing

Write question headings that match a real task. Start with a direct answer, give the runnable command, then link the supporting reference. Separate a measured package result from a documented procedure and a reported field observation. Put dates and expiry beside measurements so an engine can distinguish a current result from an old one.

Provide a comparison only when it helps a decision and each statement has a source. A working install path and a public issue with a reproduction are stronger evidence than a list of keywords.

## Product site handoff

Pass facts to the site's builder. The minimum includes canonical links, crawlable documentation, sitemap, robots policy and relevant structured data. For a software tool, check SoftwareApplication fields such as name, description, applicationCategory, operatingSystem, softwareVersion and license against the published artifact. Use a linked SoftwareSourceCode entity for codeRepository and verify the current schema before generating it. Add offers only when pricing exists and the owner approves it.

Read search-engine and structured-data documentation on the ask date. Record Search Console and Bing Webmaster verification as owner's hands. Track answer-engine queries, returned sources and dates as observations, with failed or empty retrievals included.
