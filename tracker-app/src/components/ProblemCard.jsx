import React from 'react';

// Determine the label for the solve button based on URL domain
function getSolveLabel(url) {
  if (!url) return null;
  if (url.includes('leetcode.com')) return '🔗 Solve (LC)';
  if (url.includes('geeksforgeeks.org')) return '🔗 Solve (GFG)';
  if (url.includes('codingninjas.com') || url.includes('naukri.com/code360')) return '🔗 Solve (CN)';
  return '🔗 Solve';
}

export default function ProblemCard({ problem, status, updateStatus }) {
  const solveLabel = getSolveLabel(problem.solve_url);

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
          {/* Solve Button — LC preferred, GFG fallback */}
          {problem.solve_url ? (
            <a href={problem.solve_url} target="_blank" rel="noreferrer" className="link-btn link-btn-solve">
              {solveLabel}
            </a>
          ) : (
            <span className="link-btn link-btn-disabled">[ Solve N/A ]</span>
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
