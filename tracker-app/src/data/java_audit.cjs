/**
 * Java Resource Quality Audit
 * Analyzes all java_url fields in problems.json:
 * - Source breakdown by channel/domain
 * - Duplicate links
 * - Suspicious / non-Java-specific patterns
 * - Random samples for manual verification
 */

const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'problems.json'), 'utf8'));

// ── Source classification ─────────────────────────────────────────────────
function classifySource(url) {
  if (!url) return 'NONE';

  // Striver/TakeUForward YouTube channel IDs
  // Main channel: UCJskGeByzRRSvmOyZtNaAfQ (TUF)
  // java-specific playlist contains these video IDs
  const striverJavaKeywords = [
    'EAR7De6Goz4',  // Java basics full course (Striver)
    'yVdKa8dnKiE',  // Striver recursion Java
    'un6PLygfXrA',  // Striver recursion Java
    'FPu9Uld7W-E',  // Striver Java
    'tNm_NNSB3_w',  // Pattern problems Java (Striver)
    'HGk_ypEuS24',  // Sorting Java (Striver)
    'RRVYpIET_RU',  // Collections Java
    '1xNbjMdbjug',  // Striver Java Basics
    'MpFCwoTimhy',  // Striver
    'HRek3DL9ens',  // Striver Java
    '37E9ckMDdTk',  // Arrays Java (Striver A2Z playlist)
    'wvcQg43_V8U',  // Arrays Java (Striver)
    'bYWLJb3vCWY',  // Arrays Java (Striver)
    'UXDSeD9mN-k',  // Two Sum Java (Striver)
    'tp8JIuCXBaU',  // Dutch National Flag (Striver)
    'nP_ns3uSh80',  // Moore's Voting (Striver)
    'AHZpyENo7k4',  // Kadane's (Striver)
    'excAOvwF_Wk',  // Stock (Striver)
    'h4aBagy4Uok',  // Rearrange (Striver)
    'JDOXKqF60RQ',  // Next Permutation (Striver)
    'cHrH9CQ8pmY',  // Leaders (Striver)
    'oO5uLE7EUlM',  // Longest Consecutive (Striver)
    'N0MgLvceX7M',  // Set Matrix Zeros (Striver)
    'Z0R2u6gd3GU',  // Rotate Image (Striver)
    '3Zv-s9UUrFM',  // Spiral Matrix (Striver)
    'fFVZt-6sgyo',  // Subarray Sum K (Striver)
    'bR7mQgwQ_o8',  // Pascal Triangle (Striver)
    'vwZj1K0e9U8',  // Majority Element II (Striver)
    'DhFh8Kw7ymk',  // 3Sum (Striver)
    'eD95WRfh81c',  // 4Sum (Striver)
    'xmguZ6GbatA',  // Largest Subarray Sum 0 (Striver)
    'eZr-6p0B7ME',  // XOR subarray (Striver)
    'IexN60k62jo',  // Merge Intervals (Striver)
    'n7uwj04E0I4',  // Merge Sorted (Striver)
    '2D0D8HE6uak',  // Repeating Missing (Striver)
    'AseUmwVNaoY',  // Count Inversions (Striver)
    '0e4bZaP3MDI',  // Reverse Pairs (Striver)
    'hnswaLJvr6g',  // Max Product Subarray (Striver)
    'MHf6awe89xw',  // Binary Search (Striver)
    '6zhGS79oQ4k',  // Floor Ceil BS (Striver)
    'hjR1IYVx9lY',  // First Last Pos (Striver)
    'r3pMQ8-Ad5s',  // Search Rotated (Striver)
    'w2G2W8l__pc',  // Search Rotated II (Striver)
    'nhEMDKMB44g',  // Min Rotated (Striver)
    'jtSiWTPLwd0',  // Rotation count (Striver)
    'AZOmHuHadxQ',  // Single Element (Striver)
    'cXxmbemS6XM',  // Peak Element (Striver)
    'Bsv3FPUX_BA',  // Sqrt (Striver)
    'WjpswYrS2nY',  // Nth Root (Striver)
    'qyfekrNni90',  // Koko (Striver)
    'TXAuxeYBTdg',  // Bouquets (Striver)
    'UvBKTVaG6U8',  // Smallest Divisor (Striver)
    'MG-Ac4TAvTY',  // Ship (Striver)
    'uZ0N_hZpyps',  // Kth Missing (Striver)
    'R_Mfw4ew-Vo',  // Aggressive Cows (Striver)
    'gYmWHvRHu-s',  // Books (Striver)
    'thUd_WJn6wk',  // Split Array (Striver)
    'kMSBvlZ-_HA',  // Gas Station (Striver)
    'NTop3VTjmxk',  // Median 2 arrays (Striver)
    'D1oDwWCq50g',  // Kth 2 arrays (Striver)
    'SCz-1TtYxDI',  // Row max 1s (Striver)
    'ZYpYur0znng',  // Search 2D (Striver)
    '9ZbB397jU4k',  // Search 2D II (Striver)
    'nGGp5XBzC4g',  // Peak 2D (Striver)
    'Q9wXgdxJq48',  // Matrix Median (Striver)
    'ys_FBRBCf-c',  // Remove Outer Parentheses (Striver)
    'tbangudar_0',  // Reverse Words (Striver)
    'AKWIxCbMQ4Q',  // Largest Odd (Striver)
    '0sWShKIJoo4',  // Longest Prefix (Striver)
    '7yF-U1hLEqQ',  // Isomorphic (Striver)
    't3KdBRG-pEg',  // Rotate String (Striver)
    '9UtInBqnCgA',  // Valid Anagram (Striver)
    'K1k3kBRJNqM',  // Sort by Freq (Striver)
    'lR6e7AjP9kU',  // Max Nesting Depth (Striver)
    'IF512WHMm9s',  // Roman (Striver)
    'lcNF4rdGtKU',  // Atoi (Striver)
    'UflHuQj6MVA',  // Longest Palindromic (Striver)
    'Nq7ok-OyEpg',  // LL Intro (Striver)
    'VaECK03Dz-g',  // LL Insert/Delete (Striver)
    '0eKMU10uEDI',  // Doubly LL (Striver)
    'u3WUW2qe6ww',  // Reverse DLL (Striver)
    '7LjQ57RqgEc',  // Middle (Striver)
    'D2vI2DNJGd8',  // Reverse LL (Striver)
    'wiOo4DC5GGA',  // Cycle (Striver)
    '2Kd0KKmmHFc',  // Cycle start (Striver)
    'I4g1qbkTPus',  // Loop Length (Striver)
    'lRY_G-u_8jk',  // Palindrome LL (Striver)
    'qf6qp7GzD5Q',  // Odd Even LL (Striver)
    '3kMKYQ2wNIU',  // Remove Nth (Striver)
    'ePpV-_pfOeI',  // Delete Middle (Striver)
    '8ocB7a_c-Cc',  // Sort List (Striver)
    'gRII7LhdJWc',  // Sort 0/1/2 LL (Striver)
    '0DYoPz2Tpt4',  // Intersection (Striver)
    'aXQWhbvT3w0',  // Add 1 to LL (Striver)
    'wgFPrzTjm7s',  // Add Two Numbers (Striver)
    'Mh0NH_SD92k',  // Delete DLL occurrences (Striver)
    'YitR4dQsddE',  // Pairs DLL (Striver)
    'YJKVTnOJXSY',  // Remove dup DLL (Striver)
    'lIar1skcQYI',  // K-group (Striver)
    'uT7YI7XbTY8',  // Rotate LL (Striver)
    'ykelywHJWLg',  // Flatten LL (Striver)
    'q570bKdrnlw',  // Copy random (Striver)
    'l0YC3876qxg',  // Power (Striver)
    's9fokUqJ76A',  // Generate Parentheses (Striver)
    'b7AYbpM5YrE',  // Subsets (Striver)
    'eQCS_v3bw0Q',  // Subsequences (Striver)
    'OyZFFqQtu98',  // Combination Sum (Striver)
    'G1fRTGRxXU8',  // Combination Sum II (Striver)
    'rYkfBRtMJr8',  // Subsets (Striver)
    'RIn3gOkbhQE',  // Subsets II (Striver)
    '0snEunUacZY',  // Phone combinations (Striver)
    '_H8V5hJUGd0',  // Palindrome Partition (Striver)
    'pfiQ_PS1g8E',  // Word Search (Striver)
    'i05Ju7AftcM',  // N Queens (Striver)
    'bLGZhJlt4y0',  // Rat in Maze (Striver)
    'Sx9NNgInc3A',  // Word Break (Striver)
    'wuVwUK25Rfc',  // M Coloring (Striver)
    'FWAIf_EVUKE',  // Sudoku (Striver)
    'qQd-ViW7bfk',  // Bits (Striver)
    'nttpF8kwgd4',  // Bit tricks (Striver)
    'pBD4B1tzgVc',  // Divide (Striver)
    'OOdrmcfZXd8',  // Min bit flips (Striver)
    'LqKaUv1G3_I',  // Power set (Striver)
    'WqGb7159h7Q',  // XOR range (Striver)
    'UA5JnV1J2sI',  // Single Number III (Striver)
    'LT7XhVdeRyg',  // Prime factors (Striver)
    'g5Fuxn_AvSk',  // Sieve (Striver)
    'tqQ5fTamIN4',  // Stack Queue (Striver)
    'xwjS0iZhw4I',  // Valid Parentheses (Striver)
    'NdDIaH91P0g',  // Min Stack (Striver)
    '4pIc9UBHJtk',  // Conversions (Striver)
    'e7XQLtOQM3I',  // NGE (Striver)
    '7PrncY7Q7I8', '7PrncD7v9YQ',  // NGE II (Striver)
    '1_5VuquLbXg',  // Trapping Rain (Striver)
    'v0e8p9JCgRc',  // Sum Subarray Min (Striver)
    '_eYGqw_VDR4',  // Asteroid (Striver)
    'gIrMptNPf5M',  // Subarray Ranges (Striver)
    'jmbuRzYPGrg',  // Remove K Digits (Striver)
    'Bzat9vgD0fs',  // Largest Rect Histogram (Striver)
    'tOylVCugy9k',  // Maximal Rectangle (Striver)
    'NwBvene4Imo',  // Sliding Window Max (Striver)
    'eay-zoSRkVc',  // Stock Span (Striver)
    'cEadsbTeze4',  // Celebrity (Striver)
    'DUbEgNw-F9c',  // LRU (Striver)
    '0PSB9y8ehbk',  // LFU (Striver)
    '-zSxTJkcdAo',  // Longest no repeat (Striver)
    '3E4JBHSLpYk',  // Max Consecutive (Striver)
    'e3bs0uA1NhQ',  // Fruit baskets (Striver)
    '_eNhaDCr6P0',  // Char replacement (Striver)
    'XnMdNUkX6VM',  // Binary subarray (Striver)
    'j_QOv9OT9Og',  // Nice subarrays (Striver)
    'xtqN4qlgr8s',  // All 3 chars (Striver)
    'pBWCOCS636U',  // Max points cards (Striver)
    'teM9ZsVRQyc',  // K distinct (Striver)
    '7wYGbV_LsX4',  // K different integers (Striver)
    'WJaiy9ffOIY', 'WJaiy9ffOIY',  // Min Window (Striver)
    'XEmy13g1Qxc',  // Kth Largest (Striver)
    'HqPJF2L5h9U',  // Heap theory (Striver)
    'kpCesr9VXDA',  // Merge K lists (Striver)
    's8p8ukTyA2I',  // Task Scheduler (Striver)
    'pNichitDD2E',  // Twitter (Striver)
    '70TX-yfEgQM',  // Kth in stream (Striver)
    'itmhHWaHupI',  // Median stream (Striver)
    'YPTqKIgVk-k',  // Top K Frequent (Striver)
    'DIX2p7vb9co',  // Assign Cookies (Striver)
    '1ibsQrnuEEg',  // Fractional Knapsack (Striver)
    'n_tmibEhO6Q',  // Lemonade (Striver)
    'cHT6sG_hUZI',  // Valid Parenthesis String (Striver)
    'mKfhTotEguk',  // N Meetings (Striver)
    'tZAa_jJ3SwQ',  // Jump Game (Striver)
    '7SBVnw7GSTk',  // Jump Game II (Striver)
    'AsGzwR_FWok',  // Min platforms (Striver)
    'QbwltemZbRg',  // Job Sequencing (Striver)
    'IIqVFvKE6RY',  // Candy (Striver)
    '3-QbX1iDbXs',  // SJF (Striver)
    'xxRE-46OCC8',  // Insert Interval (Striver)
    'HDHQ8lAWakY',  // Non-Overlapping (Striver)
    '_ANrF3FJm7I',  // Trees Intro (Striver)
    'hyLyW7rP24I',  // BT Rep (Striver)
    'ySp2epYvgTE',  // Pre+In+Post (Striver)
    'RlUu72JrOCQ',  // Preorder (Striver)
    'Z_NEgBgbRVI',  // Inorder (Striver)
    '2YBhNLodD8Q',  // Postorder (Striver)
    'EoAsWbO7sqg',  // Level Order (Striver)
    'Bfqd8BsPVuw',  // Iterative Preorder (Striver)
    'lxTGsVXjwvM',  // Iterative Inorder (Striver)
    'NzIGLLwZBS8',  // Post 1 stack (Striver)
    'eD3tmO66aBA',  // Max Depth (Striver)
    'Yt50Jfbd8Po',  // Balanced (Striver)
    'Rezetez59Nk',  // Diameter (Striver)
    'WszrfSwMz58',  // Max Path Sum (Striver)
    'BhuvF_-PWS0',  // Same Tree (Striver)
    '3OXWEdlIGl4',  // Zigzag (Striver)
    '0ca1nvR0be4',  // Boundary (Striver)
    'q_a6lpbKJdw',  // Vertical Order (Striver)
    'Et9OCDNvJ78',  // Top View (Striver)
    '0FtVY6I4pB8',  // Bottom View (Striver)
    'KV4mRzTjlAk',  // Right View (Striver)
    'fmflMqVOC7k',  // Root to Leaf (Striver)
    '_-QHfMDde90',  // LCA BT (Striver)
    'ZbybYvcVLks',  // Max Width (Striver)
    'fnmisPM6cVo',  // Children Sum (Striver)
    'i9ORlEy6EsI',  // Dist K (Striver)
    '2r5wLmQfD6g',  // Burn BT (Striver)
    'u-yWemKGWO0',  // Count Complete (Striver)
    '9GMECGQgWrQ',  // Unique BT (Striver)
    'aZNaLrVebKQ',  // Construct Pre+In (Striver)
    'LgLRTaEMRVc',  // Construct Post+In (Striver)
    '-YbXySKJsX8',  // Serialize (Striver)
    '80Zug6D1_r4',  // Morris (Striver)
    'sWf7k1x9XR4',  // Flatten (Striver)
    'p7-9UvDQZ3w',  // BST Intro (Striver)
    'KcNt6v_56cc',  // Search BST (Striver)
    'xm_W1ub-K-w',  // Floor Ceil BST (Striver)
    'FiFiNvM29ps',  // Insert BST (Striver)
    'kouxiP_H5WE',  // Delete BST (Striver)
    '9TJYWh0adfk',  // Kth Smallest BST (Striver)
    'f-sj7I5oXEI',  // Validate BST (Striver)
    'cX_kPV_foZc',  // LCA BST (Striver)
    'UmJT3j26t1I',  // Construct BST (Striver)
    'SXKAD2svfmI',  // Inorder Successor (Striver)
    'D2jMcmxU4bs',  // Merge BST (Striver)
    'ssL3sHwPeb4',  // Two Sum BST (Striver)
    'ZWGW7FminDM',  // Recover BST (Striver)
    'X0oXMdtUDwo',  // Largest BST (Striver)
    '3oI-34aPMWM',  // Graphs Intro (Striver)
    'Qzf1a--rhp8',  // BFS DFS (Striver)
    'ACzkVtewUYA',  // Provinces (Striver)
    'C_iGGI-Cf4o', 'muncqlKJrH0',  // Islands (Striver)
    'yf3oUhkvqA0',  // Rotten Oranges (Striver)
    'C-2_uSRli8o',  // Flood Fill (Striver)
    'BPlrALf1LDU',  // Cycle Undi BFS (Striver)
    'zQ3zgFypzX4',  // Cycle Undi DFS (Striver)
    'edXdVwkYHF8',  // 01 Matrix (Striver)
    'BtdgAys4yMk',  // Surrounded (Striver)
    'rxKcepXQgU4',  // Enclaves (Striver)
    'tRPda0rcf8E',  // Word Ladder (Striver)
    'AD4SFl7tu7I',  // Word Ladder II (Striver)
    'KG5YFfR0j8A',  // Bipartite (Striver)
    '9twcmtQj4DU',  // Cycle Directed (Striver)
    '5lZ0iJMrUMk',  // Topo Sort (Striver)
    'uzVUw90ZFIg',  // Cycle Directed II (Striver)
    'WAOfKpxYHR8',  // Course Schedule (Striver)
    '2gtg3VsDGyc',  // Safe States (Striver)
    'U3N_je7tWAs',  // Alien Dict (Striver)
    'C4gxoTaI71U',  // Shortest unweighted (Striver)
    'ZUFQfFaU-8U',  // Shortest DAG (Striver)
    'rp1SMw7HSO8',  // Dijkstra (Striver)
    'U5Mw4eyUmw4',  // Binary Matrix (Striver)
    '0ytpZyiZFhA',  // Min Effort (Striver)
    '9XybHVqTHcQ',  // Cheapest Flights (Striver)
    '_-0mx0SmYxA',  // Ways to arrive (Striver)
    '_BvEJ3VIDWw',  // Min multiplications (Striver)
    '0vVofAhAYjc',  // Bellman Ford (Striver)
    'YbY8cVwWAvw',  // Floyd Warshall (Striver)
    'ZSPjZuZWCME',  // MST (Striver)
    'mJcZjjKzeqk',  // Prim's (Striver)
    'aBxjDBC4M1U',  // Disjoint Set (Striver)
    'FYrl7iz9_ZU',  // Network Connected (Striver)
    'OwMNX8SPavM',  // Stones Removed (Striver)
    'FMwpt_aQOGw',  // Accounts Merge (Striver)
    'Rn6B-Q4SNyA',  // Islands II (Striver)
    'lgiz0Oup6gM',  // Large Island (Striver)
    'qrAub5z8FeA',  // Bridges (Striver)
    'j1QDfU21iZk',  // Articulation (Striver)
    'V8qIqJxCioo',  // Kosaraju (Striver)
    'tyB0ztf0DNY',  // DP Intro (Striver)
    'mLfjzJsN8us',  // Climbing Stairs (Striver)
    'EgG3jsGoPvQ',  // Frog Jump (Striver)
    'Kmh3rhyEtB8',  // Frog K (Striver)
    'GrMBfJNk_NY',  // House Robber (Striver)
    '3WaxQMELSkw',  // House Robber II (Striver)
    'AE39gJYuRog',  // Ninja Training (Striver)
    'sdE0A2Oxofw',  // Unique Paths (Striver)
    'TmhpgXScLyY',  // Unique Paths II (Striver)
    '_rgTlyky1uQ',  // Min Path Sum (Striver)
    'SrP-PiLSYC0',  // Triangle (Striver)
    'QGfn7JeXK54',  // Cherry Pickup (Striver)
    'fWX9xDmIzRI',  // Subset Sum (Striver)
    '7win3dcgo3k',  // Partition Equal (Striver)
    'GS_OqZb2CWc',  // Min Diff Partition (Striver)
    'ZHyb-A2Mte4',  // Count Subsets (Striver)
    'zoilQD1kYSg',  // Count Partitions (Striver)
    'myPeWb3Y68A',  // Min Coins (Striver)
    'b3GD8263-PQ',  // Target Sum (Striver)
    'HgyouUi11zk',  // Coin Change 2 (Striver)
    'OgvOZ6OrJoY',  // Unbounded (Striver)
    'mO8XpGoJwuo',  // Rod Cutting (Striver)
    '-zI4mrF2Pb4',  // LCS (Striver)
    '_wP9mWNPL5w',  // LCSubstring (Striver)
    '6i_T5kkfv4A',  // Longest Palindromic Sub (Striver)
    'xPBLEj41rFU',  // Min Insert Palindrome (Striver)
    'yMnH0jrir0Q',  // Insert Delete (Striver)
    'xElxAuBcvsU',  // SCS (Striver)
    'nVG7eTiD2bY',  // Distinct Subseq (Striver)
    '-MT5sDpA9Q8',  // Edit Distance (Striver)
    'ZmlQ3vgAOMo',  // Wildcard (Striver)
    'nGJmxkUJQGs',  // Stock II (Striver)
    '-uQGzhYj8BQ',  // Stock III (Striver)
    'IV1dHbk5CDc',  // Stock IV (Striver)
    'IGIe46xw3YY',  // Stock Cooldown (Striver)
    'k4eK-vEmnKg',  // Stock Fee (Striver)
    'on2hvxBXJH4',  // LIS (Striver)
    'IFfYfonAFGc',  // Print LIS (Striver)
    'gDuZwBW9VvM',  // Largest Divisible (Striver)
    'YY8iBaYcc4g',  // String Chain (Striver)
    'y4vN0WNdrlg',  // Bitonic (Striver)
    'cKVl1TFdNXg',  // Count LIS (Striver)
    'vRVfmbCFW7Y',  // MCM (Striver)
    'pDCXsbAw5Cg',  // MCM Bottom Up (Striver)
    'xwomavsC86c',  // Min Cost Stick (Striver)
    'Yz4LlDSlkns',  // Burst Balloons (Striver)
    'MM7fXopgyjw',  // Boolean Expr (Striver)
    'PhWWJmaKfMc',  // Partition Array Max Sum (Striver)
    'auS1fynpnjo',  // Count Square (Striver)
    'dBGUmUQhjaM',  // Trie (Striver)
    'AWnBa91lThI',  // Longest Word Trie (Striver)
    'RV0QeTyHZxo',  // Distinct Substrings (Striver)
    '5iyuU4hQFrw',  // Bit prereq (Striver)
    'EIhAwfHubE8',  // Max XOR (Striver)
    'Q8LhG9Pi5KM',  // Max XOR element (Striver)
    // specific playlist IDs often in striver's java
    'IlEsdxuD4lY',  // Unique Paths Java
    '73r3KWiEvyk',  // House Robber Java
    'rWAJCfYYOvM',  // House Robber II Java
    'IsvocB5BJhw',  // Partition Equal Java
    'NPZn9jBrX8U',  // LCS Java
    'bUr8cNWI09Q',  // Palindromic Sub Java
    'H9bfqorzjoqs', 'H9bfqorzjoqs',
    'g0npyaQtAQM',  // Target Sum Java
    'Mjy4hd2xgrs',  // Coin Change 2 Java
    'NPZn9jBrX8U',  // LCS Java
    // Love Babbar (check channel)
    'rzBMCvh1xJ4',  // Could be Love Babbar
  ];

  // NeetCode patterns
  if (url.includes('neetcode.io') || url.includes('@NeetCode')) return 'NeetCode';

  // Extract video ID from YouTube URL
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&\s]+)/);
  const videoId = ytMatch ? ytMatch[1] : null;

  if (videoId && striverJavaKeywords.includes(videoId)) return 'Striver';

  // GFG articles as java resource
  if (url.includes('geeksforgeeks.org')) return 'GFG Article';

  // YouTube but unclassified — likely Striver or other channel
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube (Other)';

  return 'Other';
}

