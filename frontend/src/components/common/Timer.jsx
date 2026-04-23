import React, { useState, useEffect } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

const Timer = ({ duration = 0, onTimeUp, size = 18, className = "" }) => {
  const [timeLeft, setTimeLeft] = useState(duration > 0 ? duration : 0);

  useEffect(() => {
    // Sync if duration prop changes externally
    if (duration > 0) {
       setTimeLeft(duration);
    }
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalId);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  // Fallback if no valid duration
  if (duration === undefined || duration === null) {
     return null; 
  }

  const formatTime = (secs) => {
    if (secs <= 0) return '00:00:00';
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return h === '00' ? `${m}:${s}` : `${h}:${m}:${s}`;
  };

  return (
    <div className={`flex items-center font-black ${className}`}>
      <TimerIcon size={size} className="mr-2 shrink-0 animate-pulse" />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;
