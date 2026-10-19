# Product site

## GOAL

Prepare the minimum site brief and hand website construction to its owning method.

## NEEDS

Facts, release or planned release, proof rows and stable documentation URLs. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| SoftwareApplication properties | [Schema.org SoftwareApplication](https://schema.org/SoftwareApplication) | 90 days |
| Search Console and Bing verification | [Search Console](https://search.google.com/search-console/about) and [Bing Webmaster Tools](https://www.bing.com/webmasters/about) | 90 days |
| IndexNow submission and discovery files | [IndexNow documentation](https://www.indexnow.org/documentation) | 90 days |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Decide with the owner when a product site serves users and record the release it belongs to, so site scope follows the product.
2. Prepare the per-reader minimum: clear lead, install command, current proof and links to docs, because a landing page should move a visitor into real use.
3. Pass `.repo-build/facts.json` as the brief to website-build-skill when installed, so the website method owns design and implementation.
4. Otherwise reference that project's release-tagged SEO/AEO and structured-data documents below, so the repo method links to maintained guidance instead of duplicating it.
5. Specify SoftwareApplication JSON-LD with name, description, URL, application category, operating system, software version, license and author linked to one Person entity, so structured data agrees with the visible product.
6. Include canonical URLs, sitemap, robots rules, llms.txt and a documentation mirror plan, because crawlers and agents need stable paths.
7. Offer Search Console, Bing Webmaster and IndexNow verification steps to the owner; label claims about downstream answer-engine use REPORTED, because a submission supplies discovery rather than a ranking promise.
8. Update repository and registry homepage fields together after the site is live and test its install and docs links, so every product entry reaches the same current destination.

Choose the installed website-build-skill's manifest release tag for reference links. The public reference entry points are [SEO and AEO](https://github.com/aunysillyme/website-build-skill/blob/v0.1.20/skills/website-build-skill/prompts/08-seo-aeo.md) and [structured data and llms.txt](https://github.com/aunysillyme/website-build-skill/blob/v0.1.20/skills/website-build-skill/playbooks/structured-data-and-llms.md). Read their availability and selected release before relying on them.

## READERS

| Reader | What they get |
|---|---|
| People | A landing page with install line and current proof. |
| Agents | A docs mirror and llms.txt. |
| Answer engines | SoftwareApplication data and an explicit author entity. |
| Registries | A homepage that resolves to the product. |

## OWNER'S HANDS

HANDS: approve the site scope, domain and publication. Complete verification at `https://search.google.com/search-console` and `https://www.bing.com/webmasters/`. A Wikidata item is a REPORTED option for the owner to assess against `https://www.wikidata.org/wiki/Wikidata:Notability`.

## LEAVE

Leave `.repo-build/work/site-brief.md` with facts path, owner decision, website-method handoff, domain, structured-data fields, discovery files and verification status; `.repo-build/work/receipts/07-site.json`. A deferred site is NOT APPLICABLE with its owner-approved reason.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|

<!-- gate:end -->
