import React from 'react';

// Returns button metadata based on solve_url domain
function getSolveInfo(url) {
  if (!url) {
    return { label: 'No Practice Link', platform: null, cls: 'link-btn-disabled', disabled: true };
  }
  if (url.includes('leetcode.com')) {
    return { label: 'Solve (LC)', platform: 'LC', cls: 'link-btn-lc', disabled: false };
  }
  if (url.includes('geeksforgeeks.org')) {
    return { label: 'Solve (GFG)', platform: 'GFG', cls: 'link-btn-gfg-solve', disabled: false };
  }
  return { label: 'No Practice Link', platform: null, cls: 'link-btn-disabled', disabled: true };
}

export default function ProblemCard({ problem, status, updateStatus }) {
  const solve = getSolveInfo(problem.solve_url);
  const isGFGOnly = solve.platform === 'GFG';

  return (
    <div className="glass-panel problem-card">
      <div className="problem-header">
        <div className="problem-title-row">
          <h3 className="problem-title">{problem.id}. {problem.problem_name}</h3>
          {/* GFG-only badge — shown when no LC equivalent exists */}
          {isGFGOnly && (
            <span
              className="badge badge-no-lc"
              title="No exact LeetCode equivalent. This problem is GFG-exclusive or a conceptual lesson."
            >
              GFG Only
            </span>
          )}
        </div>
        <div className="problem-meta">
          <span className="badge badge-topic">{problem.topic}</span>
          <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
            {problem.difficulty}
          </span>
        </div>
      </div>

      <div className="problem-actions">
        <div className="links">
          {/* Solve Button — LC (blue/cyan) or GFG (green) */}
          {solve.disabled ? (
            <span className={`link-btn ${solve.cls}`} title="No practice link available">
              🚫 {solve.label}
            </span>
          ) : (
            <a
              href={problem.solve_url}
              target="_blank"
              rel="noreferrer"
              className={`link-btn ${solve.cls}`}
              title={solve.platform === 'LC' ? 'Open on LeetCode' : 'Open on GeeksForGeeks (no exact LC equivalent)'}
            >
              {solve.platform === 'LC' ? '⚡' : '📗'} {solve.label}
            </a>
          )}

          {/* Striver Button */}
          {problem.youtube_url ? (
            <a href={problem.youtube_url} target="_blank" rel="noreferrer" className="link-btn link-btn-striver">
              📺 Striver
            </a>
          ) : (
            <span className="link-btn link-btn-disabled" title="No Striver video available">📺 Striver</span>
          )}

          {/* Java Button */}
          {problem.java_url ? (
            <a href={problem.java_url} target="_blank" rel="noreferrer" className="link-btn link-btn-java">
              ☕ Java
            </a>
          ) : (
            <span className="link-btn link-btn-disabled" title="No Java resource available">☕ Java</span>
          )}
        </div>

        <select
          className={`status-select status-${status}`}
          value={status}
          onChange={(e) => updateStatus(problem.id, e.target.value)}
        >
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="solved">Solved</option>
        </select>
      </div>
    </div>
  );
}
