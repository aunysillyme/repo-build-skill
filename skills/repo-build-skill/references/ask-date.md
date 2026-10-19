# Ask date

ASK DATE is the date the user asks, fixed at the start of the request. Facts must be current to that date, never to the model's training date or this package's release date. Keep later access dates separate.

Establish it without asking the user. Use a date explicitly supplied by the host, or run `date -u '+%Y-%m-%dT%H:%M:%SZ'`. Record the exact value and source in `.repo-build/work/sources.md`. A remembered date supplies no evidence.

Capture the HTTP `Date` header from the first research fetch as a cross-check. With a shell, use `curl --silent --show-error --dump-header - --output /dev/null '<official-source-url>'`. Retain requested and final URL, status, raw Date and cache/Age evidence; exclude cookies and credentials. A tool that hides headers cannot provide this evidence.

A local date wins over a conflicting fetched header; record both. With only HTTP available, corroborate the date on an independent host. A stale cached response or future date supplies no current-date proof. If no trustworthy date is available, record date provenance UNVERIFIED and proceed.

| Repo fact | Re-check window |
|---|---|
| Name availability | 1 day; repeat at publish |
| Competitors, security settings, release requirements, retrieval sources | 30 days |
| Runtime lines, registry policy, host loading, metadata limits, schemas | 90 days |
| Venue rules and liveness | 14 days |

Use a stage's narrower window where given. Save claim, official URL, source date, access date, window, expires and stage. Refresh expired facts before relying on them.

Without web access, mark each fact requiring a live read UNVERIFIED with its reason and exact follow-up URL. Continue the work. A dependent gate stays UNVERIFIED; release-ready claims wait for those reads.

Credit: [website-build-skill](https://github.com/aunysillyme/website-build-skill), MIT.
