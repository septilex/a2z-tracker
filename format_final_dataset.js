const fs = require('fs');

// Read the previously extracted problems
const rawProblems = JSON.parse(fs.readFileSync('./dsa_tracker/data/problems_raw_extracted.json', 'utf8'));

// The missing problem we identified
const missingProblem = {
  order: 0, // We'll re-sort and fix orders anyway
  topic_order: 11, // Heaps is topic 11
  topic: "Heaps [Learning, Medium, Hard Problems]",
  subtopic: "Medium Problems",
  problem_id: "2840",
  problem_name: "Kth smallest element in an array [use priority queue]",
  difficulty: "Medium",
  leetcode_url: null,
  youtube_url: null,
  article_url: "https://takeuforward.org/data-structure/kth-largest-smallest-element-in-an-array/"
};

// Add the missing problem and sort by topic_order and then original order
let allProblems = [...rawProblems, missingProblem];

// Fix ordering: we want them grouped by topic in the correct order.
// We already have topic_order from the previous script.
allProblems.sort((a, b) => {
  if (a.topic_order !== b.topic_order) {
    return a.topic_order - b.topic_order;
  }
  return a.order - b.order;
});

// Map to the simple format requested by the user
const simpleProblems = allProblems.map((p, index) => {
  return {
    id: index + 1,
    problem_name: p.problem_name,
    topic: p.topic,
    difficulty: p.difficulty,
    leetcode_url: p.leetcode_url || "",
    youtube_url: p.youtube_url || ""
  };
});

console.log(`Total problems ready for output: ${simpleProblems.length}`);

// Write the final simple JSON
fs.writeFileSync(
  './dsa_tracker/a2z_problems_simple.json',
  JSON.stringify(simpleProblems, null, 2),
  'utf8'
);

// Write the final simple CSV
const csvHeader = 'ID,Problem Name,Topic,Difficulty,LeetCode URL,YouTube URL\n';
const csvRows = simpleProblems.map(p => {
  const esc = s => `"${(s || '').replace(/"/g, '""')}"`;
  return [
    p.id,
    esc(p.problem_name),
    esc(p.topic),
    p.difficulty,
    esc(p.leetcode_url),
    esc(p.youtube_url)
  ].join(',');
}).join('\n');

fs.writeFileSync(
  './dsa_tracker/a2z_problems_simple.csv',
  csvHeader + csvRows,
  'utf8'
);

console.log('Successfully generated the final simple dataset:');
console.log('  - dsa_tracker/a2z_problems_simple.json');
console.log('  - dsa_tracker/a2z_problems_simple.csv');
