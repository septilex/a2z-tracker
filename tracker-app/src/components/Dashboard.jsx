import React, { useMemo } from 'react';

export default function Dashboard({ problems, progress }) {
  const total = problems.length;
  const solved = Object.values(progress).filter(s => s === 'solved').length;
  const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

  const topicsProgress = useMemo(() => {
    const map = {};
    problems.forEach(p => {
      if (!map[p.topic]) map[p.topic] = { total: 0, solved: 0 };
      map[p.topic].total++;
      if (progress[p.id] === 'solved') {
        map[p.topic].solved++;
      }
    });
    return Object.entries(map).map(([topic, stats]) => ({
      topic,
      ...stats,
      percent: Math.round((stats.solved / stats.total) * 100)
    }));
  }, [problems, progress]);

  return (
    <div>
      <div className="glass-panel overall-progress">
        <h3>Overall Progress</h3>
        <h2>{solved} / {total}</h2>
        <p>{percentage}% Completed</p>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>

      <h3>Topic Progress</h3>
      <div className="dashboard-grid">
        {topicsProgress.map(t => (
          <div key={t.topic} className="glass-panel">
            <h4 style={{ marginTop: 0, fontSize: '1rem', color: 'var(--text-secondary)' }}>{t.topic}</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{t.percent}%</span>
              <span>{t.solved} / {t.total}</span>
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
