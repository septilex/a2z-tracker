import React, { useMemo } from 'react';

export default function Dashboard({ problems, progress, completions = {}, onTopicClick, onContinue }) {
  const total = problems.length;
  const solved = Object.values(progress).filter(s => s === 'solved').length;
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
  const remaining = total - solved;

  const { diffStats, nextProblem, topicsProgress, sessionStats, milestonesInfo } = useMemo(() => {
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
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTodayMs = startOfToday.getTime();
    const startOfWeekMs = now - (7 * msInDay);

    let solvedToday = 0;
    let solvedThisWeek = 0;

    Object.values(completions).forEach(timestamp => {
      if (timestamp) {
        if (timestamp >= startOfTodayMs) solvedToday++;
        if (timestamp >= startOfWeekMs) solvedThisWeek++;
      }
    });

    // Milestones
    const milestones = [25, 50, 100, 150, 200, 300, 400, 474];
    const completedMilestones = milestones.filter(m => solved >= m);
    const nextMilestone = milestones.find(m => solved < m) || 474;

    return { 
      diffStats: diffMap, 
      nextProblem: nextProb, 
      topicsProgress: topicsArr,
      sessionStats: { today: solvedToday, week: solvedThisWeek, total: solved },
      milestonesInfo: { milestones, completedMilestones, nextMilestone }
    };
  }, [problems, progress, completions, solved]);

  return (
    <div className="dashboard">
      
      {/* Dashboard Hero Section */}
      <div className="dashboard-hero glass-panel">
        <div className="hero-grid">
          <div className="hero-stat">
            <h4>Current Position</h4>
            <div className="hero-value text-glow">
              #{solved} <span className="sub-value">/ {total}</span>
            </div>
            <div className="hero-subtext">{percentage}% Completed</div>
          </div>
          
          <div className="hero-stat hero-next">
            <h4>Next Problem</h4>
            {nextProblem ? (
              <>
                <div className="hero-value problem-name" title={nextProblem.problem_name}>
                  {nextProblem.problem_name}
                </div>
                <div className="hero-subtext">{nextProblem.topic}</div>
              </>
            ) : (
              <div className="hero-value" style={{ color: 'var(--status-green)' }}>All Done!</div>
            )}
          </div>

          <div className="hero-stat">
            <h4>Remaining</h4>
            <div className="hero-value">{remaining}</div>
            <div className="hero-subtext">Problems to go</div>
          </div>

          <div className="hero-cta">
            <button className="btn-primary btn-massive" onClick={onContinue}>
              Continue Solving
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-middle-section">
        {/* Road to 474 & Milestones */}
        <div className="motivation-layer glass-panel">
          <h3 className="section-title" style={{ marginTop: 0 }}>Road to 474</h3>
          
          <div className="roadmap-stats">
            <div className="roadmap-stat">
              <span className="label">Total</span>
              <span className="value">474</span>
            </div>
            <div className="roadmap-stat">
              <span className="label">Solved</span>
              <span className="value" style={{ color: 'var(--accent-primary)' }}>{solved}</span>
            </div>
            <div className="roadmap-stat">
              <span className="label">Remaining</span>
              <span className="value">{remaining}</span>
            </div>
            <div className="roadmap-stat">
              <span className="label">Completion</span>
              <span className="value">{percentage}%</span>
            </div>
          </div>

          <div className="progress-bar-bg massive-progress" style={{ height: '20px', borderRadius: '10px' }}>
            <div 
              className="progress-bar-fill" 
              style={{ width: `${percentage}%`, borderRadius: '10px' }}
            ></div>
          </div>

          <div className="milestones-container">
            {milestonesInfo.milestones.map(m => {
              const isCompleted = solved >= m;
              const isNext = m === milestonesInfo.nextMilestone;
              let statusClass = 'milestone-locked';
              if (isCompleted) statusClass = 'milestone-completed';
              if (isNext) statusClass = 'milestone-next';

              return (
                <div key={m} className={`milestone ${statusClass}`}>
                  <div className="milestone-dot"></div>
                  <div className="milestone-label">{m}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session Stats Card */}
        <div className="glass-panel session-card">
          <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--accent-secondary)' }}>Session Mode</h3>
          <div className="session-grid">
            <div className="session-stat-box">
              <span className="session-label">Today's Solved</span>
              <span className="session-value text-glow" style={{ fontSize: '2.5rem' }}>{sessionStats.today}</span>
            </div>
            <div className="session-stat-box">
              <span className="session-label">This Week</span>
              <span className="session-value" style={{ fontSize: '2.5rem', color: 'var(--accent-primary)' }}>{sessionStats.week}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Dashboard */}
      <h3 className="section-title">Difficulty Breakdown</h3>
      <div className="difficulty-dashboard glass-panel">
        <div className="difficulty-breakdown">
          {['Easy', 'Medium', 'Hard'].map(diff => {
            const stat = diffStats[diff];
            return (
              <div key={diff} className="diff-row" style={{ flex: 1 }}>
                <div className="diff-label" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  <span className="diff-name" style={{ color: stat.color, fontWeight: 'bold' }}>{diff}</span>
                  <span className="diff-count">
                    {stat.solved} / {stat.total} <span style={{ opacity: 0.7, fontSize: '1rem', marginLeft: '0.5rem' }}>({stat.percent}%)</span>
                  </span>
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