// ── Analysis ──────────────────────────────────────────────────────────────
const withJava = data.filter(p => p.java_url && p.java_url.trim() !== '');
const withoutJava = data.filter(p => !p.java_url || p.java_url.trim() === '');

// Source breakdown
const sourceCount = {};
withJava.forEach(p => {
  const src = classifySource(p.java_url);
  sourceCount[src] = (sourceCount[src] || 0) + 1;
});

// Duplicates
const urlMap = {};
withJava.forEach(p => {
  const url = p.java_url.split('?')[0]; // normalize: strip params
  if (!urlMap[url]) urlMap[url] = [];
  urlMap[url].push(p.id);
});
const duplicates = Object.entries(urlMap)
  .filter(([_, ids]) => ids.length > 1)
  .map(([url, ids]) => ({ url, ids, count: ids.length }))
  .sort((a, b) => b.count - a.count);

// Non-java-specific heuristics: GFG articles about theory (not Java code)
const nonJavaSpecific = withJava.filter(p => {
  const url = p.java_url;
  return url.includes('geeksforgeeks.org') && !url.includes('java');
});

// Suspicious / potentially broken: malformed URLs
const suspicious = withJava.filter(p => {
  const url = p.java_url;
  return !url.startsWith('http') || url.length < 20;
});

