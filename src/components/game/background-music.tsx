
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { VolumeX, Volume2 } from "lucide-react";

const HOME_MUSIC_URL = "https://cdn.pixabay.com/audio/2022/10/26/audio_736636a23a.mp3";
const INTRO_MUSIC_URL = "https://cdn.pixabay.com/audio/2023/10/24/audio_b863897a66.mp3"; 
const HORROR_PIANO_URL = "https://cdn.pixabay.com/audio/2023/10/24/audio_b863897a66.mp3";


export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const pathname = usePathname();

  const getMusicUrl = (path: string) => {
    if (path === '/') {
      return HOME_MUSIC_URL;
    }
    if (path.startsWith('/game/intro-')) {
      return INTRO_MUSIC_URL;
    }
    if (path.startsWith('/game/')) {
       return HORROR_PIANO_URL;
    }
    // Fallback for game over or success pages
    if (path.startsWith('/game-over') || path.startsWith('/success')) {
        return HOME_MUSIC_URL;
    }
    return ""; // Return empty string if no match
  };
  
  // Effect to handle the first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Effect to control play/pause and track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const newMusicUrl = getMusicUrl(pathname);

    if (newMusicUrl && audio.src !== newMusicUrl) {
        audio.src = newMusicUrl;
        audio.load();
        if(hasInteracted) {
            audio.play().catch(e => console.error("Audio play on track change failed:", e));
        }
    } else if (!newMusicUrl) {
        audio.pause();
    }
    
    audio.muted = isMuted;

  }, [pathname, hasInteracted, isMuted]);

  const toggleMute = () => {
    // If this is the first interaction, it will also trigger the playback
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    setIsMuted(!isMuted);
  };

  return (
    <>
      {/* We don't set the src here initially to avoid errors */}
      <audio ref={audioRef} loop playsInline />
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="fixed bottom-4 right-4 z-50 text-foreground/50 hover:text-foreground"
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? <VolumeX /> : <Volume2 />}
      </Button>
    </>
  );
}
