import React, { useState } from 'react';
import { useBgm } from '../hooks/useBgm';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function BgmControl() {
  const { isPlaying, volume, togglePlay, setVolume } = useBgm();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 'auto' }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="flex items-center bg-[#0A0A0B]/90 backdrop-blur-md border border-[#C5A059]/20 rounded-full px-4 py-2 gap-3 shadow-lg"
          >
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 accent-[#C5A059] h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-white/50" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#C5A059]" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={togglePlay}
        className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 shadow-xl cursor-pointer ${
          isPlaying 
            ? 'bg-[#C5A059]/10 border-[#C5A059]/50 text-[#C5A059]' 
            : 'bg-[#0A0A0B]/80 border-white/20 text-white/70 hover:border-[#C5A059]/50 hover:text-[#C5A059]'
        } backdrop-blur-md`}
        title={isPlaying ? "Pause Music" : "Play Music"}
      >
        {isPlaying ? (
          <div className="relative flex items-center justify-center">
            <Music className="w-5 h-5 opacity-30 absolute" />
            <Pause className="w-4 h-4 z-10" fill="currentColor" />
          </div>
        ) : (
          <Play className="w-5 h-5 ml-1" fill="currentColor" />
        )}
      </button>
    </div>
  );
}
