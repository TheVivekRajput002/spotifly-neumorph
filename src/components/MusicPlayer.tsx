import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import albumCover from '@/assets/album-cover.jpg';

interface Track {
  title: string;
  artist: string;
  duration: number;
  albumArt: string;
}

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Demo track data
  const currentTrack: Track = {
    title: "Cosmic Vibes",
    artist: "Electronic Dreams",
    duration: 240, // 4 minutes in seconds
    albumArt: albumCover
  };

  // Simulate audio playback for demo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    setCurrentTime(Math.max(0, currentTime - 10));
  };

  const handleSkipForward = () => {
    setCurrentTime(Math.min(currentTrack.duration, currentTime + 10));
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    setCurrentTime(Math.floor(percentage * currentTrack.duration));
  };

  const progressPercentage = (currentTime / currentTrack.duration) * 100;

  return (
    <div className="w-80 bg-gradient-player rounded-3xl p-6 shadow-neumorphic">
      {/* Album Art */}
      <div className="relative mb-6">
        <div className="w-full h-64 rounded-2xl overflow-hidden shadow-neumorphic-inset">
          <img 
            src={currentTrack.albumArt} 
            alt={`${currentTrack.title} album cover`}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Floating volume control */}
        <div className="absolute top-4 right-4 bg-gradient-button rounded-full p-2 shadow-neumorphic-button">
          <Volume2 size={16} className="text-foreground" />
        </div>
      </div>

      {/* Track Info */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {currentTrack.title}
        </h3>
        <p className="text-muted-foreground text-sm">
          {currentTrack.artist}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div 
          className="w-full h-2 bg-progress-bg rounded-full cursor-pointer shadow-neumorphic-inset"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-gradient-progress rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-neumorphic-button"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6">
        <button 
          onClick={handleSkipBack}
          className="p-3 rounded-full bg-gradient-button shadow-neumorphic-button hover:shadow-neumorphic-button-pressed transition-all duration-150 active:scale-95"
        >
          <SkipBack size={20} className="text-foreground" />
        </button>
        
        <button 
          onClick={togglePlayPause}
          className="p-4 rounded-full bg-gradient-progress shadow-neumorphic hover:shadow-neumorphic-button-pressed transition-all duration-150 active:scale-95"
        >
          {isPlaying ? (
            <Pause size={24} className="text-primary-foreground" />
          ) : (
            <Play size={24} className="text-primary-foreground ml-1" />
          )}
        </button>
        
        <button 
          onClick={handleSkipForward}
          className="p-3 rounded-full bg-gradient-button shadow-neumorphic-button hover:shadow-neumorphic-button-pressed transition-all duration-150 active:scale-95"
        >
          <SkipForward size={20} className="text-foreground" />
        </button>
      </div>

      {/* Volume Slider */}
      <div className="mt-6 px-4">
        <div className="flex items-center space-x-3">
          <Volume2 size={16} className="text-muted-foreground" />
          <div className="flex-1 h-1 bg-progress-bg rounded-full shadow-neumorphic-inset">
            <div 
              className="h-full bg-gradient-progress rounded-full"
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Spotify Integration Notice */}
      <div className="mt-4 p-3 bg-muted rounded-xl text-center">
        <p className="text-xs text-muted-foreground">
          🎵 Connect Spotify for real playback
        </p>
      </div>
    </div>
  );
};

export default MusicPlayer;