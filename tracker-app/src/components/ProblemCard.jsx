import React from 'react';

// Determine button label + class from the solve_url domain
function getSolveInfo(url) {
  if (!url) return { label: 'No Practice Link', cls: 'link-btn-disabled', disabled: true };
  if (url.includes('leetcode.com')) return { label: '🔗 Solve (LC)', cls: 'link-btn-solve', disabled: false };
  if (url.includes('geeksforgeeks.org')) return { label: '🔗 Solve (GFG)', cls: 'link-btn-solve link-btn-gfg', disabled: false };
  return { label: 'No Practice Link', cls: 'link-btn-disabled', disabled: true };
}

export default function ProblemCard({ problem, status, updateStatus }) {
  const solve = getSolveInfo(problem.solve_url);

  return (
    <div className="glass-panel problem-card">
      <div className="problem-header">
        <div>
          <h3 className="problem-title">{problem.id}. {problem.problem_name}</h3>
          <div className="problem-meta">
            <span className="badge badge-topic">{problem.topic}</span>
            <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="problem-actions">
        <div className="links">
          {/* Solve Button */}
          {solve.disabled ? (
            <span className={`link-btn ${solve.cls}`}>{solve.label}</span>
          ) : (
            <a href={problem.solve_url} target="_blank" rel="noreferrer" className={`link-btn ${solve.cls}`}>
              {solve.label}
            </a>
          )}

          {/* Striver Button */}
          {problem.youtube_url ? (
            <a href={problem.youtube_url} target="_blank" rel="noreferrer" className="link-btn link-btn-striver">
              📺 Striver
            </a>
          ) : (
            <span className="link-btn link-btn-disabled">📺 Striver</span>
          )}

          {/* Java Button */}
          {problem.java_url ? (
            <a href={problem.java_url} target="_blank" rel="noreferrer" className="link-btn link-btn-java">
              ☕ Java
            </a>
          ) : (
            <span className="link-btn link-btn-disabled">☕ Java</span>
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
