
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { VolumeX, Volume2 } from "lucide-react";

const HOME_MUSIC_URL = "https://cdn.pixabay.com/audio/2022/10/26/audio_736636a23a.mp3";
const INTRO_MUSIC_URL = "https://cdn.pixabay.com/audio/2023/10/03/audio_78832811a2.mp3";
const GAME_MUSIC_URL = "https://cdn.pixabay.com/audio/2024/05/09/audio_651a14c33d.mp3";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true); // Start muted
  const [hasInteracted, setHasInteracted] = useState(false);
  const pathname = usePathname();

  const getMusicUrl = () => {
    if (pathname === '/') {
      return HOME_MUSIC_URL;
    }
    if (pathname.startsWith('/game/intro-')) {
      return INTRO_MUSIC_URL;
    }
    return GAME_MUSIC_URL;
  };
  
  const musicUrl = getMusicUrl();

  // Effect to handle the first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      setIsMuted(false); // Unmute on first interaction
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

    const playAudio = async () => {
      try {
        if (audio.paused) {
          await audio.play();
        }
      } catch (error) {
        console.error("Audio playback failed:", error);
        // If autoplay fails, we stay muted to avoid errors on subsequent attempts
        setIsMuted(true);
      }
    };

    if (hasInteracted && !isMuted) {
       if (audio.src !== musicUrl) {
        audio.src = musicUrl;
        audio.load();
      }
      playAudio();
    } else {
      audio.pause();
    }
  }, [musicUrl, hasInteracted, isMuted]);

  // Effect to handle mute state
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop playsInline />
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
