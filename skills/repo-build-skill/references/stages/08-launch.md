# Launch venues

## GOAL

Prepare venue-specific submissions with current gates and a dated follow-up.

## NEEDS

Facts, public release status, install proof, a demo and a distribution sketch; load `references/launch-venues.md`. Make the small missing prerequisite first.

## RE-CHECK

| Fact | Official source | Window |
|---|---|---|
| Venue eligibility, rules and liveness | Each venue's own submission page, CONTRIBUTING file and recent accepted entries | 14 days |
| Listing asset and validation requirements | Each marketplace's official submission documentation | 14 days |

Record each read in `.repo-build/work/sources.md` with claim, URL, source date, access date, window, expires and stage. Offline facts stay UNVERIFIED while work proceeds.

## DO

1. Choose venues where the intended user already looks for this category, because category fit matters more than a long submission list.
2. Create one card per venue with gate, cost, liveness date, who submits, one-at-a-time rules and follow-up date, so eligibility and next action are explicit.
3. Read each venue's own rules and recent accepted submissions before drafting, because an old list can preserve a closed or changed venue.
4. Check age, activity, license, cost and author participation against evidence; retain the exact qualifying date when a gate uses time, so a scheduled submission is justified.
5. Draft a plain factual title and description with the real install line and useful demo; tailor them to the venue, because a link drop rarely answers its audience's questions.
6. Prepare the complete marketplace listing before submission: required logo, captured demo, trailer when required, setup instructions and checked claims, so the first review sees the usable product.
7. Queue one-at-a-time venues across the owner's projects and mark the maker's submission HANDS, so overlapping recommendations respect the venue's rule.
8. Save submitted URLs, dates and follow-up dates in the launch ledger; inspect closed or unanswered submissions on that date, because closure can happen without a notification.
9. Record referrers, installs, feedback and dated search observations after launch; distinguish these observations from package measurements, so attention is reported honestly.

## READERS

| Reader | What they get |
|---|---|
| People | Venue-specific drafts, a real demo and a clear install line. |
| Agents | Accurate skill-directory and plugin listings. |
| Answer engines | Relevant curated pages and consistent entity links. |
| Registries | Complete listing fields and checked public metadata. |

## OWNER'S HANDS

HANDS: the owner submits as themselves. Use the exact URL in each venue card, such as `https://news.ycombinator.com/submit` for an eligible Show HN, `https://platform.claude.com/plugins/submit` for a validated Claude plugin, or the list's current human-filed issue form. Confirm any fee before payment.

## LEAVE

Leave `.repo-build/work/launch-ledger.md` with every card, draft, eligibility result, submission URL, owner and follow-up date; `.repo-build/work/receipts/08-launch.json`. Venue waivers carry owner, reason and date. Listing submission remains a separate HANDS row.

## GATE

Rows begin BLOCKED. Attach actual output or a dated manual receipt before assigning PASS. Facts awaiting live reads stay UNVERIFIED. Record NOT APPLICABLE with a reason; WAIVED is reserved for review and venue gates with owner, reason and date.

<!-- gate:start -->
| Check | Reject condition | Evidence |
|---|---|---|
| LA_VENUE (HANDS) | Venue submissions await owner action. | Submission URL or owner, reason and date for WAIVED. Status WAIVED needs owner, reason and date. |
| LA_LISTING (HANDS) | Marketplace listing awaits owner submission. | Complete listing and submission receipt. |
<!-- gate:end -->
