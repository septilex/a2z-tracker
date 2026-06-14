import { useState, useEffect } from 'react';

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('dsa_tracker_progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('dsa_tracker_progress', JSON.stringify(progress));
  }, [progress]);

  const updateStatus = (problemId, status) => {
    setProgress((prev) => ({
      ...prev,
      [problemId]: status,
    }));
  };

  return { progress, updateStatus };
}
