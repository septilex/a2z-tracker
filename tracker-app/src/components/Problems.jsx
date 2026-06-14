import React, { useState, useMemo, useEffect, useRef } from 'react';
import ProblemCard from './ProblemCard';

export default function Problems({ problems, progress, updateStatus, focusTrigger, initialTopic }) {
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState(initialTopic || '');
  const [diffFilter, setDiffFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const containerRef = useRef(null);

  useEffect(() => {
    if (initialTopic) {
      setTopicFilter(initialTopic);
      setSearch('');
      setDiffFilter('');
      setStatusFilter('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialTopic]);

  useEffect(() => {
    if (focusTrigger && focusTrigger.id) {
      // Clear filters so the problem is definitely visible
      setSearch('');
      setTopicFilter('');
      setDiffFilter('');
      setStatusFilter('');
      
      // Give DOM time to clear filters and render
      setTimeout(() => {
        const el = document.getElementById(`problem-${focusTrigger.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.style.border = '2px solid var(--accent-primary)';
          el.style.transform = 'scale(1.02)';
          setTimeout(() => {
            el.style.border = '1px solid var(--border-color)';
            el.style.transform = 'scale(1)';
          }, 2000);
        }
      }, 100);
    }
  }, [focusTrigger]);

  const topics = useMemo(() => [...new Set(problems.map(p => p.topic))], [problems]);

  const filtered = useMemo(() => {
    return problems.filter(p => {
      const matchSearch = p.problem_name.toLowerCase().includes(search.toLowerCase());
      const matchTopic = topicFilter ? p.topic === topicFilter : true;
      const matchDiff = diffFilter ? p.difficulty === diffFilter : true;
      const status = progress[p.id] || 'not_started';
      const matchStatus = statusFilter ? status === statusFilter : true;
      return matchSearch && matchTopic && matchDiff && matchStatus;
    });
  }, [problems, progress, search, topicFilter, diffFilter, statusFilter]);

  return (
    <div ref={containerRef}>
      <div className="filters">
        <input 
          type="text" 
          placeholder="Search problems..." 
          className="input-field"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="select-field" value={topicFilter} onChange={e => setTopicFilter(e.target.value)}>
          <option value="">All Topics</option>
          {topics.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="select-field" value={diffFilter} onChange={e => setDiffFilter(e.target.value)}>
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select className="select-field" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="solved">Solved</option>
        </select>
      </div>

      <div>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Showing {filtered.length} problems
        </p>
        {filtered.map(p => (
          <div id={`problem-${p.id}`} key={p.id} style={{ transition: 'all 0.3s ease' }}>
            <ProblemCard 
              problem={p} 
              status={progress[p.id] || 'not_started'} 
              updateStatus={updateStatus} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
