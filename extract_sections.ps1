$content = Get-Content 'C:\Users\praji\.gemini\antigravity-ide\brain\96a106a2-f5c6-40fd-95b8-8c97729371cf\.system_generated\steps\5\content.md' -Raw

# Extract all problem_name occurrences
$idx = $content.IndexOf("category_name")
$chunk = $content.Substring($idx - 100, [Math]::Min(200000, $content.Length - $idx + 100))
Write-Output $chunk.Substring(0, 5000)
