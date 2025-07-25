import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface TimerMode {
  name: string;
  duration: number; // in seconds
  color: string;
}

const ProductivityTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes default
  const [currentMode, setCurrentMode] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const modes: TimerMode[] = [
    { name: 'Focus', duration: 1500, color: '#FF6B35' }, // 25 min - orange
    { name: 'Short Break', duration: 300, color: '#4ECDC4' }, // 5 min - teal
    { name: 'Long Break', duration: 900, color: '#45B7D1' }, // 15 min - blue
  ];

  const currentModeData = modes[currentMode];
  const totalTime = currentModeData.duration;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // SVG circle properties
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            // Auto switch to next mode
            const nextMode = currentMode === 0 ? 1 : currentMode === 1 ? 0 : 0;
            setCurrentMode(nextMode);
            return modes[nextMode].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, currentMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(currentModeData.duration);
  };

  const switchMode = (modeIndex: number) => {
    setIsRunning(false);
    setCurrentMode(modeIndex);
    setTimeLeft(modes[modeIndex].duration);
  };

  return (
    <div className="w-80 bg-gray-900 rounded-3xl p-6 shadow-2xl">
      {/* Header with tomato emoji and settings */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl">🍅</div>
        <h2 className="text-white font-semibold">{currentModeData.name}</h2>
        <Settings size={20} className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
      </div>

      {/* Mode selector */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-800 rounded-full p-1 flex">
          {modes.map((mode, index) => (
            <button
              key={mode.name}
              onClick={() => switchMode(index)}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                currentMode === index
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {mode.name}
            </button>
          ))}
        </div>
      </div>

      {/* Circular Timer */}
      <div className="relative flex items-center justify-center mb-8">
        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={currentModeData.color}
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: isRunning ? 'stroke-dashoffset 1s linear' : 'stroke-dashoffset 0.3s ease-out',
              filter: isRunning ? `drop-shadow(0 0 10px ${currentModeData.color}40)` : 'none',
            }}
          />
        </svg>
        
        {/* Timer display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-mono font-bold text-white mb-2">
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-gray-400">
            {isRunning ? 'Focus time!' : 'Ready to focus?'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={resetTimer}
          className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-200 active:scale-95"
        >
          <RotateCcw size={20} className="text-gray-300" />
        </button>

        <button
          onClick={toggleTimer}
          className={`p-6 rounded-full transition-all duration-200 active:scale-95 ${
            isRunning
              ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30'
              : `shadow-lg shadow-orange-600/30`
          }`}
          style={{
            backgroundColor: isRunning ? '#DC2626' : currentModeData.color,
          }}
        >
          {isRunning ? (
            <Pause size={28} className="text-white" />
          ) : (
            <Play size={28} className="text-white ml-1" />
          )}
        </button>

        <button
          onClick={() => switchMode((currentMode + 1) % modes.length)}
          className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-200 active:scale-95"
        >
          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${progress}%`,
              backgroundColor: currentModeData.color,
              boxShadow: isRunning ? `0 0 10px ${currentModeData.color}40` : 'none',
            }}
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          🎯 Stay focused and boost your productivity!
        </p>
      </div>
    </div>
  );
};

export default ProductivityTimer;