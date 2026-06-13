import re
import json
import csv

# Read the full cached page content
with open(r'C:\Users\praji\.gemini\antigravity-ide\brain\96a106a2-f5c6-40fd-95b8-8c97729371cf\.system_generated\steps\5\content.md', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"File size: {len(content):,} bytes")

# Find the start of the sections array
marker = '"sections":['
idx = content.find(marker)
if idx == -1:
    marker = 'sections\\":\\['
    idx = content.find(marker)

print(f"Found sections at index: {idx}")

# The data is inside escaped JSON strings like \"problem_name\":\"...\"
# Extract ALL problem_name, difficulty, leetcode, youtube from escaped JSON
# Pattern to find individual problem objects

# Extract everything from sections onward
raw = content[idx:]

# Unescape the doubly-escaped JSON
raw = raw.replace('\\"', '"').replace('\\n', ' ').replace('\\u0026', '&').replace('\\/', '/')

# Now find all category_name occurrences
categories = re.findall(r'"category_name":"([^"]+)"', raw)
print(f"\nCategories found ({len(categories)}):")
for c in categories:
    print(f"  - {c}")

# Find all subcategory_names
subcats = re.findall(r'"subcategory_name":"([^"]+)"', raw)
print(f"\nSubcategories found: {len(subcats)}")

# Find all problems
problem_pattern = re.compile(
    r'"problem_id":"(\d+)"[^}]*?"problem_name":"([^"]+)"[^}]*?"article":"([^"]*)"[^}]*?"youtube":"([^"]*)"[^}]*?"leetcode":"([^"]*)"[^}]*?"difficulty":"([^"]+)"'
)
problems = problem_pattern.findall(raw)
print(f"\nProblems found: {len(problems)}")
for p in problems[:5]:
    print(f"  {p}")