// ── Random Samples ────────────────────────────────────────────────────────
function sample(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

const lcProblems = data.filter(p => p.solve_url && p.solve_url.includes('leetcode.com'));
const gfgProblems = data.filter(p => p.solve_url && p.solve_url.includes('geeksforgeeks.org'));

const sampleLC = sample(lcProblems, 20).map(p => ({
  id: p.id, name: p.problem_name, topic: p.topic, difficulty: p.difficulty,
  solve_url: p.solve_url
}));

const sampleGFG = sample(gfgProblems, 20).map(p => ({
  id: p.id, name: p.problem_name, topic: p.topic, difficulty: p.difficulty,
  solve_url: p.solve_url
}));

const sampleJava = sample(withJava, 20).map(p => ({
  id: p.id, name: p.problem_name, topic: p.topic,
  java_url: p.java_url,
  source: classifySource(p.java_url)
}));

// ── Report Output ─────────────────────────────────────────────────────────
const report = {
  generated_at: new Date().toISOString(),
  totals: {
    total_problems: data.length,
    with_java_resource: withJava.length,
    without_java_resource: withoutJava.length,
    java_coverage_pct: Math.round(withJava.length / data.length * 100)
  },
  source_breakdown: sourceCount,
  quality_issues: {
    duplicate_links: {
      count: duplicates.length,
      duplicates: duplicates.slice(0, 20) // top 20 most duplicated
    },
    non_java_specific_gfg: {
      count: nonJavaSpecific.length,
      problems: nonJavaSpecific.map(p => ({ id: p.id, name: p.problem_name, url: p.java_url }))
    },
    suspicious_urls: {
      count: suspicious.length,
      problems: suspicious.map(p => ({ id: p.id, name: p.problem_name, url: p.java_url }))
    }
  },
  manual_verification_samples: {
    lc_problems: sampleLC,
    gfg_only_problems: sampleGFG,
    java_resources: sampleJava
  }
};

fs.writeFileSync(
  path.join(__dirname, 'java_audit_report.json'),
  JSON.stringify(report, null, 2)
);

// ── Console Summary ────────────────────────────────────────────────────────
console.log('\n=== JAVA RESOURCE QUALITY AUDIT ===\n');
console.log(`Total problems          : ${data.length}`);
console.log(`With Java resource      : ${withJava.length} (${Math.round(withJava.length/data.length*100)}%)`);
console.log(`Without Java resource   : ${withoutJava.length}`);
console.log('\nSource Breakdown:');
Object.entries(sourceCount).sort((a,b) => b[1]-a[1]).forEach(([src, n]) => {
  console.log(`  ${src.padEnd(20)}: ${n}`);
});
console.log(`\nDuplicate java_url links: ${duplicates.length} URLs shared by multiple problems`);
console.log(`Top duplicates:`);
duplicates.slice(0, 5).forEach(d => {
  const shortUrl = d.url.replace('https://','').substring(0, 55);
  console.log(`  [${d.ids.join(', ')}] → ${shortUrl}...`);
});
console.log(`\nNon-Java-specific GFG articles: ${nonJavaSpecific.length}`);
if (nonJavaSpecific.length > 0) {
  nonJavaSpecific.forEach(p => console.log(`  #${p.id} ${p.problem_name}`));
}
console.log(`Suspicious/malformed URLs: ${suspicious.length}`);
console.log('\nFull report: src/data/java_audit_report.json');
console.log('\nSample of 20 Java resources:');
sampleJava.forEach(p => console.log(`  #${p.id} [${p.source}] ${p.name.substring(0,35)}`));
console.log('\n===================================\n');
