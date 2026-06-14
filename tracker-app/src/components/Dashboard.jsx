import React, { useMemo } from 'react';

export default function Dashboard({ problems, progress, completions = {}, onTopicClick }) {
  const total = problems.length;
  const solved = Object.values(progress).filter(s => s === 'solved').length;
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
  const remaining = total - solved;

  const { diffStats, nextProblem, topicsProgress, sessionStats } = useMemo(() => {
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
      percent: stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0
    }));

    // Calculate diff percentages
    Object.keys(diffMap).forEach(key => {
      diffMap[key].percent = diffMap[key].total > 0 
        ? Math.round((diffMap[key].solved / diffMap[key].total) * 100) 
        : 0;
    });

    // Session Stats
    const now = Date.now();
    const msInDay = 24 * 60 * 60 * 1000;
    
    // Start of today (midnight)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTodayMs = startOfToday.getTime();
    
    // Start of week (rolling 7 days)
    const startOfWeekMs = now - (7 * msInDay);

    let solvedToday = 0;
    let solvedThisWeek = 0;

    Object.values(completions).forEach(timestamp => {
      if (timestamp) {
        if (timestamp >= startOfTodayMs) solvedToday++;
        if (timestamp >= startOfWeekMs) solvedThisWeek++;
      }
    });

    return { 
      diffStats: diffMap, 
      nextProblem: nextProb, 
      topicsProgress: topicsArr,
      sessionStats: { today: solvedToday, week: solvedThisWeek, total: solved }
    };
  }, [problems, progress, completions]);

  return (
    <div className="dashboard">
      
      {/* Top Section: Main Progress and Session */}
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
            
            <div className="quick-stats-container">
              <div className="glass-panel stat-card" style={{ padding: '1rem' }}>
                <h4>Problems Remaining</h4>
                <div className="stat-value" style={{ fontSize: '2.5rem' }}>{remaining}</div>
              </div>
              
              <div className="glass-panel stat-card next-problem-card" style={{ padding: '1rem' }}>
                <h4>Next Unsolved</h4>
                {nextProblem ? (
                  <>
                    <div className="stat-value" style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
                      #{nextProblem.id}
                    </div>
                    <div className="next-prob-name" style={{ fontSize: '1rem' }}>{nextProblem.problem_name}</div>
                    <div className="next-prob-topic" style={{ fontSize: '0.8rem' }}>{nextProblem.topic}</div>
                  </>
                ) : (
                  <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--status-green)' }}>All Done!</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Session Stats Card */}
        <div className="glass-panel stat-card session-card" style={{ justifyContent: 'center' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--accent-secondary)' }}>Session Mode</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <div className="session-stat-row">
              <span className="session-label">Today's Solved</span>
              <span className="session-value text-glow" style={{ fontSize: '2rem' }}>{sessionStats.today}</span>
            </div>
            <div className="session-stat-row">
              <span className="session-label">This Week</span>
              <span className="session-value" style={{ fontSize: '1.8rem', color: 'var(--accent-primary)' }}>{sessionStats.week}</span>
            </div>
            <div className="session-stat-row">
              <span className="session-label">Total Solved</span>
              <span className="session-value" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{sessionStats.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Dashboard */}
      <h3 className="section-title">Difficulty Breakdown</h3>
      <div className="difficulty-dashboard glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div className="difficulty-breakdown" style={{ gap: '2rem' }}>
          {['Easy', 'Medium', 'Hard'].map(diff => {
            const stat = diffStats[diff];
            return (
              <div key={diff} className="diff-row" style={{ flex: 1 }}>
                <div className="diff-label" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  <span className="diff-name" style={{ color: stat.color, fontWeight: 'bold' }}>{diff}</span>
                  <span className="diff-count">{stat.solved} / {stat.total} <span style={{ opacity: 0.7, fontSize: '1rem', marginLeft: '0.5rem' }}>({stat.percent}%)</span></span>
                </div>
                <div className="progress-bar-bg" style={{ height: '12px', borderRadius: '6px' }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${stat.percent}%`, 
                      background: stat.color,
                      boxShadow: `0 0 15px ${stat.color}`
                    }}
                  ></div>
                </div>
              </div>
            )
          })}
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

