import React, { useMemo } from 'react';

export default function Dashboard({ problems, progress, onTopicClick }) {
  const total = problems.length;
  const solved = Object.values(progress).filter(s => s === 'solved').length;
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
  const remaining = total - solved;

  const { diffStats, nextProblem, topicsProgress } = useMemo(() => {
    const diffMap = {
      Easy: { total: 0, solved: 0, color: 'var(--status-green)' },
      Medium: { total: 0, solved: 0, color: 'var(--status-orange)' },
      Hard: { total: 0, solved: 0, color: 'var(--status-red)' }
    };
    
    const topicMap = {};
    let nextProb = null;

    problems.forEach(p => {
      // Difficulty stats
      if (diffMap[p.difficulty]) {
        diffMap[p.difficulty].total++;
        if (progress[p.id] === 'solved') {
          diffMap[p.difficulty].solved++;
        }
      }

      // Topic stats
      if (!topicMap[p.topic]) topicMap[p.topic] = { total: 0, solved: 0 };
      topicMap[p.topic].total++;
      if (progress[p.id] === 'solved') {
        topicMap[p.topic].solved++;
      }

      // Next unsolved
      if (progress[p.id] !== 'solved' && !nextProb) {
        nextProb = p;
      }
    });

    const topicsArr = Object.entries(topicMap).map(([topic, stats]) => ({
      topic,
      ...stats,
      percent: Math.round((stats.solved / stats.total) * 100)
    }));

    // Calculate diff percentages
    Object.keys(diffMap).forEach(key => {
      diffMap[key].percent = diffMap[key].total > 0 
        ? Math.round((diffMap[key].solved / diffMap[key].total) * 100) 
        : 0;
    });

    return { diffStats: diffMap, nextProblem: nextProb, topicsProgress: topicsArr };
  }, [problems, progress]);

  return (
    <div className="dashboard">
      
      {/* Top Section: Main Progress and Quick Stats */}
      <div className="dashboard-top-section">
        {/* Main Progress Card */}
        <div className="glass-panel main-progress-card">
          <div className="main-progress-header">
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-secondary)' }}>Overall Progress</h3>
              <h2 style={{ fontSize: '3.5rem', margin: '0.5rem 0', color: 'var(--text-primary)' }}>
                <span className="text-glow">{solved}</span> <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>/ {total}</span>
              </h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', margin: 0, fontWeight: 'bold' }}>{percentage}% Completed</p>
            </div>
            
            <div className="difficulty-breakdown">
              {['Easy', 'Medium', 'Hard'].map(diff => {
                const stat = diffStats[diff];
                return (
                  <div key={diff} className="diff-row">
                    <div className="diff-label">
                      <span className="diff-name">{diff}</span>
                      <span className="diff-count">{stat.solved} / {stat.total}</span>
                    </div>
                    <div className="progress-bar-bg" style={{ marginTop: '0.5rem', height: '8px' }}>
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${stat.percent}%`, 
                          background: stat.color,
                          boxShadow: `0 0 10px ${stat.color}`
                        }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick Stats Column */}
        <div className="quick-stats-container">
          <div className="glass-panel stat-card">
            <h4>Problems Remaining</h4>
            <div className="stat-value">{remaining}</div>
          </div>
          
          <div className="glass-panel stat-card next-problem-card">
            <h4>Next Unsolved</h4>
            {nextProblem ? (
              <>
                <div className="stat-value" style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>
                  #{nextProblem.id}
                </div>
                <div className="next-prob-name">{nextProblem.problem_name}</div>
                <div className="next-prob-topic">{nextProblem.topic}</div>
              </>
            ) : (
              <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--status-green)' }}>All Done!</div>
            )}
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <h3 className="section-title">Topic Progress</h3>
      <div className="dashboard-grid">
        {topicsProgress.map(t => (
          <div 
            key={t.topic} 
            className="glass-panel topic-card"
            style={{ cursor: 'pointer' }}
            onClick={() => onTopicClick && onTopicClick(t.topic)}
          >
            <h4 className="topic-title" title={t.topic}>{t.topic}</h4>
            <div className="topic-stats">
              <span className="topic-percent">{t.percent}%</span>
              <span className="topic-count">{t.solved} / {t.total}</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${t.percent}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
