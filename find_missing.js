// Fix the dataset: add the one missing Heaps problem and produce final clean output
const fs = require('fs');
const problems = JSON.parse(fs.readFileSync('./dsa_tracker/data/problems_raw_extracted.json', 'utf8'));

// The missing problem in Heaps - "Kth largest element in a stream"
// This is already in our list as problem_id 2838
// Let's check what Heaps we have vs what's expected

const heaps = problems.filter(p => p.topic === 'Heaps [Learning, Medium, Hard Problems]');
console.log('Current Heaps count:', heaps.length);

// Looking at the subtopics of Heaps in A2Z:
// - Learning (theory video, implement min/max heap, check if array is min heap, convert min to max)
// - Medium problems  
// - Hard problems
// The missing 17th problem is likely "Find Median From Data Stream" is already there,
// let's check what subtopics we have

const heapSubs = {};
heaps.forEach(p => {
  if (!heapSubs[p.subtopic]) heapSubs[p.subtopic] = [];
  heapSubs[p.subtopic].push(p.problem_name);
});
console.log('\nHeaps by subtopic:');
Object.entries(heapSubs).forEach(([s, ps]) => {
  console.log(`  [${s}] (${ps.length}): ${ps.join(', ')}`);
});

// Based on the A2Z sheet the missing problem is "Kth Largest Sum in Subarrays" or 
// actually checking the raw content - the 17th is "Kth largest element in a stream of running integers"
// which IS in our list (problem_id 2838). So re-check...
// 
// The actual missing one based on what I can see in the raw HTML cut - let me check what
// the 17th problem in heaps is from the site's actual data.
// From the A2Z site the Hard subtopic has: Merge K sorted, Find Median, Min Cost to Connect Sticks,
// Task Scheduler, Hand of Straights, Design Twitter, Maximum Sum Combination,
// Kth Largest in Stream, Top K Frequent Elements = 9
// Learning: Theory video, implement min, check if array min heap, convert min to max = 4
// Medium: K-th largest, Sort K sorted, Replace Elements by Rank = 3
// That gives 16. The actual 17th...
// Let me just look at what was CUT by checking the raw HTML around the push boundary

const raw = fs.readFileSync('./full_page.html', 'utf8');
// Find all instances of problem_id in escaped form
const escMatches = [...raw.matchAll(/\\"problem_id\\":\\"(\d+)\\"/g)].map(m => m[1]);
const extractedIds = new Set(problems.map(p => p.problem_id));

console.log('\nAll escaped problem IDs in HTML:', escMatches.length);
const missingFromExtraction = escMatches.filter(id => !extractedIds.has(id));
const uniqueMissing = [...new Set(missingFromExtraction)];
console.log('Missing from extraction:', uniqueMissing);

// Also search for any cut context
uniqueMissing.forEach(id => {
  const idx = raw.indexOf(`\\"problem_id\\":\\"${id}\\"`);
  if (idx >= 0) {
    const ctx = raw.substring(Math.max(0, idx-50), idx+300);
    console.log(`\nContext for ${id}:`, ctx);
  }
});

// If there are no missing IDs, the count discrepancy is from the push boundary split
// where difficulty gets split. Let's re-examine by looking at how many UNIQUE problem_ids
// are in the raw source
const allRawIds = [...new Set([...raw.matchAll(/\\"problem_id\\":\\"(\d+)\\"/g)].map(m => m[1]))];
console.log('\nUnique IDs in raw HTML:', allRawIds.length);
console.log('IDs in extracted:', extractedIds.size);
