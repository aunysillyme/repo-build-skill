# SEO and AEO for repos

## GOAL

Make each repository surface accurately describe the same searchable product.

## NEEDS

Facts, README, agent entry points and generated llms.txt; load `references/discoverability.md`. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| Topics, preview and README limits | [GitHub repository documentation](https://docs.github.com/en/repositories) | 90 days |
| Registry metadata fields | The selected registry's official publishing docs | 90 days |
| Answer-engine retrieval sources | The answer engine's official search documentation | 30 days |
| Rank-abuse policy | [GitHub Acceptable Use](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies) | Ask date |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Label tactics CONFIRMED, PRACTICE or REPORTED in the source ledger, because documented behavior and field observations support different claims.
2. Synchronize the About description, homepage, topics, registry keywords and plugin metadata from facts, so a search card answers the same question everywhere.
3. Choose relevant category and use-case terms for topics and headings; retain the product name on the command, because people search both the task and the brand.
4. Check the current GitHub topic and social-preview limits before applying metadata; use the default link preview when it clearly identifies the repo, so presentation remains familiar.
5. Add direct use-case answers, comparisons with named alternatives and “when to use” guidance, because readers need distinctions they can act on.
6. Validate skill and plugin manifests and make llms.txt links descriptive and absolute, so installation and retrieval follow real files.
7. Connect the repo, registry, documentation and owner's public entity links consistently, so citations resolve to the same product.
8. Earn stars through use, useful releases and fitting listings; follow GitHub's prohibition on rank abuse such as automated starring or following, so distribution serves real readers.
9. Record dated search observations separately from package proof, because rankings and citations are observations rather than a promised result.

## READERS

| Reader | What they get |
|---|---|
| People | Accurate About box, topics and Common questions. |
| Agents | Valid manifests and linked install instructions. |
| Answer engines | One entity, comparison pages and direct answers. |
| Registries | Keywords, homepage, repository and funding parity. |

## OWNER'S HANDS

HANDS: approve the public metadata and any owner identity links. After the flip, use `gh repo edit "$REPO" --description "<facts-description>" --homepage "<facts-homepage>"` and `gh api "repos/$REPO"` to read them back; apply topics from the facts array with `gh api --method PUT "repos/$REPO/topics" --input <topics-json-file>`.

## LEAVE

Leave synchronized facts and metadata, a dated tactics ledger with grades, resolved links and `.repo-build/work/receipts/05-discover.json`.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| M_ENTITY | Unmet requirement: README and llms.txt H1 headings equal the manifest product name. | M_ENTITY: checker receipt, initially BLOCKED |
| R_DESC | Unmet requirement: Description has at most 160 characters and all declared copies agree. | R_DESC: checker receipt, initially BLOCKED |
| R_TOPICS | Unmet requirement: At most twenty slug topics, each also a keyword. | R_TOPICS: checker receipt, initially BLOCKED |
| O_ABOUT | Unmet requirement: Description, homepage and topics match the facts source. | O_ABOUT: checker receipt, initially BLOCKED |
<!-- gate:end -->
