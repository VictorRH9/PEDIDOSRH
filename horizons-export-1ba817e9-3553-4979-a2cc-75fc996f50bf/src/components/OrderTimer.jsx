
import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

const OrderTimer = ({ startTime, initialElapsed = 0, isActive }) => {
  const [elapsedTime, setElapsedTime] = useState(initialElapsed);

  useEffect(() => {
    let interval;
    if (isActive && startTime) {
      // Calculate initial elapsed time based on current time and start time
      const alreadyElapsed = Date.now() - new Date(startTime).getTime();
      setElapsedTime(initialElapsed + alreadyElapsed); 
      
      interval = setInterval(() => {
        // Update elapsed time based on original start time
        setElapsedTime(initialElapsed + (Date.now() - new Date(startTime).getTime()));
      }, 1000);
    } else if (!isActive) {
      // If not active, just show the initialElapsed which should be the final duration
      setElapsedTime(initialElapsed);
    }
    return () => clearInterval(interval);
  }, [startTime, initialElapsed, isActive]);

  const formatTime = (ms) => {
    if (ms < 0) ms = 0; // Ensure time is not negative
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center text-xs text-amber-400 mt-1">
      <Timer size={14} className="mr-1" />
      {formatTime(elapsedTime)}
    </div>
  );
};

export default OrderTimer;
