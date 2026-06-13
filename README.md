# Striver A2Z DSA Tracker Dataset

This repository contains the verified dataset for the **Striver A2Z DSA Sheet**. The dataset extracts all 474 problems perfectly matched with their respective topics, difficulties, and URLs.

## Dataset Contents

The extraction guarantees full accuracy based directly on the TakeUForward website's live payload.

- **Total Problems:** 474
- **Topics Covered:** 18
- **Fields:**
  - `ID`: Sequential order.
  - `Problem Name`: Exact title from the A2Z sheet.
  - `Topic`: The primary category (e.g., "Learn the basics", "Dynamic Programming").
  - `Difficulty`: Easy / Medium / Hard.
  - `LeetCode URL`: Link to LeetCode practice (if available).
  - `YouTube URL`: Link to Striver's official video solution.

## Files
- `dsa_tracker/a2z_problems_simple.json`: The complete structured JSON array of problems.
- `dsa_tracker/a2z_problems_simple.csv`: The comma-separated version of the dataset.
- Extract and verify scripts: Node.js scripts used to fetch the data and verify its integrity against the live sheet.

## Verification Statistics
- Valid LeetCode URLs: 262
- Valid YouTube URLs: 401
- Duplicate Problem Names: 1 ("Assign Cookies" appears correctly in both Greedy and DP).

This simple, robust dataset serves as the perfect foundation for building custom DSA progress trackers.
