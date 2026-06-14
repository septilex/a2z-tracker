/**
 * Dataset Enrichment Script
 * Adds solve_url (LC preferred, GFG fallback) and java_url fields to all 474 problems.
 * Priority: keep existing data, fix bad URLs, add missing ones.
 */

const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'problems.json');
const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

// Maps: id -> { solve_url, java_url }
// solve_url = best practice link (LC > GFG/CN)
// java_url = Java-specific explanation

const enrichmentMap = {
  // =============================================
  // LEARN THE BASICS (1-54)
  // =============================================
  1:  { solve_url: 'https://www.geeksforgeeks.org/input-output-in-java/', java_url: 'https://youtu.be/EAR7De6Goz4?t=250' },
  2:  { solve_url: '', java_url: 'https://youtu.be/EAR7De6Goz4?t=2415' },
  3:  { solve_url: 'https://www.geeksforgeeks.org/decision-making-javaif-else-switch-break-continue-jump/', java_url: 'https://youtu.be/EAR7De6Goz4?t=1259' },
  4:  { solve_url: 'https://www.geeksforgeeks.org/switch-statement-in-java/', java_url: 'https://youtu.be/EAR7De6Goz4' },
  5:  { solve_url: 'https://www.geeksforgeeks.org/arrays-in-java/', java_url: 'https://youtu.be/EAR7De6Goz4?t=2415' },
  6:  { solve_url: 'https://www.geeksforgeeks.org/loops-in-java/', java_url: 'https://youtu.be/EAR7De6Goz4?t=3096' },
  7:  { solve_url: 'https://www.geeksforgeeks.org/java-while-loop-with-examples/', java_url: 'https://youtu.be/EAR7De6Goz4?t=3459' },
  8:  { solve_url: 'https://www.geeksforgeeks.org/methods-in-java/', java_url: 'https://youtu.be/EAR7De6Goz4?t=3677' },
  9:  { solve_url: '', java_url: 'https://youtu.be/FPu9Uld7W-E' },
  10: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  11: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  12: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  13: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  14: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  15: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  16: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  17: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  18: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  19: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  20: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  21: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  22: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  23: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  24: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  25: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  26: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  27: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  28: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  29: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  30: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  31: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  32: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  33: { solve_url: 'https://www.geeksforgeeks.org/pattern-programs-java/', java_url: 'https://www.youtube.com/watch?v=tNm_NNSB3_w' },
  34: { solve_url: 'https://www.geeksforgeeks.org/collections-in-java-2/', java_url: 'https://www.youtube.com/watch?v=RRVYpIET_RU' },
  35: { solve_url: 'https://www.geeksforgeeks.org/collections-in-java-2/', java_url: 'https://youtu.be/rzBMCvh1xJ4' },
  36: { solve_url: 'https://www.geeksforgeeks.org/program-count-digits-integer-3/', java_url: 'https://youtu.be/1xNbjMdbjug' },
  37: { solve_url: 'https://leetcode.com/problems/reverse-integer/', java_url: 'https://youtu.be/HRek3DL9ens' },
  38: { solve_url: 'https://leetcode.com/problems/palindrome-number/', java_url: 'https://youtu.be/MpFCwoTimhy' },
  39: { solve_url: 'https://www.geeksforgeeks.org/gcd-euclids-algorithm/', java_url: 'https://youtu.be/1xNbjMdbjug?t=2684' },
  40: { solve_url: 'https://leetcode.com/problems/armstrong-number/', java_url: 'https://youtu.be/1xNbjMdbjug?t=1418' },
  41: { solve_url: 'https://www.geeksforgeeks.org/find-divisors-natural-number-set-1/', java_url: 'https://youtu.be/1xNbjMdbjug?t=1580' },
  42: { solve_url: 'https://leetcode.com/problems/count-primes/', java_url: 'https://youtu.be/1xNbjMdbjug?t=2381' },
  43: { solve_url: 'https://www.geeksforgeeks.org/recursion-in-java/', java_url: 'https://www.youtube.com/watch?v=yVdKa8dnKiE' },
  44: { solve_url: 'https://www.geeksforgeeks.org/recursion-in-java/', java_url: 'https://www.youtube.com/watch?v=un6PLygfXrA' },
  45: { solve_url: 'https://www.geeksforgeeks.org/recursion-in-java/', java_url: 'https://www.youtube.com/watch?v=un6PLygfXrA' },
  46: { solve_url: 'https://www.geeksforgeeks.org/recursion-in-java/', java_url: 'https://www.youtube.com/watch?v=un6PLygfXrA' },
  47: { solve_url: 'https://www.geeksforgeeks.org/program-find-sum-first-n-natural-numbers/', java_url: 'https://www.youtube.com/watch?v=69ZCDFy-OUo' },
  48: { solve_url: 'https://www.geeksforgeeks.org/factorial-in-java/', java_url: 'https://www.youtube.com/watch?v=69ZCDFy-OUo' },
  49: { solve_url: 'https://leetcode.com/problems/reverse-string/', java_url: 'https://youtu.be/s5f5O3VGkI8' },
  50: { solve_url: 'https://leetcode.com/problems/valid-palindrome/', java_url: 'https://youtu.be/s5f5O3VGkI8' },
  51: { solve_url: 'https://leetcode.com/problems/fibonacci-number/', java_url: 'https://youtu.be/oBt53YbR9Kk' },
  52: { solve_url: 'https://www.geeksforgeeks.org/hashing-in-java/', java_url: 'https://www.youtube.com/watch?v=KEs5UyBJ39g' },
  53: { solve_url: 'https://www.geeksforgeeks.org/counting-frequencies-of-array-elements/', java_url: '' },
  54: { solve_url: 'https://leetcode.com/problems/frequency-of-the-most-frequent-element/', java_url: '' },

  // =============================================
  // SORTING (55-61)
  // =============================================
  55: { solve_url: 'https://www.geeksforgeeks.org/selection-sort/', java_url: 'https://youtu.be/HGk_ypEuS24?t=167' },
  56: { solve_url: 'https://www.geeksforgeeks.org/bubble-sort/', java_url: 'https://youtu.be/HGk_ypEuS24?t=1061' },
  57: { solve_url: 'https://www.geeksforgeeks.org/insertion-sort/', java_url: 'https://youtu.be/HGk_ypEuS24?t=1900' },
  58: { solve_url: 'https://leetcode.com/problems/sort-an-array/', java_url: 'https://youtu.be/ogjf7ORKfd8' },
  59: { solve_url: 'https://www.geeksforgeeks.org/recursive-bubble-sort/', java_url: '' },
  60: { solve_url: 'https://www.geeksforgeeks.org/recursive-insertion-sort/', java_url: '' },
  61: { solve_url: 'https://leetcode.com/problems/sort-an-array/', java_url: 'https://youtu.be/WIrA4YexLRQ' },

  // =============================================
  // ARRAYS (62-101)
  // =============================================
  62: { solve_url: 'https://www.geeksforgeeks.org/c-program-find-largest-element-array/', java_url: 'https://youtu.be/37E9ckMDdTk?t=526' },
  63: { solve_url: 'https://www.geeksforgeeks.org/find-second-largest-element-array/', java_url: 'https://youtu.be/37E9ckMDdTk?t=810' },
  64: { solve_url: 'https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/', java_url: 'https://youtu.be/37E9ckMDdTk?t=17224' },
  65: { solve_url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', java_url: 'https://youtu.be/37E9ckMDdTk?t=1887' },
  66: { solve_url: 'https://leetcode.com/problems/rotate-array/', java_url: 'https://youtu.be/wvcQg43_V8U?t=61' },
  67: { solve_url: 'https://leetcode.com/problems/rotate-array/', java_url: 'https://youtu.be/wvcQg43_V8U?t=485' },
  68: { solve_url: 'https://leetcode.com/problems/move-zeroes/', java_url: 'https://youtu.be/wvcQg43_V8U?t=1633' },
  69: { solve_url: 'https://leetcode.com/problems/find-target-indices-after-sorting-array/', java_url: 'https://youtu.be/wvcQg43_V8U?t=2465' },
  70: { solve_url: 'https://www.geeksforgeeks.org/union-and-intersection-of-two-sorted-arrays-2/', java_url: 'https://youtu.be/wvcQg43_V8U?t=2584' },
  71: { solve_url: 'https://leetcode.com/problems/missing-number/', java_url: 'https://youtu.be/bYWLJb3vCWY' },
  72: { solve_url: 'https://leetcode.com/problems/max-consecutive-ones/', java_url: 'https://youtu.be/bYWLJb3vCWY?t=1124' },
  73: { solve_url: 'https://leetcode.com/problems/single-number/', java_url: 'https://youtu.be/bYWLJb3vCWY?t=1369' },
  74: { solve_url: 'https://www.geeksforgeeks.org/longest-sub-array-sum-k/', java_url: 'https://www.youtube.com/watch?v=frf7qxiN2qU' },
  75: { solve_url: 'https://www.geeksforgeeks.org/longest-sub-array-sum-k/', java_url: 'https://youtu.be/frf7qxiN2qU' },
  76: { solve_url: 'https://leetcode.com/problems/two-sum/', java_url: 'https://youtu.be/UXDSeD9mN-k' },
  77: { solve_url: 'https://leetcode.com/problems/sort-colors/', java_url: 'https://youtu.be/tp8JIuCXBaU' },
  78: { solve_url: 'https://leetcode.com/problems/majority-element/', java_url: 'https://youtu.be/nP_ns3uSh80' },
  79: { solve_url: 'https://leetcode.com/problems/maximum-subarray/', java_url: 'https://youtu.be/AHZpyENo7k4' },
  80: { solve_url: 'https://leetcode.com/problems/maximum-subarray/', java_url: 'https://youtu.be/AHZpyENo7k4' },
  81: { solve_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', java_url: 'https://youtu.be/excAOvwF_Wk' },
  82: { solve_url: 'https://leetcode.com/problems/rearrange-array-elements-by-sign/', java_url: 'https://youtu.be/h4aBagy4Uok' },
  83: { solve_url: 'https://leetcode.com/problems/next-permutation/', java_url: 'https://youtu.be/JDOXKqF60RQ' },
  84: { solve_url: 'https://www.geeksforgeeks.org/leaders-in-an-array/', java_url: 'https://youtu.be/cHrH9CQ8pmY' },
  85: { solve_url: 'https://leetcode.com/problems/longest-consecutive-sequence/', java_url: 'https://youtu.be/oO5uLE7EUlM' },
  86: { solve_url: 'https://leetcode.com/problems/set-matrix-zeroes/', java_url: 'https://youtu.be/N0MgLvceX7M' },
  87: { solve_url: 'https://leetcode.com/problems/rotate-image/', java_url: 'https://youtu.be/Z0R2u6gd3GU' },
  88: { solve_url: 'https://leetcode.com/problems/spiral-matrix/', java_url: 'https://youtu.be/3Zv-s9UUrFM' },
  89: { solve_url: 'https://leetcode.com/problems/subarray-sum-equals-k/', java_url: 'https://youtu.be/fFVZt-6sgyo' },
  90: { solve_url: 'https://leetcode.com/problems/pascals-triangle/', java_url: 'https://youtu.be/bR7mQgwQ_o8' },
  91: { solve_url: 'https://leetcode.com/problems/majority-element-ii/', java_url: 'https://youtu.be/vwZj1K0e9U8' },
  92: { solve_url: 'https://leetcode.com/problems/3sum/', java_url: 'https://youtu.be/DhFh8Kw7ymk' },
  93: { solve_url: 'https://leetcode.com/problems/4sum/', java_url: 'https://youtu.be/eD95WRfh81c' },
  94: { solve_url: 'https://www.geeksforgeeks.org/largest-subarray-with-0-sum/', java_url: 'https://youtu.be/xmguZ6GbatA' },
  95: { solve_url: 'https://www.geeksforgeeks.org/count-number-subarrays-given-xor/', java_url: 'https://youtu.be/eZr-6p0B7ME' },
  96: { solve_url: 'https://leetcode.com/problems/merge-intervals/', java_url: 'https://youtu.be/IexN60k62jo' },
  97: { solve_url: 'https://leetcode.com/problems/merge-sorted-array/', java_url: 'https://youtu.be/n7uwj04E0I4' },
  98: { solve_url: 'https://www.geeksforgeeks.org/find-a-repeating-and-a-missing-number/', java_url: 'https://youtu.be/2D0D8HE6uak' },
  99: { solve_url: 'https://www.geeksforgeeks.org/counting-inversions/', java_url: 'https://youtu.be/AseUmwVNaoY' },
  100: { solve_url: 'https://leetcode.com/problems/reverse-pairs/', java_url: 'https://youtu.be/0e4bZaP3MDI' },
  101: { solve_url: 'https://leetcode.com/problems/maximum-product-subarray/', java_url: 'https://youtu.be/hnswaLJvr6g' },

  // =============================================
  // BINARY SEARCH (102-133)
  // =============================================
  102: { solve_url: 'https://leetcode.com/problems/binary-search/', java_url: 'https://youtu.be/MHf6awe89xw' },
  103: { solve_url: 'https://www.geeksforgeeks.org/floor-in-a-sorted-array/', java_url: 'https://youtu.be/6zhGS79oQ4k' },
  104: { solve_url: 'https://leetcode.com/problems/search-insert-position/', java_url: 'https://youtu.be/6zhGS79oQ4k' },
  105: { solve_url: 'https://leetcode.com/problems/search-insert-position/', java_url: 'https://youtu.be/6zhGS79oQ4k' },
  106: { solve_url: 'https://www.geeksforgeeks.org/floor-and-ceil-from-a-bst/', java_url: 'https://www.youtube.com/watch?v=6zhGS79oQ4k' },
  107: { solve_url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/', java_url: 'https://youtu.be/hjR1IYVx9lY' },
  108: { solve_url: 'https://www.geeksforgeeks.org/count-occurrences-in-a-sorted-array/', java_url: 'https://youtu.be/hjR1IYVx9lY' },
  109: { solve_url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', java_url: 'https://youtu.be/r3pMQ8-Ad5s' },
  110: { solve_url: 'https://leetcode.com/problems/search-in-rotated-sorted-array-ii/', java_url: 'https://youtu.be/w2G2W8l__pc' },
  111: { solve_url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', java_url: 'https://youtu.be/nhEMDKMB44g' },
  112: { solve_url: 'https://www.geeksforgeeks.org/find-rotation-count-rotated-sorted-array/', java_url: 'https://youtu.be/jtSiWTPLwd0' },
  113: { solve_url: 'https://leetcode.com/problems/single-element-in-a-sorted-array/', java_url: 'https://youtu.be/AZOmHuHadxQ' },
  114: { solve_url: 'https://leetcode.com/problems/find-peak-element/', java_url: 'https://youtu.be/cXxmbemS6XM' },
  115: { solve_url: 'https://leetcode.com/problems/sqrtx/', java_url: 'https://youtu.be/Bsv3FPUX_BA' },
  116: { solve_url: 'https://www.geeksforgeeks.org/find-nth-root-of-m/', java_url: 'https://www.youtube.com/watch?v=WjpswYrS2nY' },
  117: { solve_url: 'https://leetcode.com/problems/koko-eating-bananas/', java_url: 'https://youtu.be/qyfekrNni90' },
  118: { solve_url: 'https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/', java_url: 'https://youtu.be/TXAuxeYBTdg' },
  119: { solve_url: 'https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/', java_url: 'https://youtu.be/UvBKTVaG6U8' },
  120: { solve_url: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/', java_url: 'https://youtu.be/MG-Ac4TAvTY' },
  121: { solve_url: 'https://leetcode.com/problems/kth-missing-positive-number/', java_url: 'https://youtu.be/uZ0N_hZpyps' },
  122: { solve_url: 'https://www.geeksforgeeks.org/aggressive-cows/', java_url: 'https://youtu.be/R_Mfw4ew-Vo' },
  123: { solve_url: 'https://www.geeksforgeeks.org/allocate-minimum-number-pages/', java_url: 'https://youtu.be/gYmWHvRHu-s' },
  124: { solve_url: 'https://leetcode.com/problems/split-array-largest-sum/', java_url: 'https://youtu.be/thUd_WJn6wk' },
  125: { solve_url: 'https://www.geeksforgeeks.org/painters-partition-problem/', java_url: 'https://youtu.be/thUd_WJn6wk' },
  126: { solve_url: 'https://leetcode.com/problems/minimize-max-distance-to-gas-station/', java_url: 'https://youtu.be/kMSBvlZ-_HA' },
  127: { solve_url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', java_url: 'https://youtu.be/NTop3VTjmxk' },
  128: { solve_url: 'https://www.geeksforgeeks.org/k-th-element-two-sorted-arrays/', java_url: 'https://youtu.be/D1oDwWCq50g' },
  129: { solve_url: 'https://www.geeksforgeeks.org/find-index-maximum-occurring-element-equal-probability/', java_url: 'https://youtu.be/SCz-1TtYxDI' },
  130: { solve_url: 'https://leetcode.com/problems/search-a-2d-matrix/', java_url: 'https://youtu.be/ZYpYur0znng' },
  131: { solve_url: 'https://leetcode.com/problems/search-a-2d-matrix-ii/', java_url: 'https://youtu.be/9ZbB397jU4k' },
  132: { solve_url: 'https://leetcode.com/problems/find-a-peak-element-ii/', java_url: 'https://youtu.be/nGGp5XBzC4g' },
  133: { solve_url: 'https://www.geeksforgeeks.org/find-median-row-wise-sorted-matrix/', java_url: 'https://youtu.be/Q9wXgdxJq48' },

  // =============================================
  // STRINGS (134-148)
  // =============================================
  134: { solve_url: 'https://leetcode.com/problems/remove-outermost-parentheses/', java_url: 'https://youtu.be/ys_FBRBCf-c' },
  135: { solve_url: 'https://leetcode.com/problems/reverse-words-in-a-string/', java_url: 'https://youtu.be/tbangudar_0' },
  136: { solve_url: 'https://leetcode.com/problems/largest-odd-number-in-string/', java_url: 'https://youtu.be/AKWIxCbMQ4Q' },
  137: { solve_url: 'https://leetcode.com/problems/longest-common-prefix/', java_url: 'https://youtu.be/0sWShKIJoo4' },
  138: { solve_url: 'https://leetcode.com/problems/isomorphic-strings/', java_url: 'https://youtu.be/7yF-U1hLEqQ' },
  139: { solve_url: 'https://leetcode.com/problems/rotate-string/', java_url: 'https://youtu.be/t3KdBRG-pEg' },
  140: { solve_url: 'https://leetcode.com/problems/valid-anagram/', java_url: 'https://youtu.be/9UtInBqnCgA' },
  141: { solve_url: 'https://leetcode.com/problems/sort-characters-by-frequency/', java_url: 'https://youtu.be/K1k3kBRJNqM' },
  142: { solve_url: 'https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/', java_url: 'https://youtu.be/lR6e7AjP9kU' },
  143: { solve_url: 'https://leetcode.com/problems/roman-to-integer/', java_url: 'https://youtu.be/IF512WHMm9s' },
  144: { solve_url: 'https://leetcode.com/problems/string-to-integer-atoi/', java_url: 'https://youtu.be/lcNF4rdGtKU' },
  145: { solve_url: 'https://www.geeksforgeeks.org/count-substrings-with-k-distinct-characters/', java_url: '' },
  146: { solve_url: 'https://leetcode.com/problems/longest-palindromic-substring/', java_url: 'https://youtu.be/UflHuQj6MVA' },
  147: { solve_url: 'https://leetcode.com/problems/sum-of-beauty-of-all-substrings/', java_url: '' },
  148: { solve_url: 'https://leetcode.com/problems/reverse-words-in-a-string/', java_url: '' },

  // =============================================
  // LINKED LIST (149-179)
  // =============================================
  149: { solve_url: 'https://www.geeksforgeeks.org/linked-list-set-1-introduction/', java_url: 'https://youtu.be/Nq7ok-OyEpg' },
  150: { solve_url: 'https://www.geeksforgeeks.org/linked-list-set-2-inserting-a-node/', java_url: 'https://youtu.be/VaECK03Dz-g' },
  151: { solve_url: 'https://leetcode.com/problems/delete-node-in-a-linked-list/', java_url: 'https://youtu.be/VaECK03Dz-g' },
  152: { solve_url: 'https://www.geeksforgeeks.org/find-length-of-a-linked-list-iterative-and-recursive/', java_url: 'https://youtu.be/Nq7ok-OyEpg' },
  153: { solve_url: 'https://www.geeksforgeeks.org/search-an-element-in-a-linked-list-iterative-and-recursive/', java_url: 'https://youtu.be/Nq7ok-OyEpg' },
  154: { solve_url: 'https://www.geeksforgeeks.org/doubly-linked-list/', java_url: 'https://youtu.be/0eKMU10uEDI' },
  155: { solve_url: 'https://www.geeksforgeeks.org/doubly-linked-list/', java_url: 'https://youtu.be/0eKMU10uEDI' },
  156: { solve_url: 'https://www.geeksforgeeks.org/doubly-linked-list/', java_url: 'https://youtu.be/0eKMU10uEDI' },
  157: { solve_url: 'https://www.geeksforgeeks.org/reverse-a-doubly-linked-list/', java_url: 'https://youtu.be/u3WUW2qe6ww' },
  158: { solve_url: 'https://leetcode.com/problems/middle-of-the-linked-list/', java_url: 'https://youtu.be/7LjQ57RqgEc' },
  159: { solve_url: 'https://leetcode.com/problems/reverse-linked-list/', java_url: 'https://youtu.be/D2vI2DNJGd8' },
  160: { solve_url: 'https://leetcode.com/problems/reverse-linked-list/', java_url: 'https://youtu.be/D2vI2DNJGd8' },
  161: { solve_url: 'https://leetcode.com/problems/linked-list-cycle/', java_url: 'https://youtu.be/wiOo4DC5GGA' },
  162: { solve_url: 'https://leetcode.com/problems/linked-list-cycle-ii/', java_url: 'https://youtu.be/2Kd0KKmmHFc' },
  163: { solve_url: 'https://www.geeksforgeeks.org/find-length-of-loop-in-linked-list/', java_url: 'https://youtu.be/I4g1qbkTPus' },
  164: { solve_url: 'https://leetcode.com/problems/palindrome-linked-list/', java_url: 'https://youtu.be/lRY_G-u_8jk' },
  165: { solve_url: 'https://leetcode.com/problems/odd-even-linked-list/', java_url: 'https://youtu.be/qf6qp7GzD5Q' },
  166: { solve_url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', java_url: 'https://youtu.be/3kMKYQ2wNIU' },
  167: { solve_url: 'https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/', java_url: 'https://youtu.be/ePpV-_pfOeI' },
  168: { solve_url: 'https://leetcode.com/problems/sort-list/', java_url: 'https://youtu.be/8ocB7a_c-Cc' },
  169: { solve_url: 'https://www.geeksforgeeks.org/sort-linked-list-already-sorted-absolute-values/', java_url: 'https://youtu.be/gRII7LhdJWc' },
  170: { solve_url: 'https://leetcode.com/problems/intersection-of-two-linked-lists/', java_url: 'https://youtu.be/0DYoPz2Tpt4' },
  171: { solve_url: 'https://www.geeksforgeeks.org/add-1-number-represented-linked-list/', java_url: 'https://youtu.be/aXQWhbvT3w0' },
  172: { solve_url: 'https://leetcode.com/problems/add-two-numbers/', java_url: 'https://youtu.be/wgFPrzTjm7s' },
  173: { solve_url: 'https://www.geeksforgeeks.org/delete-occurrences-given-key-doubly-linked-list/', java_url: 'https://youtu.be/Mh0NH_SD92k' },
  174: { solve_url: 'https://www.geeksforgeeks.org/find-pairs-given-sum-doubly-linked-list/', java_url: 'https://youtu.be/YitR4dQsddE' },
  175: { solve_url: 'https://www.geeksforgeeks.org/remove-duplicates-sorted-doubly-linked-list/', java_url: 'https://youtu.be/YJKVTnOJXSY' },
  176: { solve_url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', java_url: 'https://youtu.be/lIar1skcQYI' },
  177: { solve_url: 'https://leetcode.com/problems/rotate-list/', java_url: 'https://youtu.be/uT7YI7XbTY8' },
  178: { solve_url: 'https://www.geeksforgeeks.org/flattening-a-linked-list/', java_url: 'https://youtu.be/ykelywHJWLg' },
  179: { solve_url: 'https://leetcode.com/problems/copy-list-with-random-pointer/', java_url: 'https://youtu.be/q570bKdrnlw' },

  // =============================================
  // RECURSION (180-204)
  // =============================================
  180: { solve_url: 'https://leetcode.com/problems/string-to-integer-atoi/', java_url: '' },
  181: { solve_url: 'https://leetcode.com/problems/powx-n/', java_url: 'https://youtu.be/l0YC3876qxg' },
  182: { solve_url: 'https://leetcode.com/problems/count-good-numbers/', java_url: '' },
  183: { solve_url: 'https://www.geeksforgeeks.org/sort-a-stack-using-recursion/', java_url: '' },
  184: { solve_url: 'https://www.geeksforgeeks.org/reverse-a-stack-using-recursion/', java_url: '' },
  185: { solve_url: 'https://www.geeksforgeeks.org/generate-binary-strings-without-consecutive-1s/', java_url: '' },
  186: { solve_url: 'https://leetcode.com/problems/generate-parentheses/', java_url: 'https://youtu.be/s9fokUqJ76A' },
  187: { solve_url: 'https://leetcode.com/problems/subsets/', java_url: 'https://www.youtube.com/watch?v=b7AYbpM5YrE' },
  188: { solve_url: 'https://www.geeksforgeeks.org/generating-all-possible-subsequences-using-recursion/', java_url: 'https://www.youtube.com/watch?v=eQCS_v3bw0Q' },
  189: { solve_url: 'https://www.geeksforgeeks.org/count-of-subsets-having-sum-equal-to-k/', java_url: '' },
  190: { solve_url: 'https://www.geeksforgeeks.org/check-if-a-subset-with-sum-divisible-by-m-exist/', java_url: '' },
  191: { solve_url: 'https://leetcode.com/problems/combination-sum/', java_url: 'https://youtu.be/OyZFFqQtu98' },
  192: { solve_url: 'https://leetcode.com/problems/combination-sum-ii/', java_url: 'https://youtu.be/G1fRTGRxXU8' },
  193: { solve_url: 'https://leetcode.com/problems/subsets/', java_url: 'https://youtu.be/rYkfBRtMJr8' },
  194: { solve_url: 'https://leetcode.com/problems/subsets-ii/', java_url: 'https://youtu.be/RIn3gOkbhQE' },
  195: { solve_url: 'https://leetcode.com/problems/combination-sum-iii/', java_url: '' },
  196: { solve_url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', java_url: 'https://youtu.be/0snEunUacZY' },
  197: { solve_url: 'https://leetcode.com/problems/palindrome-partitioning/', java_url: 'https://youtu.be/_H8V5hJUGd0' },
  198: { solve_url: 'https://leetcode.com/problems/word-search/', java_url: 'https://youtu.be/pfiQ_PS1g8E' },
  199: { solve_url: 'https://leetcode.com/problems/n-queens/', java_url: 'https://youtu.be/i05Ju7AftcM' },
  200: { solve_url: 'https://www.geeksforgeeks.org/rat-in-a-maze/', java_url: 'https://youtu.be/bLGZhJlt4y0' },
  201: { solve_url: 'https://leetcode.com/problems/word-break/', java_url: 'https://youtu.be/Sx9NNgInc3A' },
  202: { solve_url: 'https://www.geeksforgeeks.org/m-coloring-problem-backtracking-5/', java_url: 'https://youtu.be/wuVwUK25Rfc' },
  203: { solve_url: 'https://leetcode.com/problems/sudoku-solver/', java_url: 'https://youtu.be/FWAIf_EVUKE' },
  204: { solve_url: 'https://leetcode.com/problems/expression-add-operators/', java_url: '' },

  // =============================================
  // BIT MANIPULATION (205-222)
  // =============================================
  205: { solve_url: 'https://www.geeksforgeeks.org/bits-manipulation-important-tactics/', java_url: 'https://youtu.be/qQd-ViW7bfk' },
  206: { solve_url: 'https://www.geeksforgeeks.org/check-whether-k-th-bit-set-not/', java_url: 'https://youtu.be/nttpF8kwgd4' },
  207: { solve_url: 'https://www.geeksforgeeks.org/check-if-number-is-even-or-odd/', java_url: 'https://youtu.be/nttpF8kwgd4' },
  208: { solve_url: 'https://leetcode.com/problems/power-of-two/', java_url: 'https://youtu.be/nttpF8kwgd4' },
  209: { solve_url: 'https://leetcode.com/problems/number-of-1-bits/', java_url: 'https://youtu.be/nttpF8kwgd4' },
  210: { solve_url: 'https://www.geeksforgeeks.org/unset-rightmost-set-bit/', java_url: 'https://youtu.be/nttpF8kwgd4' },
  211: { solve_url: 'https://www.geeksforgeeks.org/swap-two-numbers-without-using-temporary-variable/', java_url: 'https://youtu.be/nttpF8kwgd4' },
  212: { solve_url: 'https://leetcode.com/problems/divide-two-integers/', java_url: 'https://youtu.be/pBD4B1tzgVc' },
  213: { solve_url: 'https://leetcode.com/problems/minimum-bit-flips-to-convert-number/', java_url: 'https://youtu.be/OOdrmcfZXd8' },
  214: { solve_url: 'https://leetcode.com/problems/single-number/', java_url: 'https://youtu.be/bYWLJb3vCWY?t=1369' },
  215: { solve_url: 'https://leetcode.com/problems/subsets/', java_url: 'https://youtu.be/LqKaUv1G3_I' },
  216: { solve_url: 'https://www.geeksforgeeks.org/find-xor-of-all-elements-in-a-given-range/', java_url: 'https://youtu.be/WqGb7159h7Q' },
  217: { solve_url: 'https://leetcode.com/problems/single-number-iii/', java_url: 'https://youtu.be/UA5JnV1J2sI' },
  218: { solve_url: 'https://www.geeksforgeeks.org/prime-factorization-using-sieve-olog-n-multiple-queries/', java_url: 'https://youtu.be/LT7XhVdeRyg' },
  219: { solve_url: 'https://www.geeksforgeeks.org/find-divisors-natural-number-set-1/', java_url: 'https://youtu.be/1xNbjMdbjug?t=1580' },
  220: { solve_url: 'https://leetcode.com/problems/count-primes/', java_url: 'https://youtu.be/g5Fuxn_AvSk' },
  221: { solve_url: 'https://www.geeksforgeeks.org/prime-factorization-using-sieve-olog-n-multiple-queries/', java_url: 'https://youtu.be/LT7XhVdeRyg' },
  222: { solve_url: 'https://leetcode.com/problems/powx-n/', java_url: 'https://youtu.be/l0YC3876qxg' },

  // =============================================
  // STACK AND QUEUES (223-252)
  // =============================================
  223: { solve_url: 'https://www.geeksforgeeks.org/stack-data-structure-introduction-program/', java_url: 'https://youtu.be/tqQ5fTamIN4' },
  224: { solve_url: 'https://www.geeksforgeeks.org/queue-data-structure/', java_url: 'https://youtu.be/tqQ5fTamIN4' },
  225: { solve_url: 'https://leetcode.com/problems/implement-stack-using-queues/', java_url: 'https://youtu.be/tqQ5fTamIN4' },
  226: { solve_url: 'https://leetcode.com/problems/implement-queue-using-stacks/', java_url: 'https://youtu.be/tqQ5fTamIN4' },
  227: { solve_url: 'https://www.geeksforgeeks.org/implement-a-stack-using-singly-linked-list/', java_url: 'https://youtu.be/tqQ5fTamIN4' },
  228: { solve_url: 'https://www.geeksforgeeks.org/queue-linked-list-implementation/', java_url: 'https://youtu.be/tqQ5fTamIN4' },
  229: { solve_url: 'https://leetcode.com/problems/valid-parentheses/', java_url: 'https://youtu.be/xwjS0iZhw4I' },
  230: { solve_url: 'https://leetcode.com/problems/min-stack/', java_url: 'https://youtu.be/NdDIaH91P0g' },
  231: { solve_url: 'https://www.geeksforgeeks.org/stack-set-2-infix-to-postfix/', java_url: 'https://youtu.be/4pIc9UBHJtk' },
  232: { solve_url: 'https://www.geeksforgeeks.org/prefix-infix-conversion/', java_url: 'https://youtu.be/4pIc9UBHJtk' },
  233: { solve_url: 'https://www.geeksforgeeks.org/prefix-postfix-conversion/', java_url: 'https://youtu.be/4pIc9UBHJtk' },
  234: { solve_url: 'https://www.geeksforgeeks.org/postfix-prefix-conversion/', java_url: 'https://youtu.be/4pIc9UBHJtk' },
  235: { solve_url: 'https://www.geeksforgeeks.org/postfix-to-infix/', java_url: 'https://youtu.be/4pIc9UBHJtk' },
  236: { solve_url: 'https://www.geeksforgeeks.org/infix-prefix-conversion/', java_url: 'https://youtu.be/4pIc9UBHJtk' },
  237: { solve_url: 'https://leetcode.com/problems/next-greater-element-i/', java_url: 'https://youtu.be/e7XQLtOQM3I' },
  238: { solve_url: 'https://leetcode.com/problems/next-greater-element-ii/', java_url: 'https://youtu.be/7PrncD7v9YQ' },
  239: { solve_url: 'https://www.geeksforgeeks.org/next-smaller-element/', java_url: '' },
  240: { solve_url: 'https://www.geeksforgeeks.org/find-the-element-before-which-all-the-elements-are-smaller-than-it-and-after-which-all-are-greater/', java_url: '' },
  241: { solve_url: 'https://leetcode.com/problems/trapping-rain-water/', java_url: 'https://youtu.be/1_5VuquLbXg' },
  242: { solve_url: 'https://leetcode.com/problems/sum-of-subarray-minimums/', java_url: 'https://youtu.be/v0e8p9JCgRc' },
  243: { solve_url: 'https://leetcode.com/problems/asteroid-collision/', java_url: 'https://youtu.be/_eYGqw_VDR4' },
  244: { solve_url: 'https://leetcode.com/problems/sum-of-subarray-ranges/', java_url: 'https://youtu.be/gIrMptNPf5M' },
  245: { solve_url: 'https://leetcode.com/problems/remove-k-digits/', java_url: 'https://youtu.be/jmbuRzYPGrg' },
  246: { solve_url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', java_url: 'https://youtu.be/Bzat9vgD0fs' },
  247: { solve_url: 'https://leetcode.com/problems/maximal-rectangle/', java_url: 'https://youtu.be/tOylVCugy9k' },
  248: { solve_url: 'https://leetcode.com/problems/sliding-window-maximum/', java_url: 'https://youtu.be/NwBvene4Imo' },
  249: { solve_url: 'https://leetcode.com/problems/online-stock-span/', java_url: 'https://youtu.be/eay-zoSRkVc' },
  250: { solve_url: 'https://leetcode.com/problems/find-the-celebrity/', java_url: 'https://youtu.be/cEadsbTeze4' },
  251: { solve_url: 'https://leetcode.com/problems/lru-cache/', java_url: 'https://youtu.be/DUbEgNw-F9c' },
  252: { solve_url: 'https://leetcode.com/problems/lfu-cache/', java_url: 'https://www.youtube.com/watch?v=0PSB9y8ehbk' },

  // =============================================
  // SLIDING WINDOW (253-264)
  // =============================================
  253: { solve_url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', java_url: 'https://youtu.be/-zSxTJkcdAo' },
  254: { solve_url: 'https://leetcode.com/problems/max-consecutive-ones-iii/', java_url: 'https://youtu.be/3E4JBHSLpYk' },
  255: { solve_url: 'https://leetcode.com/problems/fruit-into-baskets/', java_url: 'https://youtu.be/e3bs0uA1NhQ' },
  256: { solve_url: 'https://leetcode.com/problems/longest-repeating-character-replacement/', java_url: 'https://youtu.be/_eNhaDCr6P0' },
  257: { solve_url: 'https://leetcode.com/problems/binary-subarrays-with-sum/', java_url: 'https://youtu.be/XnMdNUkX6VM' },
  258: { solve_url: 'https://leetcode.com/problems/count-number-of-nice-subarrays/', java_url: 'https://youtu.be/j_QOv9OT9Og' },
  259: { solve_url: 'https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/', java_url: 'https://youtu.be/xtqN4qlgr8s' },
  260: { solve_url: 'https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/', java_url: 'https://youtu.be/pBWCOCS636U' },
  261: { solve_url: 'https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/', java_url: 'https://youtu.be/teM9ZsVRQyc' },
  262: { solve_url: 'https://leetcode.com/problems/subarrays-with-k-different-integers/', java_url: 'https://youtu.be/7wYGbV_LsX4' },
  263: { solve_url: 'https://leetcode.com/problems/minimum-window-substring/', java_url: 'https://youtu.be/WJaij9ffOIY' },
  264: { solve_url: 'https://leetcode.com/problems/minimum-window-subsequence/', java_url: '' },

  // =============================================
  // HEAPS (265-281)
  // =============================================
  265: { solve_url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', java_url: 'https://youtu.be/XEmy13g1Qxc' },
  266: { solve_url: 'https://www.geeksforgeeks.org/binary-heap/', java_url: 'https://youtu.be/HqPJF2L5h9U' },
  267: { solve_url: 'https://www.geeksforgeeks.org/min-heap-in-java/', java_url: 'https://youtu.be/HqPJF2L5h9U' },
  268: { solve_url: 'https://www.geeksforgeeks.org/check-if-a-given-binary-tree-is-heap/', java_url: '' },
  269: { solve_url: 'https://www.geeksforgeeks.org/convert-min-heap-to-max-heap/', java_url: '' },
  270: { solve_url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', java_url: 'https://youtu.be/XEmy13g1Qxc' },
  271: { solve_url: 'https://www.geeksforgeeks.org/k-largestor-smallest-elements-in-an-array/', java_url: '' },
  272: { solve_url: 'https://leetcode.com/problems/merge-k-sorted-lists/', java_url: 'https://youtu.be/kpCesr9VXDA' },
  273: { solve_url: 'https://leetcode.com/problems/rank-transform-of-an-array/', java_url: '' },
  274: { solve_url: 'https://leetcode.com/problems/task-scheduler/', java_url: 'https://youtu.be/s8p8ukTyA2I' },
  275: { solve_url: 'https://leetcode.com/problems/hand-of-straights/', java_url: '' },
  276: { solve_url: 'https://leetcode.com/problems/design-twitter/', java_url: 'https://youtu.be/pNichitDD2E' },
  277: { solve_url: 'https://leetcode.com/problems/minimum-cost-to-connect-sticks/', java_url: '' },
  278: { solve_url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', java_url: 'https://youtu.be/70TX-yfEgQM' },
  279: { solve_url: 'https://www.geeksforgeeks.org/find-k-pairs-largest-sum/', java_url: '' },
  280: { solve_url: 'https://leetcode.com/problems/find-median-from-data-stream/', java_url: 'https://youtu.be/itmhHWaHupI' },
  281: { solve_url: 'https://leetcode.com/problems/top-k-frequent-elements/', java_url: 'https://youtu.be/YPTqKIgVk-k' },

  // =============================================
  // GREEDY (282-296)
  // =============================================
  282: { solve_url: 'https://leetcode.com/problems/assign-cookies/', java_url: 'https://youtu.be/DIX2p7vb9co' },
  283: { solve_url: 'https://www.geeksforgeeks.org/fractional-knapsack-problem/', java_url: 'https://youtu.be/1ibsQrnuEEg' },
  284: { solve_url: 'https://leetcode.com/problems/lemonade-change/', java_url: 'https://youtu.be/n_tmibEhO6Q' },
  285: { solve_url: 'https://leetcode.com/problems/valid-parenthesis-string/', java_url: 'https://youtu.be/cHT6sG_hUZI' },
  286: { solve_url: 'https://www.geeksforgeeks.org/n-meetings-in-one-room/', java_url: 'https://youtu.be/mKfhTotEguk' },
  287: { solve_url: 'https://leetcode.com/problems/jump-game/', java_url: 'https://youtu.be/tZAa_jJ3SwQ' },
  288: { solve_url: 'https://leetcode.com/problems/jump-game-ii/', java_url: 'https://youtu.be/7SBVnw7GSTk' },
  289: { solve_url: 'https://www.geeksforgeeks.org/minimum-number-platforms-required-railwaybus-station/', java_url: 'https://youtu.be/AsGzwR_FWok' },
  290: { solve_url: 'https://www.geeksforgeeks.org/job-sequencing-problem/', java_url: 'https://youtu.be/QbwltemZbRg' },
  291: { solve_url: 'https://leetcode.com/problems/candy/', java_url: 'https://youtu.be/IIqVFvKE6RY' },
  292: { solve_url: 'https://www.geeksforgeeks.org/program-for-shortest-job-first-or-sjf-cpu-scheduling-set-1-non-preemptive/', java_url: 'https://youtu.be/3-QbX1iDbXs' },
  293: { solve_url: 'https://leetcode.com/problems/lru-cache/', java_url: '' },
  294: { solve_url: 'https://leetcode.com/problems/insert-interval/', java_url: 'https://youtu.be/xxRE-46OCC8' },
  295: { solve_url: 'https://leetcode.com/problems/merge-intervals/', java_url: 'https://youtu.be/IexN60k62jo' },
  296: { solve_url: 'https://leetcode.com/problems/non-overlapping-intervals/', java_url: 'https://youtu.be/HDHQ8lAWakY' },

  // =============================================
  // BINARY TREES (297-334)
  // =============================================
  297: { solve_url: 'https://www.geeksforgeeks.org/binary-tree-data-structure/', java_url: 'https://youtu.be/_ANrF3FJm7I' },
  298: { solve_url: 'https://www.geeksforgeeks.org/binary-tree-set-1-introduction/', java_url: 'https://youtu.be/hyLyW7rP24I' },
  299: { solve_url: 'https://leetcode.com/problems/n-ary-tree-preorder-traversal/', java_url: 'https://youtu.be/ySp2epYvgTE' },
  300: { solve_url: 'https://leetcode.com/problems/binary-tree-preorder-traversal/', java_url: 'https://youtu.be/RlUu72JrOCQ' },
  301: { solve_url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', java_url: 'https://youtu.be/Z_NEgBgbRVI' },
  302: { solve_url: 'https://leetcode.com/problems/binary-tree-postorder-traversal/', java_url: 'https://youtu.be/2YBhNLodD8Q' },
  303: { solve_url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', java_url: 'https://youtu.be/EoAsWbO7sqg' },
  304: { solve_url: 'https://leetcode.com/problems/binary-tree-preorder-traversal/', java_url: 'https://youtu.be/Bfqd8BsPVuw' },
  305: { solve_url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', java_url: 'https://youtu.be/lxTGsVXjwvM' },
  306: { solve_url: 'https://leetcode.com/problems/binary-tree-postorder-traversal/', java_url: 'https://youtu.be/2YBhNLodD8Q' },
  307: { solve_url: 'https://leetcode.com/problems/binary-tree-postorder-traversal/', java_url: 'https://youtu.be/NzIGLLwZBS8' },
  308: { solve_url: 'https://leetcode.com/problems/n-ary-tree-preorder-traversal/', java_url: 'https://youtu.be/ySp2epYvgTE' },
  309: { solve_url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', java_url: 'https://youtu.be/eD3tmO66aBA' },
  310: { solve_url: 'https://leetcode.com/problems/balanced-binary-tree/', java_url: 'https://youtu.be/Yt50Jfbd8Po' },
  311: { solve_url: 'https://leetcode.com/problems/diameter-of-binary-tree/', java_url: 'https://youtu.be/Rezetez59Nk' },
  312: { solve_url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', java_url: 'https://youtu.be/WszrfSwMz58' },
  313: { solve_url: 'https://leetcode.com/problems/same-tree/', java_url: 'https://youtu.be/BhuvF_-PWS0' },
  314: { solve_url: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/', java_url: 'https://youtu.be/3OXWEdlIGl4' },
  315: { solve_url: 'https://leetcode.com/problems/boundary-of-binary-tree/', java_url: 'https://youtu.be/0ca1nvR0be4' },
  316: { solve_url: 'https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/', java_url: 'https://youtu.be/q_a6lpbKJdw' },
  317: { solve_url: 'https://www.geeksforgeeks.org/print-nodes-top-view-binary-tree/', java_url: 'https://youtu.be/Et9OCDNvJ78' },
  318: { solve_url: 'https://www.geeksforgeeks.org/bottom-view-binary-tree/', java_url: 'https://youtu.be/0FtVY6I4pB8' },
  319: { solve_url: 'https://leetcode.com/problems/binary-tree-right-side-view/', java_url: 'https://youtu.be/KV4mRzTjlAk' },
  320: { solve_url: 'https://leetcode.com/problems/symmetric-tree/', java_url: 'https://youtu.be/nKggiEpBE' },
  321: { solve_url: 'https://leetcode.com/problems/binary-tree-paths/', java_url: 'https://youtu.be/fmflMqVOC7k' },
  322: { solve_url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', java_url: 'https://youtu.be/_-QHfMDde90' },
  323: { solve_url: 'https://leetcode.com/problems/maximum-width-of-binary-tree/', java_url: 'https://youtu.be/ZbybYvcVLks' },
  324: { solve_url: 'https://www.geeksforgeeks.org/check-for-children-sum-property-in-a-binary-tree/', java_url: 'https://youtu.be/fnmisPM6cVo' },
  325: { solve_url: 'https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/', java_url: 'https://youtu.be/i9ORlEy6EsI' },
  326: { solve_url: 'https://www.geeksforgeeks.org/burning-tree/', java_url: 'https://youtu.be/2r5wLmQfD6g' },
  327: { solve_url: 'https://leetcode.com/problems/count-complete-tree-nodes/', java_url: 'https://youtu.be/u-yWemKGWO0' },
  328: { solve_url: 'https://www.geeksforgeeks.org/if-you-are-given-two-traversal-sequences-can-you-construct-the-binary-tree/', java_url: 'https://youtu.be/9GMECGQgWrQ' },
  329: { solve_url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', java_url: 'https://youtu.be/aZNaLrVebKQ' },
  330: { solve_url: 'https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/', java_url: 'https://youtu.be/LgLRTaEMRVc' },
  331: { solve_url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', java_url: 'https://youtu.be/-YbXySKJsX8' },
  332: { solve_url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', java_url: 'https://youtu.be/80Zug6D1_r4' },
  333: { solve_url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', java_url: 'https://youtu.be/80Zug6D1_r4' },
  334: { solve_url: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/', java_url: 'https://youtu.be/sWf7k1x9XR4' },

  // =============================================
  // BST (335-350)
  // =============================================
  335: { solve_url: 'https://www.geeksforgeeks.org/binary-search-tree-data-structure/', java_url: 'https://youtu.be/p7-9UvDQZ3w' },
  336: { solve_url: 'https://leetcode.com/problems/search-in-a-binary-search-tree/', java_url: 'https://youtu.be/KcNt6v_56cc' },
  337: { solve_url: 'https://www.geeksforgeeks.org/find-the-minimum-and-maximum-element-in-a-binary-search-tree/', java_url: '' },
  338: { solve_url: 'https://www.geeksforgeeks.org/floor-and-ceil-from-a-bst/', java_url: 'https://youtu.be/xm_W1ub-K-w' },
  339: { solve_url: 'https://www.geeksforgeeks.org/floor-in-binary-search-tree-bst/', java_url: 'https://youtu.be/xm_W1ub-K-w' },
  340: { solve_url: 'https://leetcode.com/problems/insert-into-a-binary-search-tree/', java_url: 'https://youtu.be/FiFiNvM29ps' },
  341: { solve_url: 'https://leetcode.com/problems/delete-node-in-a-bst/', java_url: 'https://youtu.be/kouxiP_H5WE' },
  342: { solve_url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', java_url: 'https://youtu.be/9TJYWh0adfk' },
  343: { solve_url: 'https://leetcode.com/problems/validate-binary-search-tree/', java_url: 'https://youtu.be/f-sj7I5oXEI' },
  344: { solve_url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', java_url: 'https://youtu.be/cX_kPV_foZc' },
  345: { solve_url: 'https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/', java_url: 'https://youtu.be/UmJT3j26t1I' },
  346: { solve_url: 'https://leetcode.com/problems/inorder-successor-in-bst/', java_url: 'https://youtu.be/SXKAD2svfmI' },
  347: { solve_url: 'https://leetcode.com/problems/binary-search-tree-iterator/', java_url: 'https://youtu.be/D2jMcmxU4bs' },
  348: { solve_url: 'https://leetcode.com/problems/two-sum-iv-input-is-a-bst/', java_url: 'https://youtu.be/ssL3sHwPeb4' },
  349: { solve_url: 'https://leetcode.com/problems/recover-binary-search-tree/', java_url: 'https://youtu.be/ZWGW7FminDM' },
  350: { solve_url: 'https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/', java_url: 'https://youtu.be/X0oXMdtUDwo' },

  // =============================================
  // GRAPHS (351-403)
  // =============================================
  351: { solve_url: 'https://www.geeksforgeeks.org/graph-and-its-representations/', java_url: 'https://youtu.be/3oI-34aPMWM' },
  352: { solve_url: 'https://www.geeksforgeeks.org/graph-and-its-representations/', java_url: 'https://youtu.be/3oI-34aPMWM' },
  353: { solve_url: 'https://www.geeksforgeeks.org/graph-and-its-representations/', java_url: 'https://youtu.be/3oI-34aPMWM' },
  354: { solve_url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', java_url: '' },
  355: { solve_url: 'https://leetcode.com/problems/find-if-path-exists-in-graph/', java_url: 'https://youtu.be/Qzf1a--rhp8' },
  356: { solve_url: 'https://leetcode.com/problems/find-if-path-exists-in-graph/', java_url: 'https://youtu.be/Qzf1a--rhp8' },
  357: { solve_url: 'https://leetcode.com/problems/number-of-provinces/', java_url: 'https://youtu.be/ACzkVtewUYA' },
  358: { solve_url: 'https://leetcode.com/problems/number-of-islands/', java_url: '' },
  359: { solve_url: 'https://leetcode.com/problems/rotting-oranges/', java_url: 'https://youtu.be/yf3oUhkvqA0' },
  360: { solve_url: 'https://leetcode.com/problems/flood-fill/', java_url: 'https://youtu.be/C-2_uSRli8o' },
  361: { solve_url: 'https://www.geeksforgeeks.org/detect-cycle-undirected-graph/', java_url: 'https://youtu.be/BPlrALf1LDU' },
  362: { solve_url: 'https://leetcode.com/problems/course-schedule/', java_url: 'https://youtu.be/zQ3zgFypzX4' },
  363: { solve_url: 'https://leetcode.com/problems/01-matrix/', java_url: 'https://youtu.be/edXdVwkYHF8' },
  364: { solve_url: 'https://leetcode.com/problems/surrounded-regions/', java_url: 'https://youtu.be/BtdgAys4yMk' },
  365: { solve_url: 'https://leetcode.com/problems/number-of-enclaves/', java_url: 'https://youtu.be/rxKcepXQgU4' },
  366: { solve_url: 'https://leetcode.com/problems/word-ladder/', java_url: 'https://youtu.be/tRPda0rcf8E' },
  367: { solve_url: 'https://leetcode.com/problems/word-ladder-ii/', java_url: 'https://youtu.be/AD4SFl7tu7I' },
  368: { solve_url: 'https://leetcode.com/problems/number-of-islands/', java_url: 'https://youtu.be/muncqlKJrH0' },
  369: { solve_url: 'https://leetcode.com/problems/is-graph-bipartite/', java_url: 'https://youtu.be/KG5YFfR0j8A' },
  370: { solve_url: 'https://leetcode.com/problems/course-schedule-ii/', java_url: 'https://youtu.be/9twcmtQj4DU' },
  371: { solve_url: 'https://www.geeksforgeeks.org/topological-sorting/', java_url: 'https://youtu.be/5lZ0iJMrUMk' },
  372: { solve_url: 'https://www.geeksforgeeks.org/topological-sorting-indegree-based-solution/', java_url: 'https://youtu.be/5lZ0iJMrUMk' },
  373: { solve_url: 'https://leetcode.com/problems/course-schedule/', java_url: 'https://youtu.be/uzVUw90ZFIg' },
  374: { solve_url: 'https://leetcode.com/problems/course-schedule/', java_url: 'https://youtu.be/WAOfKpxYHR8' },
  375: { solve_url: 'https://leetcode.com/problems/course-schedule-ii/', java_url: 'https://youtu.be/WAOfKpxYHR8' },
  376: { solve_url: 'https://leetcode.com/problems/find-eventual-safe-states/', java_url: 'https://youtu.be/2gtg3VsDGyc' },
  377: { solve_url: 'https://leetcode.com/problems/alien-dictionary/', java_url: 'https://youtu.be/U3N_je7tWAs' },
  378: { solve_url: 'https://www.geeksforgeeks.org/shortest-path-unweighted-graph/', java_url: 'https://youtu.be/C4gxoTaI71U' },
  379: { solve_url: 'https://www.geeksforgeeks.org/shortest-path-for-directed-acyclic-graphs/', java_url: 'https://youtu.be/ZUFQfFaU-8U' },
  380: { solve_url: 'https://leetcode.com/problems/network-delay-time/', java_url: 'https://youtu.be/rp1SMw7HSO8' },
  381: { solve_url: 'https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/', java_url: 'https://youtu.be/rp1SMw7HSO8' },
  382: { solve_url: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/', java_url: 'https://youtu.be/U5Mw4eyUmw4' },
  383: { solve_url: 'https://leetcode.com/problems/path-with-minimum-effort/', java_url: 'https://youtu.be/0ytpZyiZFhA' },
  384: { solve_url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', java_url: 'https://youtu.be/9XybHVqTHcQ' },
  385: { solve_url: 'https://leetcode.com/problems/network-delay-time/', java_url: '' },
  386: { solve_url: 'https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/', java_url: 'https://youtu.be/_-0mx0SmYxA' },
  387: { solve_url: 'https://www.geeksforgeeks.org/minimum-steps-to-reach-a-destination-using-bfs/', java_url: 'https://youtu.be/_BvEJ3VIDWw' },
  388: { solve_url: 'https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/', java_url: 'https://youtu.be/0vVofAhAYjc' },
  389: { solve_url: 'https://www.geeksforgeeks.org/floyd-warshall-algorithm-dp-16/', java_url: 'https://youtu.be/YbY8cVwWAvw' },
  390: { solve_url: 'https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/', java_url: 'https://youtu.be/9XybHVqTHcQ' },
  391: { solve_url: 'https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/', java_url: 'https://youtu.be/ZSPjZuZWCME' },
  392: { solve_url: 'https://www.geeksforgeeks.org/prims-algorithm-using-priority_queue-stl/', java_url: 'https://youtu.be/mJcZjjKzeqk' },
  393: { solve_url: 'https://www.geeksforgeeks.org/disjoint-set-data-structures/', java_url: 'https://youtu.be/aBxjDBC4M1U' },
  394: { solve_url: 'https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/', java_url: 'https://youtu.be/mJcZjjKzeqk' },
  395: { solve_url: 'https://leetcode.com/problems/number-of-operations-to-make-network-connected/', java_url: 'https://youtu.be/FYrl7iz9_ZU' },
  396: { solve_url: 'https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/', java_url: 'https://youtu.be/OwMNX8SPavM' },
  397: { solve_url: 'https://leetcode.com/problems/accounts-merge/', java_url: 'https://youtu.be/FMwpt_aQOGw' },
  398: { solve_url: 'https://leetcode.com/problems/number-of-islands-ii/', java_url: 'https://youtu.be/Rn6B-Q4SNyA' },
  399: { solve_url: 'https://leetcode.com/problems/making-a-large-island/', java_url: 'https://youtu.be/lgiz0Oup6gM' },
  400: { solve_url: 'https://leetcode.com/problems/swim-in-rising-water/', java_url: '' },
  401: { solve_url: 'https://leetcode.com/problems/critical-connections-in-a-network/', java_url: 'https://youtu.be/qrAub5z8FeA' },
  402: { solve_url: 'https://www.geeksforgeeks.org/articulation-points-or-cut-vertices-in-a-graph/', java_url: 'https://youtu.be/j1QDfU21iZk' },
  403: { solve_url: 'https://www.geeksforgeeks.org/strongly-connected-components/', java_url: 'https://youtu.be/V8qIqJxCioo' },

  // =============================================
  // DP (404-458)
  // =============================================
  404: { solve_url: 'https://www.geeksforgeeks.org/dynamic-programming/', java_url: 'https://youtu.be/tyB0ztf0DNY' },
  405: { solve_url: 'https://leetcode.com/problems/climbing-stairs/', java_url: 'https://youtu.be/mLfjzJsN8us' },
  406: { solve_url: 'https://www.codingninjas.com/studio/problems/frog-jump_3621012', java_url: 'https://www.youtube.com/watch?v=EgG3jsGoPvQ' },
  407: { solve_url: 'https://www.codingninjas.com/studio/problems/minimal-cost_8180930', java_url: 'https://www.youtube.com/watch?v=Kmh3rhyEtB8' },
  408: { solve_url: 'https://leetcode.com/problems/house-robber/', java_url: 'https://youtu.be/73r3KWiEvyk' },
  409: { solve_url: 'https://leetcode.com/problems/house-robber-ii/', java_url: 'https://youtu.be/rWAJCfYYOvM' },
  410: { solve_url: 'https://www.codingninjas.com/studio/problems/ninja-s-training_3621003', java_url: 'https://www.youtube.com/watch?v=AE39gJYuRog' },
  411: { solve_url: 'https://leetcode.com/problems/unique-paths/', java_url: 'https://youtu.be/IlEsdxuD4lY' },
  412: { solve_url: 'https://leetcode.com/problems/unique-paths-ii/', java_url: 'https://youtu.be/TmhpgXScLyY' },
  413: { solve_url: 'https://leetcode.com/problems/minimum-path-sum/', java_url: 'https://youtu.be/_rgTlyky1uQ' },
  414: { solve_url: 'https://leetcode.com/problems/triangle/', java_url: 'https://youtu.be/SrP-PiLSYC0' },
  415: { solve_url: 'https://www.codingninjas.com/studio/problems/chocolate-pickup_3125842', java_url: 'https://www.youtube.com/watch?v=QGfn7JeXK54' },
  416: { solve_url: 'https://www.geeksforgeeks.org/subset-sum-problem-dp-25/', java_url: 'https://www.youtube.com/watch?v=fWX9xDmIzRI' },
  417: { solve_url: 'https://leetcode.com/problems/partition-equal-subset-sum/', java_url: 'https://youtu.be/IsvocB5BJhw' },
  418: { solve_url: 'https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/', java_url: 'https://www.youtube.com/watch?v=GS_OqZb2CWc' },
  419: { solve_url: 'https://www.geeksforgeeks.org/count-of-subsets-with-sum-equal-to-k/', java_url: 'https://www.youtube.com/watch?v=ZHyb-A2Mte4' },
  420: { solve_url: 'https://www.geeksforgeeks.org/partition-a-set-into-two-subsets-such-that-the-difference-of-subset-sums-is-minimum/', java_url: 'https://www.youtube.com/watch?v=zoilQD1kYSg' },
  421: { solve_url: 'https://leetcode.com/problems/assign-cookies/', java_url: 'https://youtu.be/DIX2p7vb9co' },
  422: { solve_url: 'https://leetcode.com/problems/coin-change/', java_url: 'https://youtu.be/H9bfqozjoqs' },
  423: { solve_url: 'https://leetcode.com/problems/target-sum/', java_url: 'https://youtu.be/g0npyaQtAQM' },
  424: { solve_url: 'https://leetcode.com/problems/coin-change-ii/', java_url: 'https://youtu.be/Mjy4hd2xgrs' },
  425: { solve_url: 'https://www.geeksforgeeks.org/unbounded-knapsack-repetition-items-allowed/', java_url: 'https://youtu.be/OgvOZ6OrJoY' },
  426: { solve_url: 'https://www.geeksforgeeks.org/cutting-a-rod-dp-13/', java_url: 'https://youtu.be/mO8XpGoJwuo' },
  427: { solve_url: 'https://leetcode.com/problems/longest-common-subsequence/', java_url: 'https://youtu.be/NPZn9jBrX8U' },
  428: { solve_url: 'https://leetcode.com/problems/longest-common-subsequence/', java_url: 'https://youtu.be/-zI4mrF2Pb4' },
  429: { solve_url: 'https://www.geeksforgeeks.org/longest-common-substring-dp-29/', java_url: 'https://youtu.be/_wP9mWNPL5w' },
  430: { solve_url: 'https://leetcode.com/problems/longest-palindromic-subsequence/', java_url: 'https://youtu.be/bUr8cNWI09Q' },
  431: { solve_url: 'https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/', java_url: 'https://www.youtube.com/watch?v=xPBLEj41rFU' },
  432: { solve_url: 'https://leetcode.com/problems/delete-operation-for-two-strings/', java_url: 'https://www.youtube.com/watch?v=yMnH0jrir0Q' },
  433: { solve_url: 'https://leetcode.com/problems/shortest-common-supersequence/', java_url: 'https://youtu.be/xElxAuBcvsU' },
  434: { solve_url: 'https://leetcode.com/problems/distinct-subsequences/', java_url: 'https://youtu.be/nVG7eTiD2bY' },
  435: { solve_url: 'https://leetcode.com/problems/edit-distance/', java_url: 'https://youtu.be/-MT5sDpA9Q8' },
  436: { solve_url: 'https://leetcode.com/problems/wildcard-matching/', java_url: 'https://youtu.be/ZmlQ3vgAOMo' },
  437: { solve_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', java_url: 'https://youtu.be/excAOvwF_Wk' },
  438: { solve_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/', java_url: 'https://youtu.be/nGJmxkUJQGs' },
  439: { solve_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/', java_url: 'https://youtu.be/-uQGzhYj8BQ' },
  440: { solve_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/', java_url: 'https://youtu.be/IV1dHbk5CDc' },
  441: { solve_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/', java_url: 'https://youtu.be/IGIe46xw3YY' },
  442: { solve_url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/', java_url: 'https://youtu.be/k4eK-vEmnKg' },
  443: { solve_url: 'https://leetcode.com/problems/longest-increasing-subsequence/', java_url: 'https://youtu.be/on2hvxBXJH4' },
  444: { solve_url: 'https://leetcode.com/problems/longest-increasing-subsequence/', java_url: 'https://youtu.be/IFfYfonAFGc' },
  445: { solve_url: 'https://leetcode.com/problems/longest-increasing-subsequence/', java_url: 'https://youtu.be/on2hvxBXJH4' },
  446: { solve_url: 'https://leetcode.com/problems/largest-divisible-subset/', java_url: 'https://youtu.be/gDuZwBW9VvM' },
  447: { solve_url: 'https://leetcode.com/problems/longest-string-chain/', java_url: 'https://youtu.be/YY8iBaYcc4g' },
  448: { solve_url: 'https://www.geeksforgeeks.org/longest-bitonic-subsequence-dp-15/', java_url: 'https://youtu.be/y4vN0WNdrlg' },
  449: { solve_url: 'https://leetcode.com/problems/number-of-longest-increasing-subsequence/', java_url: 'https://youtu.be/cKVl1TFdNXg' },
  450: { solve_url: 'https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/', java_url: 'https://youtu.be/vRVfmbCFW7Y' },
  451: { solve_url: 'https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/', java_url: 'https://youtu.be/pDCXsbAw5Cg' },
  452: { solve_url: 'https://leetcode.com/problems/minimum-cost-to-cut-a-stick/', java_url: 'https://youtu.be/xwomavsC86c' },
  453: { solve_url: 'https://leetcode.com/problems/burst-balloons/', java_url: 'https://youtu.be/Yz4LlDSlkns' },
  454: { solve_url: 'https://leetcode.com/problems/parsing-a-boolean-expression/', java_url: 'https://youtu.be/MM7fXopgyjw' },
  455: { solve_url: 'https://leetcode.com/problems/palindrome-partitioning-ii/', java_url: 'https://youtu.be/_H8V5hJUGd0' },
  456: { solve_url: 'https://leetcode.com/problems/partition-array-for-maximum-sum/', java_url: 'https://youtu.be/PhWWJmaKfMc' },
  457: { solve_url: 'https://leetcode.com/problems/maximal-rectangle/', java_url: 'https://youtu.be/tOylVCugy9k' },
  458: { solve_url: 'https://leetcode.com/problems/count-square-submatrices-with-all-ones/', java_url: 'https://youtu.be/auS1fynpnjo' },

  // =============================================
  // TRIES (459-465)
  // =============================================
  459: { solve_url: 'https://leetcode.com/problems/implement-trie-prefix-tree/', java_url: 'https://youtu.be/dBGUmUQhjaM' },
  460: { solve_url: 'https://www.geeksforgeeks.org/trie-insert-and-search/', java_url: '' },
  461: { solve_url: 'https://leetcode.com/problems/longest-word-in-dictionary/', java_url: 'https://youtu.be/AWnBa91lThI' },
  462: { solve_url: 'https://www.geeksforgeeks.org/count-distinct-substrings-of-a-string-using-suffix-trie/', java_url: 'https://youtu.be/RV0QeTyHZxo' },
  463: { solve_url: 'https://www.geeksforgeeks.org/bits-manipulation-important-tactics/', java_url: 'https://youtu.be/5iyuU4hQFrw' },
  464: { solve_url: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/', java_url: 'https://youtu.be/EIhAwfHubE8' },
  465: { solve_url: 'https://leetcode.com/problems/maximum-xor-with-an-element-from-array/', java_url: 'https://youtu.be/Q8LhG9Pi5KM' },

  // =============================================
  // ADVANCED STRINGS (466-474)
  // =============================================
  466: { solve_url: 'https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/', java_url: '' },
  467: { solve_url: 'https://leetcode.com/problems/count-and-say/', java_url: '' },
  468: { solve_url: 'https://www.geeksforgeeks.org/string-hashing-using-polynomial-rolling-hash-function/', java_url: '' },
  469: { solve_url: 'https://leetcode.com/problems/repeated-string-match/', java_url: '' },
  470: { solve_url: 'https://www.geeksforgeeks.org/z-algorithm-linear-time-pattern-searching-algorithm/', java_url: '' },
  471: { solve_url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/', java_url: '' },
  472: { solve_url: 'https://leetcode.com/problems/shortest-palindrome/', java_url: '' },
  473: { solve_url: 'https://leetcode.com/problems/longest-happy-prefix/', java_url: '' },
  474: { solve_url: 'https://leetcode.com/problems/palindromic-substrings/', java_url: '' },
};

// Clean up bad LC URL patterns (#:~:text=, discussion links, login links)
function cleanLCUrl(url) {
  if (!url) return '';
  // Remove browser text fragments
  url = url.replace(/#:~:text=.*$/, '');
  // Replace login redirect with direct problem URL (extract path)
  if (url.includes('/accounts/login/') && url.includes('next=')) {
    const match = url.match(/next=(.+)/);
    if (match) url = 'https://leetcode.com' + decodeURIComponent(match[1]);
  }
  // Fix discussion/solution links → clean problem URL
  url = url.replace(/\/solution\/$/, '/').replace(/\/discuss\/.*$/, '/').replace(/\/discussion\/.*$/, '/');
  // Ensure trailing slash for consistency
  if (url.includes('leetcode.com/problems/') && !url.endsWith('/')) url += '/';
  return url;
}

// Process each problem
const enriched = data.map(p => {
  const e = enrichmentMap[p.id] || {};

  // Determine solve_url:
  // 1. Use existing leetcode_url if clean and valid
  // 2. Fall back to enrichmentMap solve_url
  let solve_url = cleanLCUrl(p.leetcode_url);
  if (!solve_url || solve_url === '') {
    solve_url = e.solve_url || '';
  }

  // Java URL from enrichment map
  const java_url = e.java_url || '';

  return {
    id: p.id,
    problem_name: p.problem_name,
    topic: p.topic,
    difficulty: p.difficulty,
    solve_url,
    youtube_url: p.youtube_url || '',
    java_url,
  };
});

// Write enriched data
const outputPath = path.join(__dirname, 'problems.json');
fs.writeFileSync(outputPath, JSON.stringify(enriched, null, 2));

// Print validation report
const total = enriched.length;
const hasSolve = enriched.filter(p => p.solve_url).length;
const hasYT = enriched.filter(p => p.youtube_url).length;
const hasJava = enriched.filter(p => p.java_url).length;
const noSolve = enriched.filter(p => !p.solve_url);
const noYT = enriched.filter(p => !p.youtube_url);
const noJava = enriched.filter(p => !p.java_url);

console.log('\n=== VALIDATION REPORT ===');
console.log(`Total problems: ${total}`);
console.log(`With solve_url: ${hasSolve} (${Math.round(hasSolve/total*100)}%)`);
console.log(`With YouTube (Striver): ${hasYT} (${Math.round(hasYT/total*100)}%)`);
console.log(`With Java resource: ${hasJava} (${Math.round(hasJava/total*100)}%)`);
console.log(`\nMissing solve_url: ${noSolve.length}`);
if (noSolve.length > 0) console.log(noSolve.map(p => `  #${p.id} ${p.problem_name}`).join('\n'));
console.log(`\nMissing YouTube: ${noYT.length}`);
console.log(`Missing Java: ${noJava.length}`);
if (noJava.length > 0) console.log('First 10 missing Java:\n' + noJava.slice(0,10).map(p => `  #${p.id} ${p.problem_name}`).join('\n'));
console.log('\n=========================');
