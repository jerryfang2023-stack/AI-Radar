# First-Line Viewpoints Lane Contract

The First-Line Viewpoints lane owns:

- builders / follow-builders frontstage JSON;
- committed morning history in `first-line-viewpoints-history.json`;
- the merged V4 projection in `first-line-viewpoints-v4.json`;
- complete Chinese primary viewpoint text;
- original URLs, author identity, timestamps, and formal tags;
- Obsidian person/date timeline files;
- first-line automation PR boundary.

## Input And Publication Boundary

| Input | Role | May publish directly? |
|---|---|---|
| Current morning `follow-builders-daily.json` | Current RSS/X and podcast production | Yes, after the current gate |
| Committed morning snapshots | Source for historical reconstruction | Yes, after the same public gates and original-URL dedupe |
| Afternoon `07-points/<date>-builders-viewpoints.md` | Independent archive and overlap/intake coverage | No; it cannot bypass the morning public gate |

The V4 projection keeps the current morning copy when the same original URL also exists in history. Historical publication requires a committed source snapshot, original URL/date/author, complete approved Chinese translation with matching source hash, AI relevance, and an opinion tag. Failed records stay pending rather than entering the public feed.

It must not own:

- Business Signal Cards;
- relationship graph or trend-candidate evidence;
- Community Intelligence data;
- retired `05-frontier-opinions` as current evidence.
- search results or uncommitted drafts as historical publication evidence.
