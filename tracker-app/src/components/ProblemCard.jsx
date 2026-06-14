import React from 'react';

export default function ProblemCard({ problem, status, updateStatus }) {
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
          {problem.leetcode_url && (
            <a href={problem.leetcode_url} target="_blank" rel="noreferrer" className="link-btn">
              [ 💻 LeetCode ]
            </a>
          )}
          {problem.youtube_url && (
            <a href={problem.youtube_url} target="_blank" rel="noreferrer" className="link-btn">
              [ 📺 YouTube ]
            </a>
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
