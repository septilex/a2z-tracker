const fs = require('fs');

const filePath = String.raw`C:\Users\praji\.gemini\antigravity-ide\brain\96a106a2-f5c6-40fd-95b8-8c97729371cf\.system_generated\steps\5\content.md`;

const content = fs.readFileSync(filePath, 'utf8');
console.log(`File size: ${content.length.toLocaleString()} bytes`);

// Find the sections array in the RSC payload
const marker = '"sections":[';
const idx = content.indexOf(marker);
console.log(`"sections":[ found at index: ${idx}`);

// Extract raw chunk from that point
let raw = content.substring(idx);

// Unescape the doubly-escaped JSON strings from RSC payload
raw = raw
  .replace(/\\"/g, '"')
  .replace(/\\n/g, ' ')
  .replace(/\\u0026/g, '&')
  .replace(/\\\//g, '/')
  .replace(/\\u003e/g, '>')
  .replace(/\\u003c/g, '<');

// Find all category names (topics)
const catMatches = [...raw.matchAll(/"category_name":"([^"]+)"/g)];
console.log(`\nTopics found: ${catMatches.length}`);
catMatches.forEach(m => console.log(`  - ${m[1]}`));

// Find all subcategory names
const subMatches = [...raw.matchAll(/"subcategory_name":"([^"]+)"/g)];
console.log(`\nSubtopics found: ${subMatches.length}`);

// Now parse the full sections JSON
// The sections array ends when we hit the next top-level key
// Try to extract valid JSON for sections
let sectionsJson = null;

// Find full sections array by counting brackets
let depth = 0;
let start = raw.indexOf('[');
let end = -1;
for (let i = start; i < raw.length; i++) {
  if (raw[i] === '[') depth++;
  else if (raw[i] === ']') {
    depth--;
    if (depth === 0) { end = i + 1; break; }
  }
}

if (end > -1) {
  const jsonStr = raw.substring(start, end);
  console.log(`\nExtracted sections JSON length: ${jsonStr.length.toLocaleString()} chars`);
  try {
    sectionsJson = JSON.parse(jsonStr);
    console.log(`Successfully parsed! ${sectionsJson.length} topics`);
  } catch(e) {
    console.log(`JSON parse error: ${e.message.substring(0, 100)}`);
    // Try to find where it breaks
    for (let i = jsonStr.length; i > 0; i -= 1000) {
      try { JSON.parse(jsonStr.substring(0, i)); console.log(`Valid up to char ${i}`); break; }
      catch(e2) {}
    }
  }
}

// Extract all problems using regex as fallback
console.log('\n--- Extracting via regex ---');
const problems = [];

// Track current category and subcategory
const catPattern = /"category_id":"(\d+)","category_name":"([^"]+)"/g;
const subPattern = /"subcategory_id":"(\d+)","subcategory_name":"([^"]+)"/g;
const probPattern = /"problem_id":"(\d+)","problem_name":"([^"]+)","article":"([^"]*)","youtube":"([^"]*)","leetcode":"([^"]*)","plus":"([^"]*)","editorial":"([^"]*)","link":"([^"]*)","difficulty":"([^"]+)"/g;

let catMap = {};
let subMap = {};

// Build category map
for (const m of raw.matchAll(/"category_id":"(\d+)","category_name":"([^"]+)"/g)) {
  catMap[m[1]] = m[2];
}
for (const m of raw.matchAll(/"subcategory_id":"(\d+)","subcategory_name":"([^"]+)"/g)) {
  subMap[m[1]] = m[2];
}

console.log('Category map:', catMap);
console.log('Subcategory count:', Object.keys(subMap).length);

// Now do a structured extraction by parsing sections block by block
// Split on category_id to get each topic block
const topicBlocks = raw.split(/"category_id":"/);
console.log(`\nTopic blocks: ${topicBlocks.length - 1}`);

let allProblems = [];
let globalOrder = 1;

for (let ti = 1; ti < topicBlocks.length; ti++) {
  const block = topicBlocks[ti];
  const catIdMatch = block.match(/^(\d+)","category_name":"([^"]+)"/);
  if (!catIdMatch) continue;
  
  const catId = catIdMatch[1];
  const catName = catIdMatch[2];
  
  // Split into subcategory blocks
  const subBlocks = block.split(/"subcategory_id":"/);
  
  for (let si = 1; si < subBlocks.length; si++) {
    const subBlock = subBlocks[si];
    const subIdMatch = subBlock.match(/^(\d+)","subcategory_name":"([^"]+)"/);
    if (!subIdMatch) continue;
    
    const subId = subIdMatch[1];
    const subName = subIdMatch[2];
    
    // Extract all problems in this subcategory
    const probRegex = /"problem_id":"(\d+)","problem_name":"([^"]+)","article":"([^"]*)","youtube":"([^"]*)","leetcode":"([^"]*)","plus":"([^"]*)","editorial":"([^"]*)","link":"([^"]*)","difficulty":"([^"]+)"/g;
    
    let match;
    while ((match = probRegex.exec(subBlock)) !== null) {
      const leetcode = match[5] === '$undefined' ? '' : match[5];
      const youtube = match[4] === '$undefined' ? '' : match[4];
      
      allProblems.push({
        order: globalOrder++,
        problem_id: match[1],
        problem_name: match[2],
        topic: catName,
        subtopic: subName.replace(/\\n\s+/g, ' ').trim(),
        difficulty: match[9],
        leetcode_url: leetcode,
        youtube_url: youtube,
        article_url: match[3] === '$undefined' ? '' : match[3]
      });
    }
  }
}

console.log(`\nTotal problems extracted: ${allProblems.length}`);

// Show first few per topic
const byTopic = {};
allProblems.forEach(p => {
  if (!byTopic[p.topic]) byTopic[p.topic] = 0;
  byTopic[p.topic]++;
});

console.log('\nProblems per topic:');
Object.entries(byTopic).forEach(([t, c]) => console.log(`  ${t}: ${c}`));

// Save JSON
fs.writeFileSync(
  'C:\\Users\\praji\\dsastriver\\dsa_tracker\\data\\problems_raw_extracted.json',
  JSON.stringify(allProblems, null, 2),
  'utf8'
);

// Save CSV
const csvHeader = 'Order,Problem ID,Problem Name,Topic,Subtopic,Difficulty,LeetCode URL,YouTube URL\n';
const csvRows = allProblems.map(p => {
  const esc = (s) => `"${(s||'').replace(/"/g, '""')}"`;
  return [p.order, p.problem_id, esc(p.problem_name), esc(p.topic), esc(p.subtopic), p.difficulty, esc(p.leetcode_url), esc(p.youtube_url)].join(',');
}).join('\n');

fs.writeFileSync(
  'C:\\Users\\praji\\dsastriver\\dsa_tracker\\data\\problems.csv',
  csvHeader + csvRows,
  'utf8'
);

console.log('\nFiles saved:');
console.log('  - dsa_tracker/data/problems_raw_extracted.json');
console.log('  - dsa_tracker/data/problems.csv');
