import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Problems from './components/Problems';
import { useProgress } from './hooks/useProgress';
import { useTheme } from './hooks/useTheme';
import problemsData from './data/problems.json';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [focusProblemId, setFocusProblemId] = useState(null);
  const { progress, updateStatus } = useProgress();
  const { theme, toggleTheme } = useTheme();

  const handleContinue = () => {
    const nextProblem = problemsData.find(p => progress[p.id] !== 'solved');
    if (nextProblem) {
      setActiveTab('problems');
      setFocusProblemId(nextProblem.id);
    } else {
      alert("Congratulations! You've solved all 474 problems!");
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--accent-primary)' }}>A2Z Tracker</h1>
          <div className="nav-links">
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => { setActiveTab('dashboard'); setFocusProblemId(null); }}
            >
              Dashboard
            </button>
            <button 
              className={`nav-btn ${activeTab === 'problems' ? 'active' : ''}`}
              onClick={() => { setActiveTab('problems'); setFocusProblemId(null); }}
            >
              Problems
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button className="btn-primary" onClick={handleContinue}>
            Continue Solving
          </button>
        </div>
      </nav>

      <main>
        {activeTab === 'dashboard' && (
          <Dashboard problems={problemsData} progress={progress} />
        )}
        {activeTab === 'problems' && (
          <Problems 
            problems={problemsData} 
            progress={progress} 
            updateStatus={updateStatus} 
            focusProblemId={focusProblemId}
          />
        )}
      </main>
    </div>
  );
}

export default App;
