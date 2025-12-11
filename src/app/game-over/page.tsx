"use client";

import { Button } from "@/components/ui/button";
import { gameOverContent } from "@/lib/game-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// NOTE: This is a placeholder video. In a real application, this would be a proper jumpscare video/gif.
const JUMPSCARE_VIDEO_URL = "https://storage.googleapis.com/nightmare/nightmare%20(1).mp4"; 
const SCREAM_SOUND_URL = "https://cdn.pixabay.com/audio/2022/10/05/audio_55a16d549a.mp3";

export default function GameOverPage() {
  const [showJumpscare, setShowJumpscare] = useState(true);
  const [showPoster, setShowPoster] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const searchParams = useSearchParams();
  const consequence = searchParams.get('consequence');
  const reason = searchParams.get('reason');

  const posterData = PlaceHolderImages.find(img => img.id === gameOverContent.moviePoster.image.id);

  useEffect(() => {
    // Attempt to play the scream sound as soon as the component mounts
    if (showJumpscare && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }

    const jumpscareTimer = setTimeout(() => {
      setShowJumpscare(false);
      setShowPoster(true);
    }, 2500); // Duration of the "jumpscare"

    return () => clearTimeout(jumpscareTimer);
  }, [showJumpscare]);

  let failureText = consequence || gameOverContent.text;
  if (reason === 'timeout') {
    failureText = "You hesitated for too long. The darkness consumed you."
  }

  if (showJumpscare) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <video 
          src={JUMPSCARE_VIDEO_URL} 
          autoPlay 
          muted
          playsInline
          className="w-auto h-auto min-w-full min-h-full" 
          aria-label="Jumpscare sequence"
        />
        <audio ref={audioRef} src={SCREAM_SOUND_URL} preload="auto" aria-label="Scream sound effect"></audio>
         <div className="absolute inset-0 bg-black/50 animate-pulse"></div>
      </div>
    );
  }

  if (showPoster) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black animate-fade-in">
        <div className="text-center text-white">
          <p className="text-2xl text-primary font-bold mb-4">{failureText}</p>
          <div className="relative w-80 max-w-[80vw] mx-auto my-8 border-4 border-primary/50 shadow-2xl shadow-primary/20">
            {posterData && (
              <Image
                src={posterData.imageUrl}
                alt={posterData.description}
                width={800}
                height={1200}
                className="w-full h-auto"
                data-ai-hint={posterData.imageHint}
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent">
              <h2 className="text-4xl font-headline font-extrabold text-white tracking-widest uppercase">
                {gameOverContent.moviePoster.title}
              </h2>
              <p className="text-xl text-accent font-bold">{gameOverContent.moviePoster.tagline}</p>
            </div>
          </div>

          <Button asChild size="lg">
            <Link href="/">Try Again</Link>
          </Button>
        </div>
      </main>
    );
  }

  return null;
}
