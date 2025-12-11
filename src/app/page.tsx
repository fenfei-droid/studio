"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SpeakerLoudIcon } from "@radix-ui/react-icons";
import { TriangleAlert } from "lucide-react";

function WarningDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <TriangleAlert className="text-primary" />
            Content Warning
          </AlertDialogTitle>
          <AlertDialogDescription className="py-4 space-y-4">
            <p>
              This website contains shocking scenes, jump scares, and mature themes. Viewer discretion is advised for pregnant women, the elderly, and those with weak hearts.
            </p>
            <div className="flex items-center gap-3 p-3 rounded-md bg-accent/20 border border-accent/30 text-accent-foreground/80">
              <SpeakerLoudIcon className="w-6 h-6 text-accent" />
              <p>
                Turn up your volume when reading for a more immersive experience.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)}>I Understand</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


export default function Home() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check if the user has seen the warning before
    const hasSeenWarning = sessionStorage.getItem("hasSeenWarning");
    if (!hasSeenWarning) {
      setShowWarning(true);
      sessionStorage.setItem("hasSeenWarning", "true");
    }
  }, []);


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background animate-flicker">
       <WarningDialog open={showWarning} onOpenChange={setShowWarning} />
      <Card className="w-full max-w-lg shadow-2xl animate-fade-in" style={{'--tw-shadow-color': 'hsl(var(--primary))'}}>
        <CardHeader className="text-center">
          <h1 className="text-4xl font-headline font-bold text-primary tracking-wider">
            THE WARD
          </h1>
          <p className="text-lg text-foreground/80 font-headline">Eyeless Escape</p>
        </CardHeader>
        <CardContent className="text-center">
          <CardDescription className="mb-6 text-foreground/90">
            A dare, a deserted hospital and only 1 right decision.
          </CardDescription>
          <Button asChild size="lg" className="w-full font-bold group">
            <Link href="/game/intro-1">
              Begin the Nightmare
              <MoveRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
