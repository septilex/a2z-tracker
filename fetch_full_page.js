const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'takeuforward.org',
  path: '/dsa/strivers-a2z-sheet-learn-dsa-a-to-z',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'identity',
    'Connection': 'keep-alive'
  }
};

console.log('Fetching page...');
let data = '';

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Content-Length: ${res.headers['content-length'] || 'unknown'}`);
  
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    data += chunk;
    if (data.length % 100000 < chunk.length) {
      process.stdout.write(`Downloaded: ${(data.length/1024).toFixed(0)}KB\r`);
    }
  });
  
  res.on('end', () => {
    console.log(`\nTotal downloaded: ${(data.length/1024).toFixed(0)}KB`);
    fs.writeFileSync('./full_page.html', data, 'utf8');
    console.log('Saved to full_page.html');
    
    // Check how much problem data we got
    const catCount = (data.match(/category_name/g) || []).length;
    const probCount = (data.match(/problem_name/g) || []).length;
    console.log(`category_name occurrences: ${catCount}`);
    console.log(`problem_name occurrences: ${probCount}`);
    
    // Check if it's truncated
    const lastProb = data.lastIndexOf('problem_name');
    console.log(`Last problem_name at: ${lastProb} / ${data.length}`);
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.setTimeout(30000, () => {
  console.log(`Timeout! Downloaded so far: ${(data.length/1024).toFixed(0)}KB`);
  req.destroy();
});

req.end();
