/**
 * Apply verified exact LC replacements to problems.json
 * 
 * Applying:
 *   11 confirmed exact matches from Category 1
 *   + 1 from Category 2 (#420 - Count Partitions with Given Difference)
 *     which reduces mathematically to the same problem as Target Sum
 * 
 * Dropping from original "Category 1" list:
 *   #39 GCD: LC 1979 is GCD of max+min of array — NOT the same as Euclidean GCD
 *   #41 Print all Divisors: No accurate LC equivalent exists
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'problems.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Exact replacements: GFG → LC
// Each entry was verified to be the same core problem + objective
const replacements = {
  // Sorting implementations — LC "Sort an Array" is the standard substrate
  // for implementing these algorithms (the problem asks you to sort)
  55: 'https://leetcode.com/problems/sort-an-array/',
  56: 'https://leetcode.com/problems/sort-an-array/',
  57: 'https://leetcode.com/problems/sort-an-array/',
  59: 'https://leetcode.com/problems/sort-an-array/',
  60: 'https://leetcode.com/problems/sort-an-array/',

  // Binary Search
  // Lower Bound = find first index where arr[i] >= target = search insert position
  103: 'https://leetcode.com/problems/search-insert-position/',
  // Count occurrences = find first and last position, diff + 1
  108: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/',

  // Recursion / Backtracking
  // LC 2917: exact same problem — generate strings of length n where no two 1s are adjacent
  185: 'https://leetcode.com/problems/generate-binary-strings-without-consecutive-1s/',

  // DP
  // Frog Jump (Striver): min-cost path on array, jump 1 or 2 steps, cost = |height diff|
  // Min Cost Climbing Stairs: same structure, same recurrence, same constraints
  406: 'https://leetcode.com/problems/min-cost-climbing-stairs/',

  // Ninja and his Friends = Cherry Pickup II
  // Same 3D DP problem: two people moving top-to-bottom simultaneously, maximize chocolates
  // Striver literally teaches this as Cherry Pickup II in all his notes
  415: 'https://leetcode.com/problems/cherry-pickup-ii/',

  // Longest Common Substring = Maximum Length of Repeated Subarray
  // Identical problem: find longest contiguous common subarray between two arrays
  429: 'https://leetcode.com/problems/maximum-length-of-repeated-subarray/',

  // From near-equivalents — applying same-core-objective test:
  // Count Partitions with Difference D ≡ Target Sum
  // Both reduce to: count subsets where sum = (total + D) / 2
  // The DP recurrence and constraints are mathematically identical
  420: 'https://leetcode.com/problems/target-sum/',
};

// NOT replacing from original Category 1 list (correctness check failed):
// #39 GCD: LC 1979 is "GCD of max and min in array" — different problem
// #41 Print Divisors: No accurate LC equivalent found

// NOT replacing from Category 2 (same-pattern, different-objective test failed):
// #63  Second Largest: No LC equivalent
// #70  Union of Two Sorted Arrays: LC merge is different objective
// #74/75 Longest Subarray Sum K: LC's min-size subarray has different objective
// #84  Leaders in Array: No LC equivalent
// #99  Count Inversions: LC CSNAS is per-element, not global count
// #112 How many times rotated: LC finds minimum, not rotation count
// #123 Book Allocation: Same binary-search pattern, different problem statement
// #125 Painter's Partition: Same as above
// #157 Reverse Doubly LL: LC is singly LL only
// #286 N Meetings: LC removes intervals; Striver maximizes meetings — different objective
// #361 Cycle Detection BFS: LC Graph Valid Tree is premium/locked
// #371 Topo Sort DFS: Course Schedule tests existence, not the sort itself
// #372 Kahn's Algorithm: Course Schedule II returns order but for a specific application
// #392 Prim's: LC uses Euclidean graph — structurally different input
// #394 MST Weight: Same as above
// #416 Subset Sum = Target: Partition Equal Subset Sum is a specific case, not the general problem
// #425 Unbounded Knapsack: Coin Change 2 counts combinations, not maximize value
// #450/451 Matrix Chain Mult: LC triangulation is interval DP but different semantics

let replacedCount = 0;
const applied = data.map(p => {
  if (replacements[p.id]) {
    replacedCount++;
    return { ...p, solve_url: replacements[p.id] };
  }
  return p;
});

fs.writeFileSync(filePath, JSON.stringify(applied, null, 2));

// ========================
// Validation Report
// ========================
const total = applied.length;
const lcProblems = applied.filter(p => p.solve_url && p.solve_url.includes('leetcode.com/problems/'));
const gfgProblems = applied.filter(p => p.solve_url && p.solve_url.includes('geeksforgeeks.org'));
const noLink = applied.filter(p => !p.solve_url || p.solve_url.trim() === '');
const withJava = applied.filter(p => p.java_url && p.java_url.trim() !== '');
const withoutJava = applied.filter(p => !p.java_url || p.java_url.trim() === '');

console.log('\n=== POST-REPLACEMENT VALIDATION REPORT ===');
console.log(`Total problems         : ${total}`);
console.log(`Replacements applied   : ${replacedCount}`);
console.log(`LeetCode links         : ${lcProblems.length} (${Math.round(lcProblems.length/total*100)}%)`);
console.log(`GFG-only links         : ${gfgProblems.length} (${Math.round(gfgProblems.length/total*100)}%)`);
console.log(`No practice link       : ${noLink.length} (${noLink.map(p => '#'+p.id).join(', ')})`);
console.log(`Java resources         : ${withJava.length} (${Math.round(withJava.length/total*100)}%)`);
console.log(`Missing Java           : ${withoutJava.length}`);
console.log('==========================================\n');

// ========================
// GFG-only export (JSON + CSV)
// ========================
const gfgReasons = {
  // Theory/conceptual
  1:  'Conceptual: I/O theory lesson',
  3:  'Conceptual: Control flow lesson',
  4:  'Conceptual: Switch case lesson',
  5:  'Conceptual: Arrays/Strings intro',
  6:  'Conceptual: For loops lesson',
  7:  'Conceptual: While loops lesson',
  8:  'Conceptual: Functions/pass-by-value lesson',
  34: 'Conceptual: STL overview (C++)',
  35: 'Conceptual: Java Collections overview',
  36: 'Conceptual: Count digits — math exercise, no LC equivalent',
  39: 'Teaches Euclidean algorithm (GCD of two numbers). LC 1979 is GCD of array max/min — different problem',
  41: 'Print all divisors — math exercise, no accurate LC equivalent',
  43: 'Conceptual: Recursion introduction lesson',
  44: 'Conceptual: Recursion — print name N times',
  45: 'Conceptual: Recursion — 1 to N',
  46: 'Conceptual: Recursion — N to 1',
  47: 'Conceptual: Recursion — sum of N numbers',
  48: 'Conceptual: Recursion — factorial',
  52: 'Conceptual: Hashing theory',
  53: 'Conceptual: Frequency counting lesson',
  // Pattern problems
  10: 'Pattern problem (Easy/Medium intro)',
  11: 'Pattern problem (Hard intro)',
  12: 'Pattern 1 — no LC equivalent for pattern printing',
  13: 'Pattern 2 — no LC equivalent',
  14: 'Pattern 3 — no LC equivalent',
  15: 'Pattern 4 — no LC equivalent',
  16: 'Pattern 5 — no LC equivalent',
  17: 'Pattern 6 — no LC equivalent',
  18: 'Pattern 7 — no LC equivalent',
  19: 'Pattern 8 — no LC equivalent',
  20: 'Pattern 9 — no LC equivalent',
  21: 'Pattern 10 — no LC equivalent',
  22: 'Pattern 11 — no LC equivalent',
  23: 'Pattern 12 — no LC equivalent',
  24: 'Pattern 13 — no LC equivalent',
  25: 'Pattern 14 — no LC equivalent',
  26: 'Pattern 15 — no LC equivalent',
  27: 'Pattern 16 — no LC equivalent',
  28: 'Pattern 17 — no LC equivalent',
  29: 'Pattern 18 — no LC equivalent',
  30: 'Pattern 19 — no LC equivalent',
  31: 'Pattern 20 — no LC equivalent',
  32: 'Pattern 21 — no LC equivalent',
  33: 'Pattern 22 — no LC equivalent',
  // Sorting implementations
  55: 'REPLACED_TO_LC', 56: 'REPLACED_TO_LC', 57: 'REPLACED_TO_LC',
  59: 'REPLACED_TO_LC', 60: 'REPLACED_TO_LC',
  // Arrays
  62: 'Largest Element in Array — LC "Largest Number" is a different (number ordering) problem',
  63: 'Second Largest Element — no direct LC equivalent (LC 2367 is different)',
  70: 'Union of Two Sorted Arrays — LC Merge Sorted Array merges in-place; union removes duplicates — different objective',
  74: 'Longest Subarray Sum K (positives) — LC min-size subarray has different objective',
  75: 'Longest Subarray Sum K — GFG-exclusive; LC 325 is similar but with different constraints',
  84: 'Leaders in an Array — no LC equivalent',
  94: 'Largest Subarray with Sum 0 — GFG-exclusive problem',
  95: 'Count Subarrays with XOR K — GFG-exclusive',
  98: 'Find Repeating and Missing Number — GFG-exclusive; LC 765 is different',
  99: 'Count Inversions — LC CSNAS counts per-element, not global inversion pairs',
  103: 'REPLACED_TO_LC',
  106: 'Floor and Ceil in Sorted Array — GFG-exclusive; LC 744 only gives next letter',
  108: 'REPLACED_TO_LC',
  112: 'How many times rotated — LC finds minimum element, not rotation count',
  116: 'Find Nth Root of Number — no LC equivalent',
  // Binary Search applied
  122: 'Aggressive Cows — GFG/SPOJ classic; no LC equivalent',
  123: 'Book Allocation — Binary-search-on-answer pattern; LC Split Array has same idea but different constraints',
  125: "Painter's Partition — same binary-search pattern as Book Allocation; LC equivalent has different framing",
  128: 'Kth element of 2 sorted arrays — LC 4 is Median (k=n/2 fixed); Kth element is the generalization',
  129: 'Find row with maximum 1s — no LC equivalent',
  133: 'Matrix Median — no LC equivalent',
  // Strings
  145: 'Count Number of Substrings with K distinct chars — GFG-exclusive',
  // Linked List
  149: 'Conceptual: Singly LL introduction',
  150: 'Conceptual: LL insertion at head',
  152: 'Conceptual: Find LL length',
  153: 'Conceptual: Search in LL',
  154: 'Conceptual: Doubly LL introduction',
  155: 'Conceptual: DLL insertion',
  156: 'Conceptual: DLL deletion',
  157: 'Reverse Doubly LL — LC 206 is singly LL only; DLL reversal requires separate pointer management',
  163: 'Length of Loop in LL — no LC equivalent (LC 141 only detects, does not measure)',
  169: 'Sort LL of 0s, 1s, 2s — GFG-exclusive; LC Sort List is general comparison sort',
  171: 'Add 1 to number represented as LL — no LC equivalent',
  173: 'Delete all occurrences in DLL — no LC equivalent',
  174: 'Find Pairs with Given Sum in DLL — no LC equivalent',
  175: 'Remove duplicates from sorted DLL — LC 83 is singly LL only',
  178: 'Flattening of LL — GFG-exclusive problem structure',
  // Recursion
  183: 'Sort stack using recursion — no LC equivalent',
  184: 'Reverse a Stack — no LC equivalent',
  185: 'REPLACED_TO_LC',
  188: 'Conceptual: Subsequence patterns theory lesson',
  189: 'Count subsequences with sum K — no LC equivalent',
  190: 'Check subsequence with sum K — no LC equivalent',
  200: 'Rat in a Maze — GFG classic; no LC equivalent',
  202: 'M Coloring Problem — no LC equivalent',
  // Bit Manipulation
  205: 'Conceptual: Bit manipulation theory',
  206: 'Conceptual: Check i-th bit',
  207: 'Conceptual: Check odd/even via bit',
  210: 'Set/Unset rightmost unset bit — no LC equivalent',
  211: 'Swap two numbers — no LC equivalent',
  216: 'XOR of numbers in range — no LC equivalent',
  218: 'Print prime factors — no LC equivalent',
  219: 'Divisors of a number — no LC equivalent',
  221: 'Prime factorization — no LC equivalent',
  // Stack & Queue
  223: 'Conceptual: Implement Stack using Array',
  224: 'Conceptual: Implement Queue using Array',
  227: 'Conceptual: Implement Stack using LinkedList',
  228: 'Conceptual: Implement Queue using LinkedList',
  231: 'Infix to Postfix Conversion — no LC equivalent',
  232: 'Prefix to Infix Conversion — no LC equivalent',
  233: 'Prefix to Postfix Conversion — no LC equivalent',
  234: 'Postfix to Prefix Conversion — no LC equivalent',
  235: 'Postfix to Infix Conversion — no LC equivalent',
  236: 'Infix to Prefix Conversion — no LC equivalent',
  239: 'Next Smaller Element — LC 496 is Next Greater (not smaller); NSE is different direction',
  240: 'Number of Greater Elements to Right — no exact LC equivalent',
  // Heaps
  266: 'Conceptual: Heaps theory video',
  267: 'Conceptual: Implement Min Heap',
  268: 'Check if array represents min heap — no LC equivalent',
  269: 'Convert Min Heap to Max Heap — no LC equivalent',
  271: 'Sort K Sorted Array — no standalone LC equivalent',
  279: 'Maximum Sum Combination — LC 373 is K smallest pairs (minimize), not maximize',
  // Greedy
  283: 'Fractional Knapsack — no LC equivalent (LC only has 0/1 variants)',
  286: 'N Meetings in One Room — LC Non-Overlapping Intervals minimizes removals; Striver maximizes meetings — different objective',
  289: 'Minimum platforms for railway — no LC equivalent',
  290: 'Job Sequencing Problem — no LC equivalent',
  292: 'Shortest Job First (CPU scheduling) — no LC equivalent',
  // Trees
  297: 'Conceptual: Introduction to Trees',
  298: 'Conceptual: Binary Tree representation in Java',
  317: 'Top View of Binary Tree — no LC equivalent',
  318: 'Bottom View of Binary Tree — no LC equivalent',
  324: 'Children Sum Property — no LC equivalent',
  326: 'Minimum time to burn BT — no LC equivalent',
  328: 'Conceptual: Requirements to construct unique BT',
  // BST
  335: 'Conceptual: Introduction to BST',
  337: 'Find Min/Max in BST — no LC equivalent; BST min/max is trivial traversal with no LC problem',
  338: 'Floor and Ceil in BST — LC 700 only searches; floor/ceil is a different operation',
  339: 'Floor in BST — same as 338; no LC equivalent',
  // Graphs
  351: 'Conceptual: Introduction to Graphs',
  352: 'Conceptual: Graph Representation in C++',
  353: 'Conceptual: Graph Representation in Java',
  361: 'Cycle Detection Undirected BFS — LC 261 Graph Valid Tree is premium/locked',
  371: 'Topological Sort (DFS) — Course Schedule detects cycles; does not produce the topological ordering',
  372: "Kahn's Algorithm — Course Schedule II returns an order but for a specific applied problem, not the pure algorithm",
  378: 'Shortest path in undirected unit-weight graph — no LC equivalent',
  379: 'Shortest path in DAG — no LC equivalent',
  381: 'Conceptual: Why priority queue in Dijkstra',
  387: 'Minimum multiplications to reach end — GFG-exclusive',
  388: 'Bellman Ford Algorithm — GFG teaches the algorithm; no direct LC bellman-ford problem',
  389: 'Floyd Warshall Algorithm — GFG teaches the algorithm; LC 1334 uses it but is an application',
  391: 'Conceptual: MST theory',
  392: "Prim's Algorithm — LC 1584 uses Euclidean complete graph; Striver's teaches the general algorithm",
  393: 'Conceptual: Disjoint Set (Union-Find) data structure',
  394: 'Find MST Weight — LC 1584 uses Euclidean graph; general MST weight has no dedicated LC problem',
  402: 'Articulation Points in Graph — no LC equivalent',
  // DP
  404: 'Conceptual: Introduction to DP',
  407: 'Frog Jump with K Distances — no LC equivalent',
  410: "Ninja's Training — no LC equivalent",
  416: 'Subset Sum Equal to Target — Partition Equal Subset Sum (LC 416) is a specific case; general subset sum is the prerequisite',
  419: 'Count Subsets with Sum K — no LC equivalent',
  425: 'Unbounded Knapsack — Coin Change 2 counts combinations; knapsack maximizes value — different objective',
  426: 'Rod Cutting Problem — no LC equivalent',
  448: 'Longest Bitonic Subsequence — no LC equivalent',
  450: 'Matrix Chain Multiplication — LC 1039 triangulation is interval DP with different semantics',
  451: 'Matrix Chain Multiplication Bottom-Up — same as 450',
  // Tries
  460: 'Trie Advanced Operations — LC 208 is basic Trie; advanced ops (count, XOR) have no single equivalent',
  462: 'Number of Distinct Substrings in String — no LC equivalent',
  463: 'Conceptual: Bit prerequisites for Trie problems',
  // Strings
  468: 'Conceptual: Hashing in Strings theory',
  470: 'Z Function — no LC equivalent',
};

const gfgRemaining = applied.filter(p => p.solve_url && p.solve_url.includes('geeksforgeeks.org'));

// JSON export
const jsonExport = gfgRemaining.map(p => ({
  id: p.id,
  problem_name: p.problem_name,
  topic: p.topic,
  difficulty: p.difficulty,
  gfg_url: p.solve_url,
  reason_no_lc: gfgReasons[p.id] || 'GFG-exclusive problem or conceptual lesson'
}));

fs.writeFileSync(
  path.join(__dirname, 'gfg_remaining_report.json'),
  JSON.stringify(jsonExport, null, 2)
);

// CSV export
const csvLines = [
  'ID,Problem Name,Topic,Difficulty,GFG URL,Reason (No LC Equivalent)',
  ...jsonExport.map(p =>
    `${p.id},"${p.problem_name.replace(/"/g, '""')}","${p.topic.replace(/"/g, '""')}",${p.difficulty},"${p.gfg_url}","${p.reason_no_lc.replace(/"/g, '""')}"`
  )
];
fs.writeFileSync(path.join(__dirname, 'gfg_remaining_report.csv'), csvLines.join('\n'));

console.log(`GFG-remaining report written: ${gfgRemaining.length} problems`);
console.log('Files: gfg_remaining_report.json + gfg_remaining_report.csv');
