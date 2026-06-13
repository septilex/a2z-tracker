// Expected counts per topic from the live page:
// Learn the basics: 54
// Learn Important Sorting Techniques: 7
// Solve Problems on Arrays: 40
// Binary Search: 32
// Strings [Basic and Medium]: 15
// Learn LinkedList: 31
// Recursion: 25
// Bit Manipulation: 18
// Stack and Queues: 30
// Sliding Window: 12
// Heaps: 17
// Greedy: 15
// Binary Trees: 38
// BST: 16
// Graphs: 53
// DP: 55
// Tries: 7
// Strings: 9
// TOTAL: 474

// We extracted 414. Let's see where the gaps are by checking what we have

const fs = require('fs');
const existing = JSON.parse(fs.readFileSync('./dsa_tracker/data/problems_raw_extracted.json', 'utf8'));

const expectedCounts = {
  'Learn the basics': 54,
  'Learn Important Sorting Techniques': 7,
  'Solve Problems on Arrays [Easy -> Medium -> Hard]': 40,
  'Binary Search [1D, 2D Arrays, Search Space]': 32,
  'Strings [Basic and Medium]': 15,
  'Learn LinkedList [Single LL, Double LL, Medium, Hard Problems]': 31,
  'Recursion [PatternWise]': 25,
  'Bit Manipulation [Concepts & Problems]': 18,
  'Stack and Queues [Learning, Pre-In-Post-fix, Monotonic Stack, Implementation]': 30,
  'Sliding Window & Two Pointer Combined Problems': 12,
  'Heaps [Learning, Medium, Hard Problems]': 17,
  'Greedy Algorithms [Easy, Medium/Hard]': 15,
  'Binary Trees [Traversals, Medium and Hard Problems]': 38,
  'Binary Search Trees [Concept and Problems]': 16,
  'Graphs [Concepts & Problems]': 53,
  'Dynamic Programming [Patterns and Problems]': 55,
  'Tries': 7,
  'Strings': 9
};

const actualCounts = {};
existing.forEach(p => {
  if (!actualCounts[p.topic]) actualCounts[p.topic] = 0;
  actualCounts[p.topic]++;
});

console.log('\n=== GAP ANALYSIS ===');
let totalMissing = 0;
Object.entries(expectedCounts).forEach(([topic, expected]) => {
  const actual = actualCounts[topic] || 0;
  const missing = expected - actual;
  if (missing !== 0) {
    console.log(`MISSING ${missing} in: ${topic} (have ${actual}, need ${expected})`);
    totalMissing += missing;
  } else {
    console.log(`OK: ${topic} (${actual})`);
  }
});
console.log(`\nTotal missing: ${totalMissing}`);
