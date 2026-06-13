const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./dsa_tracker/a2z_problems_simple.json', 'utf8'));

console.log(`TOTAL PROBLEMS: ${data.length}\n`);

// 1. Total problem count grouped by topic
const topicCounts = {};
data.forEach(p => {
  topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
});
console.log('1. Problem Count by Topic:');
Object.entries(topicCounts).forEach(([topic, count]) => {
  console.log(`  - ${topic}: ${count}`);
});
console.log();

// 2. First 10 and last 10 problems
console.log('2. First 10 Problems:');
data.slice(0, 10).forEach(p => console.log(`  [${p.id}] ${p.problem_name} (${p.topic})`));
console.log('\n   Last 10 Problems:');
data.slice(-10).forEach(p => console.log(`  [${p.id}] ${p.problem_name} (${p.topic})`));
console.log();

// 3, 4, 5. URLs
const validLC = data.filter(p => p.leetcode_url && p.leetcode_url.trim() !== '' && p.leetcode_url !== '$undefined').length;
const validYT = data.filter(p => p.youtube_url && p.youtube_url.trim() !== '' && p.youtube_url !== '$undefined').length;
const emptyLC = data.length - validLC;

console.log('3. Valid LeetCode URLs:', validLC);
console.log('4. Valid YouTube URLs:', validYT);
console.log('5. Empty LeetCode URLs:', emptyLC);
console.log();

// 6. Duplicate problem names
const nameCounts = {};
data.forEach(p => {
  nameCounts[p.problem_name] = (nameCounts[p.problem_name] || 0) + 1;
});
const dupNames = Object.entries(nameCounts).filter(([name, count]) => count > 1);
console.log(`6. Duplicate Problem Names: ${dupNames.length}`);
if (dupNames.length > 0) {
  dupNames.forEach(([name, count]) => console.log(`  - "${name}" appears ${count} times`));
}
console.log();

// 7. Duplicate IDs
const idCounts = {};
data.forEach(p => {
  idCounts[p.id] = (idCounts[p.id] || 0) + 1;
});
const dupIds = Object.entries(idCounts).filter(([id, count]) => count > 1);
console.log(`7. Duplicate IDs: ${dupIds.length}`);
console.log();

// 8. Sample of 20 random records
console.log('8. Random 20 Sample:');
const shuffled = [...data].sort(() => 0.5 - Math.random());
const sample = shuffled.slice(0, 20);
sample.forEach(p => {
  console.log(`  - [${p.id}] ${p.problem_name} | ${p.difficulty} | LC: ${p.leetcode_url ? 'Yes' : 'No'} | YT: ${p.youtube_url ? 'Yes' : 'No'}`);
});
