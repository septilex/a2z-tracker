// Extract ALL problems from the full_page.html we fetched
// The data is split across multiple self.__next_f.push() calls

const fs = require('fs');
const content = fs.readFileSync('./full_page.html', 'utf8');

console.log(`Total page size: ${content.length} chars`);
console.log(`problem_name count: ${(content.match(/problem_name/g)||[]).length}`);

// Extract all self.__next_f.push([1, "..."]) segments and concatenate
const pushRegex = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g;
let combinedPayload = '';
let pushCount = 0;
let match;
while ((match = pushRegex.exec(content)) !== null) {
  pushCount++;
  // Unescape the JS string
  let segment = match[1]
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '\n')
    .replace(/\\u0026/g, '&')
    .replace(/\\\//g, '/')
    .replace(/\\u003e/g, '>')
    .replace(/\\u003c/g, '<')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '');
  combinedPayload += segment;
}

console.log(`\nExtracted ${pushCount} push segments`);
console.log(`Combined payload size: ${combinedPayload.length} chars`);
console.log(`problem_name count in combined: ${(combinedPayload.match(/problem_name/g)||[]).length}`);

// Find all sections
const idx = combinedPayload.indexOf('"sections":[');
console.log(`sections found at: ${idx}`);

// Extract all problems block by block
// Split by category_id to handle each topic
const topicBlocks = combinedPayload.split(/"category_id":"/);
console.log(`\nTopic blocks: ${topicBlocks.length - 1}`);

let allProblems = [];
let order = 1;
let topicOrder = 0;

const topicNames = {
  '683': 'Learn the basics',
  '681': 'Learn Important Sorting Techniques',
  '686': 'Solve Problems on Arrays [Easy -> Medium -> Hard]',
  '673': 'Binary Search [1D, 2D Arrays, Search Space]',
  '689': 'Strings [Basic and Medium]',
  '682': 'Learn LinkedList [Single LL, Double LL, Medium, Hard Problems]',
  '684': 'Recursion [PatternWise]',
  '676': 'Bit Manipulation [Concepts & Problems]',
  '687': 'Stack and Queues [Learning, Pre-In-Post-fix, Monotonic Stack, Implementation]',
  '685': 'Sliding Window & Two Pointer Combined Problems',
  '680': 'Heaps [Learning, Medium, Hard Problems]',
  '679': 'Greedy Algorithms [Easy, Medium/Hard]',
  '675': 'Binary Trees [Traversals, Medium and Hard Problems]',
  '674': 'Binary Search Trees [Concept and Problems]',
  '678': 'Graphs [Concepts & Problems]',
  '677': 'Dynamic Programming [Patterns and Problems]',
  '690': 'Tries',
  '688': 'Strings'
};

// Correct topic ordering
const topicOrder_arr = ['683','681','686','673','689','682','684','676','687','685','680','679','675','674','678','677','690','688'];

for (let ti = 1; ti < topicBlocks.length; ti++) {
  const block = topicBlocks[ti];
  const catIdMatch = block.match(/^(\d+)","category_name":"([^"]+)"/);
  if (!catIdMatch) continue;
  
  const catId = catIdMatch[1];
  const catName = catIdMatch[2];
  topicOrder = topicOrder_arr.indexOf(catId) + 1;
  
  // Extract subcategory blocks
  const subBlocks = block.split(/"subcategory_id":"/);
  let subtopicOrder = 0;
  
  for (let si = 1; si < subBlocks.length; si++) {
    const subBlock = subBlocks[si];
    const subIdMatch = subBlock.match(/^(\d+)","subcategory_name":"([^"]+)"/);
    if (!subIdMatch) continue;
    subtopicOrder++;
    
    const subId = subIdMatch[1];
    const subName = subIdMatch[2].replace(/\s+/g, ' ').trim();
    
    // Match all problems - handle the split where difficulty may be cut
    // Pattern: problem fields appear in a fixed order
    const probRegex = /"problem_id":"(\d+)","problem_name":"([^"]+)","article":"([^"]*)","youtube":"([^"]*)","leetcode":"([^"]*)","plus":"([^"]*)","editorial":"([^"]*)","link":"([^"]*)","difficulty":"([^"]+)"/g;
    
    let pmatch;
    while ((pmatch = probRegex.exec(subBlock)) !== null) {
      const lc = pmatch[5] === '$undefined' || pmatch[5] === '' ? null : pmatch[5];
      const yt = pmatch[4] === '$undefined' || pmatch[4] === '' ? null : pmatch[4];
      const art = pmatch[3] === '$undefined' || pmatch[3] === '' ? null : pmatch[3];
      const diff = pmatch[9].charAt(0).toUpperCase() + pmatch[9].slice(1).toLowerCase();
      
      allProblems.push({
        order: order++,
        topic_order: topicOrder,
        topic: catName,
        subtopic: subName,
        problem_id: pmatch[1],
        problem_name: pmatch[2],
        difficulty: diff,
        leetcode_url: lc,
        youtube_url: yt,
        article_url: art
      });
    }
  }
}

console.log(`\nTotal problems extracted: ${allProblems.length}`);

// Count per topic
const topicCounts = {};
allProblems.forEach(p => {
  if (!topicCounts[p.topic]) topicCounts[p.topic] = 0;
  topicCounts[p.topic]++;
});
console.log('\nCount per topic:');
topicOrder_arr.forEach(id => {
  const name = topicNames[id];
  const count = Object.entries(topicCounts).find(([t]) => t === name);
  if (count) console.log(`  T${topicOrder_arr.indexOf(id)+1}. ${name}: ${count[1]}`);
  else console.log(`  T${topicOrder_arr.indexOf(id)+1}. ${name}: 0 (MISSING)`);
});

// Check LeetCode coverage
const withLC = allProblems.filter(p => p.leetcode_url).length;
const withYT = allProblems.filter(p => p.youtube_url).length;
console.log(`\nWith LeetCode URL: ${withLC}/${allProblems.length}`);
console.log(`With YouTube URL: ${withYT}/${allProblems.length}`);

// Save clean JSON
fs.writeFileSync('./dsa_tracker/data/problems_raw_extracted.json', JSON.stringify(allProblems, null, 2), 'utf8');

// Save ultra-clean CSV
const header = 'Order,Topic_Order,Topic,Subtopic,Problem_Name,Difficulty,LeetCode_URL,YouTube_URL\n';
const rows = allProblems.map(p => {
  const esc = s => `"${(s||'').replace(/"/g,'""')}"`;
  return [p.order, p.topic_order, esc(p.topic), esc(p.subtopic), esc(p.problem_name), p.difficulty, esc(p.leetcode_url||''), esc(p.youtube_url||'')].join(',');
}).join('\n');
fs.writeFileSync('./dsa_tracker/data/problems.csv', header + rows, 'utf8');

console.log('\nSaved:');
console.log('  - dsa_tracker/data/problems_raw_extracted.json');
console.log('  - dsa_tracker/data/problems.csv');
