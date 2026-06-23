import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import bgmAudioFile from '../media/WhatsApp Audio 2026-06-23 at 10.28.53 PM.mp3';

interface BgmContextType {
  isPlaying: boolean;
  volume: number;
  togglePlay: () => void;
  setVolume: (v: number) => void;
}

const BgmContext = createContext<BgmContextType | undefined>(undefined);

export function BgmProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(() => {
    const savedVolume = localStorage.getItem('bgm_volume');
    return savedVolume ? parseFloat(savedVolume) : 0.5;
  });

  useEffect(() => {
    if (audioRef.current) {
      // Initialize volume
      audioRef.current.volume = volume;
      
      // Attempt autoplay unconditionally on mount
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          localStorage.setItem('bgm_playing', 'true');
        })
        .catch((err) => {
          console.warn("Autoplay blocked by browser policy:", err);
          setIsPlaying(false);
          localStorage.setItem('bgm_playing', 'false');
          
          // Setup a one-time global event listener to start audio upon first user interaction
          const unlockAudio = () => {
            if (audioRef.current && !isPlaying) {
              audioRef.current.play().then(() => {
                setIsPlaying(true);
                localStorage.setItem('bgm_playing', 'true');
                // Cleanup listeners once unlocked
                document.removeEventListener('click', unlockAudio);
                document.removeEventListener('keydown', unlockAudio);
                document.removeEventListener('touchstart', unlockAudio);
              }).catch(e => console.warn("Still blocked", e));
            }
          };

          document.addEventListener('click', unlockAudio);
          document.addEventListener('keydown', unlockAudio);
          document.addEventListener('touchstart', unlockAudio);
        });
    }
  }, []); // Run once on mount

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        localStorage.setItem('bgm_playing', 'false');
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          localStorage.setItem('bgm_playing', 'true');
        }).catch(err => {
          console.error("Failed to play audio:", err);
          alert("Gagal memutar audio. Pastikan format file didukung oleh browser Anda.");
        });
      }
    }
  };

  const setVolume = (val: number) => {
    // Clamp volume between 0.0 and 1.0
    const newVolume = Math.max(0, Math.min(1, val));
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolumeState(newVolume);
    localStorage.setItem('bgm_volume', newVolume.toString());
  };

  return (
    <BgmContext.Provider value={{ isPlaying, volume, togglePlay, setVolume }}>
      {/* Menggunakan tag audio setelah diubah format ke .mp3 */}
      <audio
        ref={audioRef}
        src={bgmAudioFile}
        loop
        autoPlay
        playsInline
        style={{ display: 'none' }}
      />
      {children}
    </BgmContext.Provider>
  );
}

export function useBgm() {
  const context = useContext(BgmContext);
  if (context === undefined) {
    throw new Error('useBgm must be used within a BgmProvider');
  }
  return context;
}
