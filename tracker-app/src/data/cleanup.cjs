/**
 * Cleanup Script: Enforce LC > GFG-only solve_url policy.
 * - Keep: leetcode.com/problems/, geeksforgeeks.org
 * - Strip: codingninjas, naukri/code360, discussion pages,
 *          solution pages, login redirects, aggregators
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'problems.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Manual overrides: replace CN/bad links with GFG equivalents
// (only for problems that have no LC equivalent)
const gfgOverrides = {
  406: 'https://www.geeksforgeeks.org/frog-jump-dp-3/',
  407: 'https://www.geeksforgeeks.org/frog-jump-k-jumps-allowed/',
  410: 'https://www.geeksforgeeks.org/maximum-sum-values-chose-every-ith-ii-element/',
  415: 'https://www.geeksforgeeks.org/chocolate-distribution-problem-set-2/',
  416: 'https://www.geeksforgeeks.org/subset-sum-problem-dp-25/',
  419: 'https://www.geeksforgeeks.org/count-of-subsets-with-sum-equal-to-k/',
  420: 'https://www.geeksforgeeks.org/partition-a-set-into-two-subsets-such-that-the-difference-of-subset-sums-is-minimum/',
  425: 'https://www.geeksforgeeks.org/unbounded-knapsack-repetition-items-allowed/',
  426: 'https://www.geeksforgeeks.org/cutting-a-rod-dp-13/',
  427: 'https://leetcode.com/problems/longest-common-subsequence/',
  429: 'https://www.geeksforgeeks.org/longest-common-substring-dp-29/',
  448: 'https://www.geeksforgeeks.org/longest-bitonic-subsequence-dp-15/',
  450: 'https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/',
  451: 'https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/',
};

function isValidSolveUrl(url) {
  if (!url || url.trim() === '') return false;
  // Only accept LC problems path or GFG
  const isLC = url.includes('leetcode.com/problems/');
  const isGFG = url.includes('geeksforgeeks.org/');
  return isLC || isGFG;
}

function isJunkUrl(url) {
  if (!url) return true;
  const junk = [
    'codingninjas.com',
    'naukri.com/code360',
    'code360',
    '/discuss/',
    '/discussion/',
    '/solution/',
    '/accounts/login/',
    'stackoverflow.com',
    'medium.com',
    'github.com',
    'takeuforward.org',
  ];
  return junk.some(j => url.includes(j));
}

function cleanLCUrl(url) {
  if (!url) return '';
  // Strip browser text fragment
  url = url.replace(/#:~:text=.*$/, '');
  // Normalize trailing slash
  if (url.includes('leetcode.com/problems/') && !url.endsWith('/')) url += '/';
  return url;
}

const cleaned = data.map(p => {
  let solve_url = cleanLCUrl(p.solve_url || '');

  // Apply manual GFG override if set
  if (gfgOverrides[p.id]) {
    solve_url = gfgOverrides[p.id];
  }

  // Strip junk URLs  
  if (isJunkUrl(solve_url) || !isValidSolveUrl(solve_url)) {
    solve_url = '';
  }

  return { ...p, solve_url };
});

fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2));

// === Validation Report ===
const total = cleaned.length;
const withLC = cleaned.filter(p => p.solve_url && p.solve_url.includes('leetcode.com/problems/'));
const withGFG = cleaned.filter(p => p.solve_url && p.solve_url.includes('geeksforgeeks.org'));
const withNone = cleaned.filter(p => !p.solve_url);
const withJava = cleaned.filter(p => p.java_url && p.java_url.trim() !== '');
const withoutJava = cleaned.filter(p => !p.java_url || p.java_url.trim() === '');

console.log('\n=== VALIDATION REPORT ===');
console.log(`Total problems       : ${total}`);
console.log(`With LeetCode link   : ${withLC.length} (${Math.round(withLC.length/total*100)}%)`);
console.log(`With GFG-only link   : ${withGFG.length} (${Math.round(withGFG.length/total*100)}%)`);
console.log(`With NO practice link: ${withNone.length} (${Math.round(withNone.length/total*100)}%)`);
console.log(`With Java resource   : ${withJava.length} (${Math.round(withJava.length/total*100)}%)`);
console.log(`Without Java resource: ${withoutJava.length} (${Math.round(withoutJava.length/total*100)}%)`);
console.log('\nProblems with NO practice link:');
withNone.forEach(p => console.log(`  #${p.id}  ${p.problem_name}`));
console.log('=========================\n');
