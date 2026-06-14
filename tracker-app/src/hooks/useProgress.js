import { useState, useEffect, useCallback } from 'react';

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('dsa_tracker_progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [completions, setCompletions] = useState(() => {
    const saved = localStorage.getItem('dsa_tracker_completions');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('dsa_tracker_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('dsa_tracker_completions', JSON.stringify(completions));
  }, [completions]);

  const updateStatus = useCallback((problemId, status) => {
    setProgress((prev) => ({
      ...prev,
      [problemId]: status,
    }));

    if (status === 'solved') {
      setCompletions((prev) => {
        // If already solved, preserve the original timestamp
        if (prev[problemId]) return prev;
        return {
          ...prev,
          [problemId]: Date.now(),
        };
      });
    } else {
      setCompletions((prev) => {
        if (!prev[problemId]) return prev;
        const newCompletions = { ...prev };
        delete newCompletions[problemId];
        return newCompletions;
      });
    }
  }, []);

  return { progress, completions, updateStatus };
}
